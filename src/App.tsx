import * as React from 'react';
import styled from 'styled-components';

import Web3Modal from 'web3modal';
// @ts-ignore
import WalletConnectProvider from '@walletconnect/web3-provider';
import Column from './components/Column';
import Wrapper from './components/Wrapper';
import Header from './components/Header';
import Loader from './components/Loader';
import ConnectButton from './components/ConnectButton';
import AppRouter from './routes/Router';

import { Web3Provider } from '@ethersproject/providers';
import { getChainData } from './helpers/utilities';
import { getContract } from './helpers/ethers';
import {ContractAddress,LIBAdress} from './constants/address';
import BooksABI from "./constants/abi/BookStore.json"
import LibABI from "./constants/abi/LIBToken.json"
import MyContext from "./store/ContractContext"

import { attachListeners } from './utils/listeners';
import { ethers } from 'ethers';
import Button from './components/Button';
import { Link } from "react-router-dom";

const SLayout = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  text-align: center;
`;

const SContent = styled(Wrapper)`
  width: 100%;
  height: 100%;
  padding: 0 16px;
`;

const SContainer = styled.div`
  height: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  word-break: break-word;
`;

const SLanding = styled(Column)`
  height: 600px;
`;

// @ts-ignore
const SBalances = styled(SLanding)`
  height: 100%;
  & h3 {
    padding-top: 30px;
  }
