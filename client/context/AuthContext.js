import { createContext, useReducer, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import authAxios from '../utils/axios'
import axios from 'axios'
import cookie from 'js-cookie';

axios.defaults.baseURL = process.env.API_URL

let initialState = {
    user: null
}

function reducer(state, action){
    switch(action.type){
        case 'USER':
            return{
                ...state,
                user: action.payload,
            }
        case 'LOGOUT':
            return{
                ...state,
                user: null
            }
        default:
            return state
    }
}


export const AuthContext = createContext({
    user: null,
    loginUser: (values) => {},
    logoutUser: () => {}
});

export const MiscContext = createContext({})

export const AuthProvider = (props) =>{
    const [insta, setInsta] = useState('')
    const [loginError, setLoginError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [state, dispatch] = useReducer(reducer, initialState)
    const router = useRouter()

    const loginUser = async (values) => {
        await axios.post('/login', values).then((res) => {
            if (res.status == 200){
                setLoginError(false)
                cookie.set("access_token", res.data.access_token)
                cookie.set("refresh_token", res.data.refresh_token)
                router.push('/dashboard')
            }
        }).catch((err) => {
            setLoginError(true)
        })
    }

    const logoutUser = async() => {
        authAxios.post('/logout')
        cookie.remove("access_token")
        cookie.remove("refresh_token")
        
        dispatch({ type: 'LOGOUT' });
        router.push('/')
    }

   useEffect(() => {
        const fetchUser = async () => {
            await authAxios.get('/users/me').then((res) => {
                dispatch({
                    type: 'USER',
                    payload: res.data.data
                })
            })
            setLoading(true)
        }
        fetchUser()
    }, [])

    return(
        <AuthContext.Provider value={{ user: state.user, loginUser, logoutUser}}>
            <MiscContext.Provider value={{loading, insta, setInsta, loginError}}>
            {props.children}
            </MiscContext.Provider>
        </AuthContext.Provider>
    )
}

export default AuthContext