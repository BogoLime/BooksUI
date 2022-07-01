import styled from 'styled-components';
import * as React from 'react';

import Box from './Box';

const SDiv = styled.div`
display:grid;
grid-template-columns: 1fr 1fr;
grid-template-rows: 1fr 1fr;
justify-content:center;
width: 30rem;
height:25rem;
`

function Home(props:any){
    return <SDiv>
        <Box href = {"/create-book"}>Create Book</Box>
        <Box href = {"/return-book"}>Return Book</Box>
        <Box href = {"/rent-book"}>Rent Book</Box>
        <Box href = {"/available-books"}>Available Books</Box>
    </SDiv>
}

export default Home