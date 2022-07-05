

import styled from 'styled-components';
import * as React from 'react';


const SHeading = styled.h3`
margin-bottom:4rem;
`

function TokenBalance (props:any){
    return  <SHeading>
        {props.children}
    </SHeading>
}

export default TokenBalance