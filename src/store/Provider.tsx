import * as React from 'react';
import MyContext from './ContractContext';
import {useState} from "react";


function CtxProvider (props:any){
const [contract,setContract] = useState("")

    return <MyContext.Provider value={{contract, setContract}}>
            {props.children}
        </MyContext.Provider>
}

export default CtxProvider