import {useState, useContext} from "react"
import MyContext from 'src/store/ContractContext';
import FormFactory from "../Forms/FormFactory";
import React from "react";
import { ethers } from "ethers";
import Loader from "../Loader";
import styled from 'styled-components';


const SLink = styled.a`
font-weight:700;
text-decoration:underline
`

function DelegateRentBook(props:any){
    const [hashed, setHashed] = useState("")
    const [signed, setSigned] = useState("")
    const [renter, setRenter] = useState("")
    const [book, setBook] = useState("")
    const [trxHash, setTrxhash] = useState("")
    const [fetching, setFetching] = useState(false)
    const [hasErrorMsg,setHasErrorMsg] = useState("")
    const {contract,libToken} = useContext(MyContext)
   

    function hashChangeHandler(e:React.ChangeEvent<HTMLInputElement>){
        setHashed(e.target.value)
    }

    function signChangeHandler(e:React.ChangeEvent<HTMLInputElement>){
        setSigned(e.target.value)
    }

    function receiverChangeHandler(e:React.ChangeEvent<HTMLInputElement>){
        setRenter(e.target.value)
    }

    function bookChangeHandler(e:React.ChangeEvent<HTMLInputElement>){
        setBook(e.target.value)
    }

    const formFields =[
        {label: "Hashed Msg",value:hashed,onChange:hashChangeHandler, type:"text"},
        {label: "Signed Msg",value:signed,onChange:signChangeHandler, type:"text"},
        {label: "Rent to",value:renter,onChange:receiverChangeHandler, type:"text"},
        {label: "Book",value:book,onChange:bookChangeHandler, type:"text"}

    ]

    function onClickHandler(e:React.FormEvent<HTMLButtonElement>){
        e.preventDefault()
        async function inner(){
            try{

                setFetching(true)
                const parsedEth = ethers.utils.parseEther("0.1")
                
                const Trx = await libToken.approve(contract.address,parsedEth)
                await Trx.wait()

                setTrxhash(`https://ropsten.etherscan.io/tx/${Trx.hash}`)
                
                const sig = ethers.utils.splitSignature(signed);
                const wrapTx = await contract.delegateRentBook(hashed, sig.v, sig.r, sig.s, renter,book, {value: parsedEth})
                setTrxhash(`https://ropsten.etherscan.io/tx/${wrapTx.hash}`)
                
                await wrapTx.wait()
                setFetching(false)

            } catch(e){
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
    :
    <FormFactory fields = { formFields } btn = {{onClick:onClickHandler, text: "Send Message"}} fail={{failMsg:hasErrorMsg,onClick:setHasErrorMsg}}/>
}

export default DelegateRentBook