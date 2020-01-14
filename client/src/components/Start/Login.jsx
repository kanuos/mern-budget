import React, {useState, useEffect, useContext} from 'react';
import {Link, Redirect} from 'react-router-dom';
import axios from 'axios';
import {LoginContext} from '../../context/LoginContext';
import {TransactionContext} from '../../context/TransactionContext'
import './start.css';
import HomeLanding from './HomeLanding';

const Login = (props) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [response, setResponse] = useState(props.location.msg)
    const [resCode, setResCode] = useState();
    const [token, setToken] = useState('')

    useEffect(()=>{
       props.location.msg && setResponse(props.location.msg) 
       return (()=>{
        if(response && resCode=== 400){
            setTimeout(()=>{
                setResponse('');
                setResCode(400);
            },1000)
        }
       })
    },[props.location.msg, response, resCode])

    const {setLogIn, setUser} = useContext(LoginContext);
    const {setTransactions} = useContext(TransactionContext)

     return (
        <main className="start-container">
            <HomeLanding />
            <section className="start-form-container" id="login">
                <h1 className="start-heading">Login</h1>

                {response && <span className={`response-message response-${resCode === 400 ? 'error':'success'}`}>{response}</span>}
            

                <form 
                    className="start-form" 
                    autoComplete="off"
                    onSubmit = {e =>{
                        e.preventDefault();
                        const newUser = {
                            email,password
                        }
                        axios.post('/', {...newUser}, {'Content-Type':'Application/JSON'})
                            .then(response =>{
                                if(response.status === 200){
                                    setResponse(response.data.message)
                                    setEmail('');
                                    setPassword('')
                                    setResCode(200);
                                    if (response.data.token){
                                        localStorage.setItem('DB_auth',response.data.token);
                                        // update login status
                                        setLogIn()
                                        setUser(response.data.name)
                                        localStorage.setItem('currentUser', response.data.name)
                                        setToken(response.data.token);
                                        localStorage.setItem('expiry',response.data.expiry)
                                    }
                                    axios.get('/api/',
                                    {headers:{
                                        Authorization:`${response.data.token}`
                                    }}).then(response =>{
                                        if (response.status === 200){
                                            setTransactions([...response.data])
                                            localStorage.setItem('transactions',JSON.stringify([...response.data]))
                                        }
                                    })
                                    .catch(err =>{
                                        err.response && setResponse(err.response.data.error)
                                        setEmail('');
                                        setPassword('');
                                        setResCode(400);                                    
                                    })
                                }
                            })
                            .catch(err => {
                                err && setResponse(err.response.data.error)
                                setEmail('');
                                setPassword('');
                                setResCode(400);
                            })
                }}>

            <div className="input-group">
                <label htmlFor="email">Email <span className="label-required">*</span></label>
                <input 
                    type="email" 
                    name="email" 
                    value = {email}
                    onChange={e => setEmail(e.target.value)}
                    autoFocus = {true}
                    required/>
            </div>
            <div className="input-group">
                <label htmlFor="password">Password <span className="label-required">*</span></label>
                <input 
                    type="password" 
                    name="password" 
                    value = {password}
                    onChange={e => setPassword(e.target.value)}
                    required/>
            </div>
            <div className="input-group">
                <button type="submit">Login</button>
            </div>
        </form>
                <span className="start-muted">
                    Don't have an account? <br/> Click here to
                    <Link className="start-btn-link" to="/register">Sign Up</Link>
                </span>
                <span className="start-muted start-alt-link">
                    <Link to="/budget" className="start-btn-link">
                        Try Demo
                    </Link>
                </span>
            </section>
            {token.length>0 &&  <Redirect to = '/budget'/>}
        </main>

    )
}

export default Login
