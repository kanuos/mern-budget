import React from 'react';
import video from '../../assets/MoneyFalling.mp4'
import './start.css'

const HomeLanding = () => {
    return (
        <aside className="home-landing">
            <video autoPlay muted loop> 
                <source src={video}/>
            </video>
            <div className="landing-container">
                <h1>Welcome to the BudgetKeeper</h1>
                <p>Your digital accountant</p>
                <ul>
                    <li>Track your expenses</li>
                    <li>Plan your retirement</li>
                    <li>Visualize your saving pattern</li>
                    <li>Get free investment calculator app (in-built)</li>
                </ul>
                <span>sign up for free</span>
            </div>
        </aside>
    )
}

export default HomeLanding
