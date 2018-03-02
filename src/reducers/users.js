

const initialState = {
    users: [],
    currentUser:4
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

        default: return state;
    }
};

export default reducer;