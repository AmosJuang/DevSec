import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
    const [currentYear] = useState(new Date().getFullYear());
    const navigate = useNavigate();

    return (
        <footer className="footer-container">
            <div className="footer-main">
                <div className="footer-column">
                    <h4>Discover</h4>
                    <ul>
                        <li><a href="/movies">Movies</a></li>
                        <li><a href="/tv-shows">TV Shows</a></li>
                        <li><a href="/celebrities">Celebrities</a></li>
                        <li><a href="/news">News</a></li>
                    </ul>
                </div>
                
                <div className="footer-column">
                    <h4>Account</h4>
                    <ul>
                    <li><span onClick={() => navigate("/profile")} className="clickable">My Profile</span></li>
                    <li><span onClick={() => navigate("/adminprofile")} className="clickable">AdminProfile</span></li>
                        <li><a href="/watchlist">Watchlist</a></li>
                        <li><a href="/ratings">My Ratings</a></li>
                        <li><a href="/settings">Settings</a></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Help</h4>
                    <ul>
                        <li><a href="/faq">FAQ</a></li>
                        <li><a href="/contact">Contact Us</a></li>
                        <li><a href="/feedback">Feedback</a></li>
                        <li><a href="/sitemap">Sitemap</a></li>
                    </ul>
                </div>

                <div className="footer-column footer-social">
                    <h4>Connect With Us</h4>
                    <div className="social-icons">
                        <a href="https://facebook.com" className="social-icon facebook" aria-label="Facebook">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="https://twitter.com" className="social-icon twitter" aria-label="Twitter">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="https://instagram.com" className="social-icon instagram" aria-label="Instagram">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="https://youtube.com" className="social-icon youtube" aria-label="YouTube">
                            <i className="fab fa-youtube"></i>
                        </a>
                        <a href="https://tiktok.com" className="social-icon tiktok" aria-label="TikTok">
                            <i className="fab fa-tiktok"></i>
                        </a>
                    </div>
                    <div className="download-app">
                        <p>Get our app:</p>
                        <div className="app-buttons">
                            <a href="/app-store" className="app-button">
                                <i className="fab fa-apple"></i> App Store
                            </a>
                            <a href="/play-store" className="app-button">
                                <i className="fab fa-google-play"></i> Google Play
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="copyright">
                    &copy; {currentYear} MovieSite. All rights reserved.
                </div>
                <div className="footer-links">
                    <a href="/about">About Us</a>
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/terms">Terms of Service</a>
                    <a href="/cookies">Cookie Policy</a>
                    <a href="/accessibility">Accessibility</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;