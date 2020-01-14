import React, {useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import axios from 'axios';
import './start.css';
import HomeLanding from './HomeLanding';

const SignUp = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [redirect, setRedirect] = useState(false)
    const [responseMsg, setResponse] = useState('')
    const [err, setErr] = useState('')
    const [req, setReq] = useState(true)
    const [isLoading, setLoading] = useState(true)

    React.useEffect(()=>{
        if(!isLoading){
                setRedirect(true)
        }
    },[req, isLoading])

    return (
        <main className="start-container">
            <HomeLanding />
            <section className="start-form-container" id="register">
                <h1 className="start-heading">Register</h1>

            {responseMsg && <span className={`response-message response-${err?'error':'success'}`}>{responseMsg}</span>}

                <form 
                    className="start-form" 
                    autoComplete="off"
                    onSubmit = {e =>{
                        e.preventDefault();
                        const newUser = {
                            email,password,name
                        }
                        setReq(!req)
                        axios.post('/new', {...newUser}, {'Content-Type':'Application/JSON'})
                            .then(response =>{
                                if(response.status === 200){
                                    setResponse(response.data.message)
                                    setLoading(false)
                                    setErr(false)
                                }
                            })
                            .catch(err => {
                                setResponse(err.response.data.error)
                                setPassword('')
                                setErr(true)
                                setLoading(false)
                            })
                    }}
                    >
            
            <div className="input-group">
                <label htmlFor="name">Name <span className="label-required">*</span></label>
                <input 
                    type="text" 
                    name="name" 
                    value = {name}
                    onChange={e => setName(e.target.value)}
                    />
            </div>
            <div className="input-group">
                <label htmlFor="email">Email <span className="label-required">*</span></label>
                <input 
                    type="email" 
                    name="email" 
                    value = {email}
                    onChange={e => setEmail(e.target.value)}
                    />
            </div>
            <div className="input-group">
                <label htmlFor="password">Password <span className="label-required">*</span></label>
                <input 
                    type="password" 
                    name="password" 
                    value = {password}
                    onChange={e => setPassword(e.target.value)}
                    />
            </div>
            <div className="input-group">
                <button type="submit">Register</button>
            </div>
        </form>
                <span className="start-muted">
                    Already have an account? <br/> Click here to
                    <Link className="start-btn-link" to="/login">Login</Link>
                </span>
                <span className="start-muted start-alt-link">
                    <Link to="/budget" className="start-btn-link">
                        Try Demo
                    </Link>
                </span>
            </section>
            {redirect && <Redirect to={{pathname:'/login',msg:responseMsg}}/> }
        </main>

    )
}

export default SignUp
