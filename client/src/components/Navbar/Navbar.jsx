import React, {useContext} from 'react';
import {Link, NavLink} from 'react-router-dom';
import {GiAbacus} from 'react-icons/gi';
import { LoginContext } from '../../context/LoginContext';
import {TransactionContext} from '../../context/TransactionContext';
import './navbar.css';

const Navbar = () => {
    const {isLoggedIn, setLogOut} = useContext(LoginContext);
    const {setTransactions}  = useContext(TransactionContext)

    document.addEventListener('scroll',(e)=>{
        const nav = document.getElementById('nav');
        if(document.documentElement.scrollTop >= 10){
            nav.classList.add('nav-bg');
        }
        else{
            nav.classList.remove('nav-bg');
        }
    })

    return (
        <nav id="nav">
            <div className="container">
                <div className="nav-logo-box">
                    <GiAbacus className="nav-logo__img" /> 
                    { isLoggedIn ?
                        <Link  onClick={()=>{
                            // document.documentElement.style.overflowY='scroll';
                            document.documentElement.scrollTo(0,0);
                            }} to="/budget" className="nav-logo__text nav-link ">
                        Budget Keeper
                    </Link> :
                    <Link to="/login" onClick={()=>{
                        // document.documentElement.style.overflowY='scroll';
                        document.documentElement.scrollTo(0,0);
                        }} className="nav-logo__text nav-link ">
                        Budget Keeper
                    </Link>}
                </div>
                                {/* this is for the JWT verified users */}
                {isLoggedIn ? 
                <ul className="nav-list">
                    <li className="nav-item">
                        <NavLink activeClassName="active" className="nav-link" to="/report">Report</NavLink>
                    </li>
                    <li className="nav-item" onClick = {()=>{
                            localStorage.clear();
                            setTransactions([])
                            setLogOut()
                        }}>
                            <NavLink  activeClassName="active" className="nav-link" to="/login">Log Out </NavLink>
                    </li>
                </ul>
                :  
                <ul className="nav-list">
                    <li className="nav-item">
                        <NavLink  onClick = {()=> document.documentElement.scrollTo(0,1000)} activeClassName="active"  className="nav-link" to="/login">Log In</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink onClick = {()=> document.documentElement.scrollTo(0,1000)}  activeClassName="active"  className="nav-link" to="/register">Sign Up</NavLink>
                    </li>
                </ul>}

                            {/* fpr the guest user there wont be any logout report only sign up sign in */}
            </div>
        </nav>
    )
}

export default Navbar
