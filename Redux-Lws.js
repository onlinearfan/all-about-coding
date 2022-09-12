/**
 * !make basic redux store with vanilla redux :
 * add redux and import create store redux.creatStore,
 * make initialState,reducers [you can make also action creator and action dispatch function to use easy way,]
 * make store by store = createSTore(reducers);
 * make subscribe function store.subscribe(()=>{store.getState})  this will run after each dispatch call,
 * call action dispatch ,
 */

//make a reducer function of increment decrement value of counter,

const redux = require('redux');
const createStore = redux.createStore;

//action creator and dispatch function
const INCREMENT = 'increment';
const DECREMENT = 'decrement';

//dispatch functions
function increment(incrementValue) {
   return {
      type: INCREMENT,
      payload: incrementValue,
   };
}

function decrement(decrementValue) {
   return {
      type: DECREMENT,
      payload: decrementValue,
   };
}

//initial states
const initialState = {
   counterValue: 0,
};

//reducer function
const counterReducer = (state = initialState, action) => {
   if (action.type === INCREMENT) {
      //do your logic here,
      return {
         ...state,
         counterValue: state.counterValue + action.payload,
      };
   } else if (action.type === DECREMENT) {
      return {
         ...state,
         counterValue: state.counterValue - action.payload,
      };
   } else {
      return state;
   }
};

//render function
const render = () => {
   console.log(store.getState(), 'render function');
};
render(); //initial calling ,

const store = createStore(counterReducer);
const unsubscribe = store.subscribe(render); //render function will call after every dispatch action,

//action dispatches
store.dispatch({
   type: INCREMENT,
   payload: 2,
});

store.dispatch(increment(5));
store.dispatch(decrement(3));

//unsubscribe store
unsubscribe();

/**
 * !Make multiple Reducer with combileReducer,
 * make 2 redux store and pass it into combineReducer({cake:cakeReducer,iceCream: iceCreamReducer})
 * pass the root reducer the into createStore(rootReducer);
 * make store.getState(); add store.subcribe() ,
 * now call action dispatch by action name,
 *
 */

const redux = require('redux');
const createStore = redux.createStore;
const combineReducer = redux.combineReducer;

//make two reducer cakeReducer and iceCreamReducer with action
//lets example we have numOfCake, numOfIceCream, and orderCake and orderIceCream action , when w order something it will reduce form numbers,

const rootReducer = combineReducer({
   cake: cakeReducer,
   iceCream: iceCreamReducer,
});

const store = createStore(rootReducer);

function render() {
   console.log('render f', store.getState());
}
render(); //intial calling
store.subscribe(render);

//make action dispatch

store.dispatch({
   type: 'order_iceCream',
   payload: 20, //all dispatch will reducer form store,
});

store.dispatch({
   type: 'order_cake',
   payload: 30,
});

/**
 * !how to bindActionCreator
 * import bindActionCreator from redux,
 * const action = bindActionCreator({},store.dispatch);
 * now use action({type:'order'});
 *
 */

const bindAcitonCreator = redux.bindAcitonCreator;

//call dispatch,
const action = bindAcitonCreator({}, store.dispatch);
action({
   type: 'orderCake',
});

/**
 * !add immer for manage nested state easily :
 * import immer and pass it into middleware, applyMiddleware, immer.produce,
 * when make a reducer return use produce function and draft and return,  direct ways,
 *
 */

const immer = redux.immer;
const applyMiddleware = redux.applyMiddleware;
const produce = immer.produce;

const intialState = {
   numOfCake: 10,
};

const cakeReducer = (state = initialState, action) => {
   if (action.type === 'order_cake') {
      return produce(state, (draft) => {
         //draft will copy my object state,
         draft.numOfCake = draft.numOfCake - action.payload;
      });
   }
};

const store = createStore(cakeReducer, applyMiddleware(immer));

store.dispatch({
   type: 'order_cake',
   payload: 2,
});

