
const initialState = {
    users: {},
    currentUser:'68c03f415fce99c4be3f7156',
    currentPage:0,
    left:0,
    right:null,
    tabs:['Profile','Search','Chat','Users'],
    userAmount:null,
    quotient:null
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case 'MAPPEDUSERS': return {
        	...state,
            users:{...action.payload}
        };
        case 'MAPPEDCURRENT': return {
        	...state,
            currentUser:action.payload
        };
        case 'CHANGEMAPPEDVALUES': return {
            ...state,
            ...action.payload
        };

        default: return state;
    }
};

export default reducer;