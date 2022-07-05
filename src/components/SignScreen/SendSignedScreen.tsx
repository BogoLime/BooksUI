import {useState, useContext} from "react"
import MyContext from 'src/store/ContractContext';
import FormFactory from "../Forms/FormFactory";
import React from "react";
import Loader from "../Loader";
import styled from 'styled-components';

const SLink = styled.a`
font-weight:700;
text-decoration:underline
`

function SendSignScreen(props:any){
    const [hashed, setHashed] = useState("")
    const [signed, setSigned] = useState("")
    const [receiver, setReceiver] = useState("")
    const [hasErrorMsg,setHasErrorMsg] = useState("")
    const [trxHash, setTrxhash] = useState("")
    const [fetching, setFetching] = useState(false)
    const {contract} = useContext(MyContext)
   

    function hashChangeHandler(e:React.ChangeEvent<HTMLInputElement>){
        setHashed(e.target.value)
    }

    function signChangeHandler(e:React.ChangeEvent<HTMLInputElement>){
        setSigned(e.target.value)
    }

    function receiverChangeHandler(e:React.ChangeEvent<HTMLInputElement>){
        setReceiver(e.target.value)
    }

    const formFields =[
        {label: "Hashed Msg",value:hashed,onChange:hashChangeHandler, type:"text"},
        {label: "Signed Msg",value:signed,onChange:signChangeHandler, type:"text"},
        {label: "Receiver",value:receiver,onChange:receiverChangeHandler, type:"text"},

    ]

    function onClickHandler(e:React.FormEvent<HTMLButtonElement>){
        e.preventDefault()
        async function inner(){
            try{    
                const Trx =  await props.sendSignedMsg(hashed, signed,receiver,contract)
                setTrxhash(`https://ropsten.etherscan.io/tx/${Trx.hash}`)

                setFetching(true)

                const receipt = await Trx.wait()
                if(receipt.status !== 1){
                    setHasErrorMsg("Transaction failed")
                }
                
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
    ? <React.Fragment> 
        <Loader/> 
        <p> {`Check transaction at`} <SLink href={trxHash}> {"Etherscan"}</SLink></p> 
      </React.Fragment>
    :<FormFactory fields = { formFields } btn = {{onClick:onClickHandler, text: "Sign Send"}} fail={{failMsg:hasErrorMsg,onClick:setHasErrorMsg}} />

}

export default SendSignScreen