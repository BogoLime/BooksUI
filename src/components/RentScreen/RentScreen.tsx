import * as React from 'react';
import FormFactory from '../Forms/FormFactory';
import {useState, useContext, useEffect} from "react"
import MyContext from 'src/store/ContractContext';
import Loader from '../Loader';
import styled from 'styled-components';
import { ethers } from 'ethers';

const SLink = styled.a`
font-weight:700;
text-decoration:underline
`

function RentScreen(props:any){
    const [name, setName] = useState("")
    const [trxHash, setTrxhash] = useState("")
    const [fetching, setFetching] = useState(false)
    const [hasErrorMsg,setHasErrorMsg] = useState("")
    const context = useContext(MyContext)


    function nameChangeHandler(e:React.ChangeEvent<HTMLInputElement>){
        setName(e.target.value)
    }
    

    const formFields =[
        {label: "Book Name",value:name, onChange:nameChangeHandler, type:"text"},
    ]

    function onClickHandler(e:React.FormEvent<HTMLButtonElement>){
        e.preventDefault()

        async function inner(){
            try{
                const parsedEth = ethers.utils.parseEther("0.1")

                let Trx = await context.libToken.approve(context.contract.address,parsedEth)
                await Trx.wait()

                Trx = await context.contract.rentBook(name)
        
                setTrxhash(`https://ropsten.etherscan.io/tx/${Trx.hash}`)

                setFetching(true)

                const receipt = await Trx.wait()
                if(receipt.status !== 1){
                    setHasErrorMsg("Transaction failed")
                }

                setFetching(false)

                context.contract.on("BookRented", (name:string,renter:string,trx:any) => { 
                    console.log("Book has been rented")
                    console.log(name,renter)
                })

            }catch(e){
                console.log(e)
                // setHasErrorMsg(e.error.message)
            }
        }
    
        inner()
    }

    return fetching 
    ?<React.Fragment> 
        <Loader/> 
        <p> {`Check transaction at`} <SLink href={trxHash}> {"Etherscan"}</SLink></p> 
    </React.Fragment>
    :<FormFactory fields = { formFields } btn = {{onClick:onClickHandler, text: "Rent book"}} fail={{failMsg:hasErrorMsg,onClick:setHasErrorMsg}}/>
}

export default RentScreen