import * as React from 'react'
import {Routes,
    Route,
  } from "react-router-dom";

import Home from "src/components/HomeScreen/Home";
import CreateScreen from 'src/components/CreateScreen/CreateScreen';
import RentScreen from 'src/components/RentScreen/RentScreen';
import ReturnScreen from 'src/components/ReturnScreen/ReturnScreen';
import AvailableBooksScreen from 'src/components/AvailableBooksScreen/AvailableBooksScreen';

function AppRouter(props:any) {
    return <Routes>
        <Route path ="/" element = {<Home address={props.address}/>}/>
        <Route path ="/create-book" element = {<CreateScreen/>}/>
        <Route path = "/rent-book" element = {<RentScreen/>} />
        <Route path = "/return-book" element = {<ReturnScreen/>} />
        <Route path = "/available-books" element = {<AvailableBooksScreen/>}/>
    </Routes>
}

export default AppRouter