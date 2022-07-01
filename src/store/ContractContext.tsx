import * as React from 'react';


interface IInitial {
    contract: any
    setContract?: any
    
}

const INITIAL_STATE:IInitial= {
    contract:""
}

const MyContext = React.createContext(INITIAL_STATE);

export default MyContext