`;

interface IAppState {
  fetching: boolean;
  address: string;
  library: any;
  connected: boolean;
  chainId: number;
  pendingRequest: boolean;
  result: any | null;
  electionContract: any | null;
  info: any | null;
  contract?:any
}

const INITIAL_STATE: IAppState = {
  fetching: false,
  address: '',
  library: null,
  connected: false,
  chainId: 1,
  pendingRequest: false,
  result: null,
  electionContract: null,
  info: null
};

class App extends React.Component<any, any> {
  public static contextType = MyContext
  // @ts-ignore
  public web3Modal: Web3Modal;
  public state: IAppState;
  public provider: any;

  constructor(props: any) {
    super(props);
    this.state = {
      ...INITIAL_STATE
    };

    this.web3Modal = new Web3Modal({
      network: this.getNetwork(),
      cacheProvider: true,
      providerOptions: this.getProviderOptions()
    });
  }

  public componentDidMount() {
    if (this.web3Modal.cachedProvider) {
      this.onConnect()
    }
    

  }

  public onConnect = async () => {
    this.provider = await this.web3Modal.connect();

    const isValidContract = ethers.utils.isAddress(ContractAddress)
    const isValidLIB =  ethers.utils.isAddress(LIBAdress)

    console.log(`Contract Address is Valid  - ${isValidContract} / LIB Address is Valid  - ${isValidLIB} `)

    const library = new Web3Provider(this.provider);

    const network = await library.getNetwork();

    const address = this.provider.selectedAddress ? this.provider.selectedAddress : this.provider.accounts[0];

    const contract = getContract(ContractAddress,BooksABI.abi,library,address)

    const libToken = getContract(LIBAdress,LibABI.abi,library,address)

    await  this.context.setContract(contract)

    await this.context.setLibToken(libToken)

    await this.setState({
      library,
      chainId: network.chainId,
      address,
      connected: true,
      contract
    });

    await this.subscribeToProviderEvents(this.provider);

  };

  public signMessage = async(messageToSign:string) => {
    const library = this.state.library
    async function inner() {
      const signer = library.getSigner()

      const msgHash = ethers.utils.solidityKeccak256(["string"],[messageToSign])
  
      const arrayfiedHash = ethers.utils.arrayify(msgHash);
  
      const signedMessage = await signer.signMessage(arrayfiedHash);
      console.log("Hashed",msgHash)
      console.log("Signed",signedMessage)
    }

    inner()
    
  }

  public wrapWithSignedMessage = () => {
    const library = this.state.library
    async function inner(hashedMessage:string, signedMessage:string, receiver:string, contract:any) {
      const parsedEth = ethers.utils.parseEther("0.1")
      const sig = ethers.utils.splitSignature(signedMessage);
      const wrapTx = await contract.wrapWithSignature(hashedMessage, sig.v, sig.r, sig.s, receiver, {value: parsedEth})
      await wrapTx.wait()
    }

    return inner
}

public onAttemptToApprove() {
  const { address, library } = this.state;
  const {contract,libToken} = this.context

  async function inner (){
  
  const nonce = (await libToken.nonces(address)); 
  const deadline = + new Date() + 60 * 60; 
  const wrapValue = ethers.utils.parseEther('0.1'); 
  
  const EIP712Domain = [ 
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'verifyingContract', type: 'address' }
  ];

  const domain = {
      name: await libToken.name(),
      version: '1',
      verifyingContract: libToken.address
  };

  const Permit = [ // array of objects -> properties from erc20withpermit
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' }
  ];

  const message = {
      owner: address,
      spender: contract.address,
      value: wrapValue.toString(),
      nonce: nonce.toHexString(),
      deadline
  };

  const data = JSON.stringify({
      types: {
          EIP712Domain,
          Permit
      },
      domain,
      primaryType: 'Permit',
      message
  })

  const signatureLike = await library.send('eth_signTypedData_v4', [address, data]);
  const signature = await ethers.utils.splitSignature(signatureLike)

  const preparedSignature = {
      v: signature.v,
      r: signature.r,
      s: signature.s,
      deadline
  }

  return preparedSignature

}

return inner
}


  public subscribeToProviderEvents = async (provider:any) => {
    if (!provider.on) {
      return;
    }

    provider.on("accountsChanged", this.changedAccount);
    provider.on("networkChanged", this.networkChanged);
    provider.on("close", this.close);

    await attachListeners(this.context.contract)

    await this.web3Modal.off('accountsChanged');
  };

  public async unSubscribe(provider:any) {
    // Workaround for metamask widget > 9.0.3 (provider.off is undefined);
    window.location.reload(false);
    if (!provider.off) {
      return;
    }

    provider.off("accountsChanged", this.changedAccount);
    provider.off("networkChanged", this.networkChanged);
    provider.off("close", this.close);
    await this.context.contract.removeAllListeners()
  }

  public changedAccount = async (accounts: string[]) => {
    if(!accounts.length) {
      // Metamask Lock fire an empty accounts array 
      await this.resetApp();
    } else {
      await this.setState({ address: accounts[0] });
    }
  }

  public networkChanged = async (networkId: number) => {
    const library = new Web3Provider(this.provider);
    const network = await library.getNetwork();
    const chainId = network.chainId;
    await this.setState({ chainId, library });
  }
  
  public close = async () => {
    await this.resetApp();
    await this.context.contract.removeAllListeners()
  }

  public getNetwork = () => getChainData(this.state.chainId).network;

  public getProviderOptions = () => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: process.env.REACT_APP_INFURA_ID
        }
      }
    };
    return providerOptions;
  };

  public resetApp = async () => {
    await this.web3Modal.clearCachedProvider();
    localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER");
    localStorage.removeItem("walletconnect");
    await this.unSubscribe(this.provider);

    this.setState({ ...INITIAL_STATE });

  };

  public render = () => {
    const {
      address,
      connected,
      chainId,
      fetching,
      library
    } = this.state;
    return (
      <SLayout>
        <Column maxWidth={1000} spanHeight>
          <Header
            connected={connected}
            address={address}
            chainId={chainId}
            killSession={this.resetApp}
          />
            <Link to="/">
              <Button color='blue'>Home</Button>
            </Link>
            <Link to="/mint">
            <Button color='green'>Mint LIB 🤑</Button>
            </Link>
          <SContent>
            {fetching ? (
              <Column center>
                <SContainer>
                  <Loader />
                </SContainer>
              </Column>
            ) : (
                <SLanding center>
                  {!this.state.connected 
                  ? <ConnectButton onClick={this.onConnect} /> 
                  : <AppRouter address={address} signMessage ={this.signMessage} 
                  sendSignedMsg = {this.wrapWithSignedMessage()} 
                  library = {library}
                  onAttemptToApprove= {this.onAttemptToApprove()}/>}
                </SLanding>
              )}
          </SContent>
        </Column>
      </SLayout>
    );
  };
}

export default App;