/**
 * !Make applyMIddleware with logger
 * add applyMiddleware and logger
 * pass createStore(reducer,applyMiddleware(logger));
 */

const logger = reduxLogger.createLogger();
const applyMiddleware = redux.applyMiddleware;

const store = createStore(reducer, applyMiddleware(logger));

/**
 * make user data fetch function by redux thunk middleware,
 * add redux thunk and pass it into applyMiddleware, add axios,
 * make reducer with action name[fetch_user_req,fetch_user_success,fetch_user_error]; pass user data when success and pass user Error whn error
 *
 * add dispathc and pass fetchUser function and this will handle 3 dispatch req,success, and error,
 *
 *
 */

const thunk = redux.thunk;
const applyMiddleware = redux.applyMiddleware;

const users = {
   isLoading: true,
   users: [],
   errorMessage: '',
};

const userFetchReducer = (state = users, action) => {
   if (action.type === 'fetch_user_req') {
      return {
         isLoading: true,
         users: [],
         errorMessage: '',
      };
   } else if (action.type === 'fetch_user_success') {
      return {
         isLoading: false,
         users: action.payload,
         errorMessage: '',
      };
   } else if (action.type === 'fetch_user_error') {
      return {
         isLoading: false,
         users: [],
         errorMessage: action.payload,
      };
   } else {
      return state;
   }
};

//then and catch method,
function fetchUser() {
   dispatch({ type: 'fetch_user_req' });
   axios
      .get('link')
      .then((res) => {
         const users = res.data.user;
         dispatch({ type: 'fetch_user_success', payload: users });
      })
      .catch((err) => dispatch({ type: 'fetch_user_error', payload: err }));
}

//type catch way,
async function getUser() {
   dispatch({ type: 'fetch_user_req' });
   try {
      const users = await axios.get('link').data.user;
      dispatch({ type: 'fetch_user_success', payload: users });
   } catch (error) {
      dispatch({ type: 'fetch_user_error', payload: error });
   }
}

store.dispatch(fetchUser());


//---------------------------------------End Vanilla Redux -----------------------------------
/**
 * !use ReduxToolkit with making slice Store, basic way, 
 * make a basic cakeSlice and add name, initialValue,reducers,add action into reducers, 
 * make store with storeConfigure{cake:cakeSlice,}
 * 
 */

 const createSlice = require('@reduxjs/toolkit').createSlice
 const initialState = {
     numOfcake:10,
 }
 const cakeSlice = createSlice({
     name:'cake', //cake/orders,
     initialState,
     reducers:{
         orders:(state,action)=>{
             state.numOfCake = state.numOfCake - action.payload,
         },
         restock:(state,action)=>{
             state.numOfCake = state.numOfCake + action.payload,
         }
 
     },
     extraReducer:{
         'iceCream/orders':(state)=>{
             state.numOfCake--;
         }
     },
     extraReducer:(builder)=>{
         builder.addCase(iceCreamActions.orders,(state)=>{
             state.numOfCake--;
         })
     }
 })
 
 mudule.export  = cakeSlice.reducers;
 module.export.cakeActions = cakeSlice.action;
 
 //*store.js 
 const configureStore = require('@reduxjs/toolkit').configureStore;
 const cakeReducer = require('cakeSlice');
 
 const store = configureStore({
     reducers:{
         cake:cakeReducer
     }
 });
 
 module.export = store;
 
 //* use this store by dispatch 
 const store = require('store.js');
 const cakeActions = require('cakeSlice').cakeActions;
 
 console.log('initial state',store.getState());
 const unsubscribe = store.subscribe(()=>{
     console.log('updated state',store.getState());
 })
 
 store.dispatch(cakeActions.orders());

 /**
  * fetch user data with redux toolkit and async thunk, 
  */

 //* fetch user by async thunk and redux toolkit :
const axios = require('axios')
const createSlice = require('@reduxjs/toolkit').createSlice
const createAsyncThunk = require('@reduxjs/toolkit').createAsyncThunk

