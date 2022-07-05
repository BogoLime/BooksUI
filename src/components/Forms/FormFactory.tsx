import styled from 'styled-components';
import * as React from 'react';

import FormField from './Field';
import Button from '../Button';

import ErrBox from '../Error/ErrBox';

const SForm = styled.form`
display:flex;
flex-direction:column;
align-items:space-between;
justify-content:space-around;
height:25rem;
width:20rem;
border: 1px solid black;
padding:2rem;
border-radius:10px
`

const SBtnDiv = styled.div `
 width:100%;
`


function FormFactory (props:any){
            
     return <React.Fragment>
         {props.fail.failMsg && <ErrBox onClick={props.fail.onClick}>{props.fail.failMsg}</ErrBox>}
        <SForm>
                {props.fields.map( (field:any) => <FormField label={field.label} value={field.value} type={field.type} onChange = {field.onChange} key = {(Math.random).toString()}/>)}
                <SBtnDiv>
                    <Button onClick={props.btn.onClick}> {props.btn.text}</Button>
                </SBtnDiv>
        </SForm>
    </React.Fragment>
}

export default FormFactory
