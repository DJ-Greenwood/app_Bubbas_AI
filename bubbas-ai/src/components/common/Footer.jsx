import React from 'react';


const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} Bubba's AI. All rights reserved.</p>
                <nav className="footer-nav">
                    <a href="/privacy-policy"> Privacy Policy </a>
                    <a href="/terms-of-service"> Terms of Service </a>
                    <a href="/contact"> Contact Us </a>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;