import * as React from 'react';
import MyContext from './ContractContext';
import {useState} from "react";


function CtxProvider (props:any){
const [contract,setContract] = useState("");
const [libToken,setLibToken] = useState("")

    return <MyContext.Provider value={{contract, setContract,libToken, setLibToken}}>
            {props.children}
        </MyContext.Provider>
}

export default CtxProvider