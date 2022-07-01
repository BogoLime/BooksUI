import styled from 'styled-components';
import * as React from 'react';
import { colors } from 'src/styles';

const SBox = styled.div`
text-align:center;
background-color:rgb(${colors.red});
width:50%;
padding:1rem;
border-radius: 10px;
margin-bottom:2rem;
color:white;
font-weight:600;
cursor:pointer;
`

function ErrBox (props:any) {
    return <SBox onClick = {() =>props.onClick("")}>
        {props.children}
    </SBox>
}

export default ErrBox