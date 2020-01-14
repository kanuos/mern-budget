import React from 'react'
import './footer.css';

const Footer = () => {
    return (
        <footer>
            Developed by <a href="https://github.com/kanuos"  rel="noopener noreferrer" target="_blank" className="footer-link">Sounak</a> {new Date().getUTCFullYear()}
        </footer>
    )
}

export default Footer
