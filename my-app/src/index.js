import React from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import {Provider} from 'react-redux';
import configureStore from './redux/container/configureStore';
import App from "./App";
import "@coreui/coreui/dist/css/coreui.min.css";
import "@coreui/coreui";
const store=configureStore();

render(
  <Provider store={store}>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

