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

function PermitRentScreen(props:any){
    const [hasErrorMsg,setHasErrorMsg] = useState("")
    const [book, setBook] = useState("")
    const [trxHash, setTrxhash] = useState("")
    const [fetching, setFetching] = useState(false)
    const {contract,libToken} = useContext(MyContext)

    function bookChangeHandler(e:React.ChangeEvent<HTMLInputElement>){
        setBook(e.target.value)
    }

    const formFields =[
        {label: "Book",value:book,onChange:bookChangeHandler, type:"text"}

    ]

    function onClickHandler(e:React.FormEvent<HTMLButtonElement>){
        e.preventDefault()
        async function inner(){
            try{

                const signature = await props.onAttemptToApprove()
                console.log(signature)
                const parsedEth = ethers.utils.parseEther("0.1")
                
                const Trx = await contract.permitRentBook(book,parsedEth,signature.deadline,signature.v,signature.r,signature.s)
                

                setTrxhash(`https://ropsten.etherscan.io/tx/${Trx.hash}`)
                

                setFetching(true)
                await Trx.wait()
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

export default PermitRentScreen