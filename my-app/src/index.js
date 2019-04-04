import React from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "@coreui/coreui/dist/css/coreui.min.css";
import "@coreui/coreui";
render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);

// // import the Create Store Form rduex for Creating Stroe
// import {createStore,combineReducers,applyMiddleware} from 'redux'
// import logger from 'redux-logger'



// //creating reducer for actions peroforming
// const mathReducer=(state={
//   result:1,
//   lastValues:[]
// },action)=>{
//     switch(action.type){
//         case "ADD":
//             state={
//               ...state,
//               result: state.result+ action.payload,
//               lastValues:[...state.lastValues,action.payload]
//             }
//             break;
//         case "SUBRACT":
//             state={
//               ...state,
//               result: state.result-action.payload,
//               lastValues:[...state.lastValues,action.payload]
//             }
//             break;
//     }
//     return state;
// }

// const userReducer=(state={
//   name:"Vishva",
//   age:23
// },action)=>{
//   switch(action.type){
//       case "SET_NAME":
//           state={
//             ...state,
//             name:action.payload,
//           }
//           break;
//       case "SET_AGE":
//           state={
//             ...state,
//             age:action.payload,
//           }
//           break;
//   }
//   return state;
// }

// const myLogger=(store)=>(next)=>(action)=>{
//   console.log("Loged Actions : ",action);
//   next(action);
// }

// //create store 
// const store=createStore(combineReducers({mathReducer,userReducer}),{},applyMiddleware(logger));
// //show the log messges when store calling
// store.subscribe(()=>{
//     // console.log("Store is Updated! ",store.getState());
// })
// //call the store or Call the Actions
// store.dispatch({
//     type:"ADD",
//     payload:10
// })

// store.dispatch({
//   type:"ADD",
//   payload:101
// })

// store.dispatch({
//   type:"SUBRACT",
//   payload:101
// })

// store.dispatch({
//   type:"SET_AGE",
//   payload:22
// })
// store.dispatch({
//   type:"SET_NAME",
//   payload:"AKASH"
// })