import React from 'react';
import {Link} from 'react-router-dom';

const style = {
    'error':{
        minHeight: `calc(100vh - 4.5rem)`,
        backgroundImage:'linear-gradient(to right bottom, var(--income),teal,var(--expense), var(--expense-light))',
        backgroundSize:'cover',
        backgroundRepeat:'no-repeat',
        backgroundPosition:'center',
        paddingTop:'8rem'
    },
    'error-container':{
        width:'90%',
        height:'70%',
        maxWidth:'90rem',
        margin:'10rem auto',
        display:'flex',
        flexDirection: 'column',
        justifyContent:'center',
        alignItems:'center',
        color:'var(--grey)',
        fontWeight:'lighter',
        fontSize:'2rem'
    },
    'error-header':{
        fontSize:'4rem',
        textAlign:'center',
        color:'var(--grey)'
    },
    'error-link':{
        textDecoration: 'none',
        color: 'var(--text)',
        textTransform:'uppercase',
        transition:'all .4s ease',
        padding:'0 .5rem'
    },
}

const ErrorPage = () => {
    return (
        <main style={style['error']}>
            <section style={style['error-container']}>
                <h1 style={style['error-header']}> Error 404</h1>
                <h3>Page you are looking is not found</h3><br/>
                <h5>Click 
                    <Link style={style['error-link']} to="/"> here</Link> to login</h5>
            </section>
        </main>
    )
}

export default ErrorPage
