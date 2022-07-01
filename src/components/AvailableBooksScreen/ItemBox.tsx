import styled from 'styled-components';
import * as React from 'react';
import { colors } from 'src/styles';
import Button from '../Button';

const SWrapper = styled.div`
display:grid;
grid-template-columns:1fr 1fr;
grid-template-rows: 1fr;
align-items:center;
justify-content:center;
background-color: rgb(${colors.lightGrey});
border: 1px solid rgb(${colors.dark});
padding:1rem;
border-radius:10px;
width:100%;
margin-bottom:1rem;
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

function ItemBox (props:any) {
 return <SWrapper>
     <SInfoWrapper>
         <SPara size={"1.2"} weight={"700"}>Book Name:</SPara>
         <SPara size={"1"}> {props.name}</SPara>
     </SInfoWrapper>
     <SInfoWrapper>
        <Button onClick={props.onClick}>Check Details</Button>
     </SInfoWrapper>
 </SWrapper>
}



export default ItemBox