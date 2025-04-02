import React from 'react';
import { Link } from 'react-router-dom';


const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">Bubba's AI</Link>
            <div className="navbar-buttons">
                <button onClick={() => window.location.href = '/about'}>About</button>
                <button onClick={() => window.location.href = '/services'}>Services</button>
                <button onClick={() => window.location.href = '/contact'}>Contact</button>
            </div>
            </div>
        </nav>
    );
};

export default Navbar;