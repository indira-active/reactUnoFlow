import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './Layout';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter} from "react-router-dom"
import { Provider } from 'react-redux';
import users from "./reducers/users"
import thunk from 'redux-thunk';
import './index.css';
import { createStore,combineReducers,compose,applyMiddleware} from 'redux';

const composeEnhancers = compose;

const rootReducer = combineReducers({
    users
});
const store = createStore(rootReducer,composeEnhancers(
    applyMiddleware(thunk)
));
ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<Layout />
		</BrowserRouter>
	</Provider>
	, document.getElementById('root'));
registerServiceWorker();
