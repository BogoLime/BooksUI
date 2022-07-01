import styled from 'styled-components';
import * as React from 'react';
import { colors } from 'src/styles';
import { Link } from "react-router-dom";

const SBox = styled.div`
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
width: 80%;
height:80%;
font-size: 1.2rem;
font-weight:600;
column-gap: 3rem;
border: 1px solid black;
border-radius: 10px;
&:hover {
    background-color:rgb(${colors.lightBlue});
    cursor:pointer;
}
`

function Box(props:any){
    return <Link to={`${props.href}`}>
                <SBox>
                {props.children}
                </SBox>
            </Link>
    
}

export default Box