const initialState = {
  loading: false,
  users: [],
  error: ''
}

// Generates pending, fulfilled and rejected action types
const fetchUsers = createAsyncThunk('user/fetchUsers', () => {
  return axios
    .get('https://jsonplaceholders.typicode.com/users')
    .then(response => response.data.map(user => user.id))
})

const userSlice = createSlice({
  name: 'user',
  initialState,
  extraReducers: builder => {
    builder.addCase(fetchUsers.pending, state => {
      state.loading = true
    })
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.loading = false
      state.users = action.payload
      state.error = ''
    })
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false
      state.users = []
      state.error = action.error.message
    })
  }
})

module.exports = userSlice.reducer
module.exports.fetchUsers = fetchUsers



/**
 * ?how to make a store
 * add redux, and create store,
 * and make store like createStore(reducer);
 * show initial on console.log ('initialState',store.getState())
 * make unsubscribe function store.subscrite(()=>{ });
 * make dispatch like store.dispatch({type:"CAKE_ORDER"});
 * unsubscribe();
 * 
 * 
 * ?how to make multiple reducer and see,
 * add redux, and make a createSTore, add combineReducer,
 * make a redux store name by demoReducer, and
 * after make all initial state,action and reducer add it into combineReducer({cake:cakeREducer}) and make bildActionCreateor for ease action,
 * make dispatch,
 *
 * ?how to bindActionCreator :
 * add bindAcitonCreator form redux
 * add it by bindActionCreator({pass action function },store.dispatch);
 *
 * ?add immer for manage nested state easily :
 * add immer.produce and use it
 * return produce(state,(draft)=>{ draft.address.phone="13403234"})
 *
 * ?what is applyMiddleware and how to use it?
 * applyMIddleware is use for add other functional works with our reducer,
 * add applyMiddleware by redux.applyMiddleware , createStore(reducer,applyMIddleware(logger)),
 *
 * ?how to add logger as middleware :
 * add logger by reduxLogger.createLogger();
 * go to logger doc.
 * 
 * ?how to manage async data fetch user by redux thunk Middleware, 
 * add redux thunk and pass into createStore(reducer,applyMiddleware(thunk));
 * to fetch data from user by async task we have to go through 3 steps loding, success, error, 
 * make a function fo fetch data with dispatch and use this, 
function fetchUser(){
    return function(dispatch){
        dispatch(Fetch_user_Request);
        axios.get("link",)
        .then((res)=>{
           const users =  res.data.users.map((user)=>{
                return user.id;
            })
            dispatch(fetch_user_success(users))
        }).catch((err)=>dispatch(fetch_user_err(err.message)))
    }
}
 * 
 *store.dispatch(fetchUser()); // this will action three time, 
 * 
 */


/**
 * action type , action reducer, action dispatch, 
 * reducer connect to store, and provider e store pass, 
 * and action dispatch yours,
 */

//=================================
/**
 * !make redux store and use  it on react project 
 * -)make redux store in redux folder [action-types,actions,reducers,store,]
 * -)pass the store into provider tag, 
 * -)get store data by const state = useSelector(state => state.counter.name); 
 * -)call action-dispatch by const dispatch = useDispatch(); dispatch(increment(2));
 */

//singleblogs.js 

const blogs = useSelector(state => state.blogs);
const dispatch = useDispatch();

const increment = (value)=>{
   dispatch(incrementValue(value));
}

<h1 onClick={()=>increment(2)}>increment</h1>


/**
 * !how to add redux dev tool :
 * -)add chorm extention of redux dev tools and use, 
 * -)add compose DEv tool fuction 
 */

 import { applyMiddleware, createStore } from 'redux';
 import { devToolsEnhancer, composeWithDevTools } from 'redux-devtools-extension';
 import Reducer from '../reducer';
 
 const store = createStore(Reducer, composeWithDevTools(applyMiddleware()));
//  const store = createStore(rootReducer, devToolsEnhancer());
 export default store;