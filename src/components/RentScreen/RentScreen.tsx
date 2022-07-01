import * as React from 'react';
import FormFactory from '../Forms/FormFactory';
import {useState, useContext} from "react"
import MyContext from 'src/store/ContractContext';
import Loader from '../Loader';
import styled from 'styled-components';

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
            const Trx = await context.contract.rentBook(name)
    
            setTrxhash(`https://ropsten.etherscan.io/tx/${Trx.hash}`)

            setFetching(true)

            const receipt = await Trx.wait()
            if(receipt.status !== 1){
                setHasErrorMsg("Transaction failed")
            }

            setFetching(false)
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