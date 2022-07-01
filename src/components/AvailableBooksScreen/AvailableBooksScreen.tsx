import styled from 'styled-components';
import * as React from 'react';

import ItemBox from './ItemBox';
import {useContext, useEffect, useState, useCallback} from "react"
import MyContext from 'src/store/ContractContext';
import InfoBox from './InfoBox';

const SContainer = styled.div`
display:flex;
flex-direction:column;
width:100%;
height:70%;
overflow:scroll
paddding : 1rem;
`


function AvailableBooksScreen (props:any){
    const {contract} = useContext(MyContext)
    const [showInfo, setShowInfo] = useState(false)
    const [books,setBooks] = useState([])
    const [loadedBook, setLoadedBook] = useState("")

    const showAvailable = useCallback(
        async () => {
            const res = await contract.showAvailable()
            setBooks(res)
            },
        [setBooks]
    )

    useEffect(
        ()=>{
            showAvailable() 
        },
        [showAvailable]
    )

    function handlerWrapper(name:string) {

        async function inner (){
            await setLoadedBook(name)
            await setShowInfo(true)
        }
        
        function innerHandler(){
            inner()
        }

        return innerHandler
    }


  return   !showInfo 
  ?  <SContainer>
      {books.map(el => <ItemBox name={el} key={el} onClick={handlerWrapper(el)}/> )}
  </SContainer>
  : <InfoBox name={loadedBook}/>
}

export default AvailableBooksScreen