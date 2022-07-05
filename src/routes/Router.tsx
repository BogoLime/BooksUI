import * as React from 'react'
import {Routes,
    Route,
  } from "react-router-dom";

import Home from "src/components/HomeScreen/Home";
import CreateScreen from 'src/components/CreateScreen/CreateScreen';
import RentScreen from 'src/components/RentScreen/RentScreen';
import ReturnScreen from 'src/components/ReturnScreen/ReturnScreen';
import AvailableBooksScreen from 'src/components/AvailableBooksScreen/AvailableBooksScreen';
import SignScreen from 'src/components/SignScreen/SignScreen';
import SendSignScreen from 'src/components/SignScreen/SendSignedScreen';
import DelegateRentBook from 'src/components/SignScreen/DelegateRentScreen';
import PermitRentScreen from 'src/components/SignScreen/PermitRentScreen';
import MintScreen from 'src/components/MintLIBScreen/MintLibScreen';

function AppRouter(props:any) {
    return <Routes>
        <Route path ="/" element = {<Home address={props.address}/>}/>
        <Route path ="/mint" element = {<MintScreen/>}/>
        <Route path ="/create-book" element = {<CreateScreen/>}/>
        <Route path = "/rent-book" element = {<RentScreen/>} />
        <Route path = "/return-book" element = {<ReturnScreen/>} />
        <Route path = "/available-books" element = {<AvailableBooksScreen/>}/>
        <Route path = "/sign-message" element = {<SignScreen signMessage = {props.signMessage}/>}/>
        <Route path = "/send-sign-message" element = {<SendSignScreen sendSignedMsg = {props.sendSignedMsg}/>}/>
        <Route path = "/delegate-rent" element = {<DelegateRentBook library = {props.library} />}/>
        <Route path = "/permit-rent" element = {<PermitRentScreen onAttemptToApprove = {props.onAttemptToApprove} />}/>
    </Routes>
    
}

export default AppRouter