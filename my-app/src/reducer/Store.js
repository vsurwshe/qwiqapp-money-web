// import the Create Store Form rduex for Creating Stroe
import {createStore} from 'redux'


const reducer=(state,action)=>{
    switch(action.type){
        case "ADD":
            state=state+action.payload;
            break;
        case "SUBRACT":
             state=state-action.payload;
            break;
    }
    return state;
}

const store=createStore(reducer,1);

store.subscribe(()=>{
    console.log("Store is Updated",store.getState());
})

store.dispatch({
    type:"ADD",
    payload:10
})