import styled from 'styled-components';
import * as React from 'react';
import TokenBalance from '../tokenBalance';
import {useCallback,useContext, useEffect} from "react"
import MyContext from 'src/store/ContractContext';
import { ethers } from 'ethers';
import Box from './Box';

const SDiv = styled.div`
display:grid;
grid-template-columns: 1fr 1fr;
justify-content:center;
width: 30rem;
height:45rem;
`

function Home(props:any){
    const {libToken} = useContext(MyContext)
    const [libBalance, setLibBalance] = React.useState("0");

    const getBalance = useCallback(
        async () => {
            const res = await libToken.balanceOf(props.address)
            const value = ethers.utils.formatEther(res)
            setLibBalance(value)
            },
        [setLibBalance]
    )

    useEffect(
        ()=>{
            getBalance() 
        },
        [getBalance]
    )

    return <React.Fragment>
        <TokenBalance> Your LIB Balance: <p>💸 {libBalance} LIB 💸</p> </TokenBalance>
        <SDiv>
            <Box href = {"/create-book"}>Create Book</Box>
            <Box href = {"/return-book"}>Return Book</Box>
            <Box href = {"/rent-book"}>Rent Book</Box>
            <Box href = {"/available-books"}>Available Books</Box>
            <Box href = {"/sign-message"}>Sign Message</Box>
            <Box href = {"/send-sign-message"}>Transfer Signed Coins</Box>
            <Box href = {"/delegate-rent"}>Delegated Rent</Box>
            <Box href = {"/permit-rent"}> Rent With Permit</Box>
        </SDiv>
    </React.Fragment>
}

export default Home