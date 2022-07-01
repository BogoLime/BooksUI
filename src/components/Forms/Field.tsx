import styled from 'styled-components';
import * as React from 'react';


const SWrapper = styled.div`
display:flex;
flex-direction:column;
align-items:center;
`

const SInput = styled.input`
width:80%;
height:2rem;
text-align:center;
border-radius:10px;
`

const SLabel = styled.label`
text-align:center;
font-weight:600;
margin-bottom:1rem
`

function FormField (props:any) {
    return <SWrapper>
        <SLabel> {props.label}</SLabel>
        <SInput value = {props.value} onChange ={props.onChange} type={props.type}/>
    </SWrapper>
}

export default FormField