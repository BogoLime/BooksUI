import * as React from "react";
import * as ReactDOM from "react-dom";
import { createGlobalStyle } from "styled-components";

import App from "./App";
import { globalStyle } from "./styles";
const GlobalStyle = createGlobalStyle`
  ${globalStyle}
`;
import { BrowserRouter } from "react-router-dom";

import CtxProvider from "./store/Provider"

// @ts-ignore
declare global {
  // tslint:disable-next-line
  interface Window {
    web3: any;
    ethereum: any;
    Web3Modal: any;
    Box: any;
    box: any;
    space: any;
  }
}

ReactDOM.render(
  <>
    <GlobalStyle />
    <BrowserRouter>
    <CtxProvider>
      <App />
    </CtxProvider>
    </BrowserRouter>
  </>,
  document.getElementById("root")
);
