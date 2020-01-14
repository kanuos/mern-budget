import React from 'react'

export const LoginContext = React.createContext(false)

const LoginContextProvider = (props) => {
    const expiry = localStorage.getItem('expiry');
    const [isLoggedIn, setLog] = React.useState((expiry && JSON.parse(expiry) > Date.now())?true:false)
    const [user, setUser] = React.useState()


    const setLogIn = () =>{
        setLog(true)
    }
    
    const setLogOut = () =>{
        setLog(false);
    }
    return (
        <LoginContext.Provider value={{isLoggedIn, setLogIn, setLogOut, user, setUser}}>
            {props.children}
        </LoginContext.Provider>
    )
}

export default LoginContextProvider
