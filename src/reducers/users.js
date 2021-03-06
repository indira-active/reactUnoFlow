

const initialState = {
    users: [],
    currentUser:0,
    currentPage:0,
    left:0,
    right:null,
    tabs:['Home','Search','Chat','Users'],
    userAmount:null,
    quotient:null
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case 'USERS': return {
        	...state,
            users:[...action.payload]
        };
        case 'CURRENT': return {
        	...state,
            currentUser:action.payload
        };
        case 'CHANGEPAGEVALUES': return {
            ...state,
            ...action.payload
        };

        default: return state;
    }
};

export default reducer;