import {createContext, useReducer} from 'react'

const AuthContext = createContext()

const initialState = {
    user: null
}

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload }
        case 'LOGOUT':
            return { user: null }
        default:
            return state
    }
}

const AuthProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, initialState)

    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthProvider, AuthContext }