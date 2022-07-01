import styled from 'styled-components';
import * as React from 'react';
import { colors } from 'src/styles';
import {useState, useContext, useEffect, useCallback} from "react";
import MyContext from 'src/store/ContractContext';
import Button from '../Button';
import Loader from '../Loader';


const SWrapper = styled.div`
display:grid;
grid-template-columns:1fr 1fr 1fr;
grid-template-rows: 2fr;
align-items:center;
justify-content:center;
background-color: rgb(${colors.lightGrey});
border: 1px solid rgb(${colors.dark});
padding:1rem;
border-radius:10px;
width:100%
`

const SInfoWrapper = styled.div`
display:flex;
align-items:center;
justify-content:center;
`


interface IPara{
    size:string
    weight?:string
    underline?:boolean
    
}

const SPara = styled.p<IPara>`
font-size:${({size})=> (size)};
font-weight:${({weight})=> (weight)};
margin-right:0.5rem;
text-decoration:${({underline})=> (underline ? "underline" : "none")};
`
const SRenterInfoBox = styled.div`
display:flex;
flex-direction:column
align-items:center;
justify-content:center;
background-color: rgb(${colors.lightGrey});
border: 1px solid rgb(${colors.dark});
padding:1rem;
border-radius:10px;
width:100%;
margin-top:2rem;
overflow-y:scroll;
`

function InfoBox(props:any){

    const [showRenterInfo, setShowRenterInfo] = useState(false)
    const [bookCount, setBookCount] = useState(0)
    const [renterData,setRenterData] = useState([])
    const [fetching,setFetching] = useState(false)
    const {contract} = useContext(MyContext)

    const getBookData = useCallback(
        async () => {
            setFetching(true)
            let count = await contract.checkBookCount(props.name)
            count = (+count._hex).toString()
            await setBookCount(count)
            setFetching(false)
            },
        [setBookCount]
    )

    useEffect(
        ()=>{
            getBookData() 
        },
        [getBookData]
    )


    function onClickHandler (e:React.MouseEvent<HTMLButtonElement>){
        e.preventDefault();

        async function  inner() {
            const data = await contract.showRenters(props.name)
            await setRenterData(data)
            setShowRenterInfo(true)
        }

        inner()
       
    }

    return  !fetching 
    ? <React.Fragment>
        <SWrapper>
            <SInfoWrapper>
                <SPara size={"1.2"} weight={"700"}>Book Name:</SPara>
                <SPara size={"1"} underline> {props.name}</SPara>
            </SInfoWrapper>
            <SInfoWrapper>
                <SPara size={"1.2"} weight={"700"}>Available Left:</SPara>
                <SPara size={"1"} underline> {bookCount}</SPara>
            </SInfoWrapper>
            <SInfoWrapper>
                <Button onClick={onClickHandler} fetching={fetching}>Check Renters</Button>
            </SInfoWrapper>
        </SWrapper>
        {showRenterInfo && 
            <SRenterInfoBox>
                {!renterData.length && <SPara size={"1.2"} weight={"700"} underline>{" No Renters Currently"}</SPara>}
                {renterData.length > 0 && renterData.map(el => <SPara size={"1.2"} weight={"700"} key={el} underline>{el}</SPara> )}
            </SRenterInfoBox>
        }
        
    </React.Fragment>

    : <Loader/>
}

export default InfoBox