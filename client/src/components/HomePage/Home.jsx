import React from 'react'
import Header from './Header';
import ListView from './ListView';
import './home.css';

const Home = () => {
    const startDate = Date.parse(`${new Date().getUTCFullYear()}-${new Date().getUTCMonth()<9 ? `0${new Date().getUTCMonth()+1}`:new Date().getUTCMonth()+1}-01`);

    return (
        <div className="home">
            <Header startDate={startDate}/>
            <ListView startDate={startDate}/>
        </div>
    )
}

export default Home
