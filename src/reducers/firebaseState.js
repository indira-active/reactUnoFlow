
const initialState = {
    auth:null,
    database:null,
    storage:null,
    firebase:null,
    db:null,
    messaging:null
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case 'FIRERECONCILE': return {
        	...state,
            ...action.payload
        };

        default: return state;
    }
};

export default reducer;