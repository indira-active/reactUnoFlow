

const initialState = {
    users: []
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case 'USERS': return {
        	...state,
            users:[...action.payload]
        };

        default: return state;
    }
};

export default reducer;