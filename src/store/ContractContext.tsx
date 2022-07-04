import * as React from 'react';


interface IInitial {
    contract: any
    setContract?: any
    libToken: any
    setLibToken?: any
    
}

const INITIAL_STATE:IInitial= {
    contract:"",
    libToken:""
}

const MyContext = React.createContext(INITIAL_STATE);

export default MyContext