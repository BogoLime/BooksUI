import {useState, useContext} from "react"
import MyContext from 'src/store/ContractContext';
import FormFactory from "../Forms/FormFactory";
import React from "react";

function SignScreen(props:any){
    const [msg, setMsg] = useState("")
   

    function nameChangeHandler(e:React.ChangeEvent<HTMLInputElement>){
        setMsg(e.target.value)
    }

    const formFields =[
        {label: "Msg",value:msg,onChange:nameChangeHandler, type:"text"},
    ]

    function onClickHandler(e:React.FormEvent<HTMLButtonElement>){
        e.preventDefault()
        props.signMessage(msg)
    }

    return <FormFactory fields = { formFields } btn = {{onClick:onClickHandler, text: "Sign Message"}} fail={{failMsg:""}}/>
}

export default SignScreen