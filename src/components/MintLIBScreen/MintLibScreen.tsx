import * as React from 'react';
import FormFactory from '../Forms/FormFactory';
import {useState, useContext} from "react"
import MyContext from 'src/store/ContractContext';
import Loader from '../Loader';
import styled from 'styled-components';
import { ethers } from 'ethers';

const SLink = styled.a`
font-weight:700;
text-decoration:underline
`

function MintScreen(props:any){
    const [amount, setAmount] = useState("")
    const [trxHash, setTrxhash] = useState("")
    const [fetching, setFetching] = useState(false)
    const [hasErrorMsg,setHasErrorMsg] = useState("")
    const context = useContext(MyContext)


    function nameChangeHandler(e:React.ChangeEvent<HTMLInputElement>){
        setAmount(e.target.value)
    }
    
    const formFields =[
        {label: "ETH Amount",value:amount,onChange:nameChangeHandler, type:"number"},
    ]

    function onClickHandler(e:React.FormEvent<HTMLButtonElement>){
        e.preventDefault()
        async function inner(){
            try{  
                const parsedEth = ethers.utils.parseEther(amount)
                const Trx = await context.contract.wrap({value:parsedEth})

                setTrxhash(`https://ropsten.etherscan.io/tx/${Trx.hash}`)

                setFetching(true)

                const receipt = await Trx.wait()
                if(receipt.status !== 1){
                    setHasErrorMsg("Transaction failed")
                }

                setFetching(false)
                }
            catch(e){
                console.log(e)
                if("error" in e){
                    setHasErrorMsg(e.error.message)
                } else if ("message" in e){
                    setHasErrorMsg( e.message)
                }else{
                    setHasErrorMsg("Unexpected Error")
                }
                setFetching(false)
            }
        }

        inner()
    }

    return fetching 
    ?<React.Fragment> 
        <Loader/> 
        <p> {`Check transaction at`} <SLink href={trxHash}> {"Etherscan"}</SLink></p> 
    </React.Fragment>
    :<FormFactory fields = { formFields } btn = {{onClick:onClickHandler, text: "Mint LIB"}} fail={{failMsg:hasErrorMsg,onClick:setHasErrorMsg}}/>
}

export default MintScreen