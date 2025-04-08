import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import "./Register.css";
import MovieReviewLogo from '../assets/MovieReviewLogo.png';
import placeholderImage from '../assets/placeholder.png';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = () => {
        let tempErrors = {};
        
        if (!formData.username) {
            tempErrors.username = 'Username harus ada';
        }
        if (!formData.email) {
            tempErrors.email = 'Email harus ada';
        }
        if (!formData.password) {
            tempErrors.password = 'Password harus ada';
        } else if (formData.password.length < 8) {
            tempErrors.password = 'Password harus minimal 8 karakter';
        }
        if (formData.password !== formData.confirmPassword) {
            tempErrors.confirmPassword = 'Passwords tidak cocok';
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                setIsLoading(true);
                setApiError("");
                
                const userData = {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                };

                await register(userData);
                console.log('Registration successful!');
                navigate('/signin');
            } catch (error) {
                setApiError(error.message || 'Registration failed. Please try again.');
                console.error('Registration error:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="register-container">
            <div className="form-container">
                <div className="logo-container">
                    <img 
                        src={MovieReviewLogo} 
                        alt="Logo" 
                        className="logo-image"
                        onError={(e) => {
                            e.target.src = placeholderImage;
                            console.error('Failed to load logo image');
                        }}
                    />
                </div>
                <div className="form-wrapper">
                    <h1 className="title">Register Akun</h1>
                    <form onSubmit={handleSubmit}>
                        {apiError && <p className="error-text api-error">{apiError}</p>}
                        <div className="form-group">
                            <label className="form-label">Your name</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className={`form-input ${errors.username ? 'input-error' : ''}`}
                            />
                            {errors.username && <p className="error-text">{errors.username}</p>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`form-input ${errors.email ? 'input-error' : ''}`}
                            />
                            {errors.email && <p className="error-text">{errors.email}</p>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                placeholder="At least 8 characters"
                                onChange={handleChange}
                                className={`form-input ${errors.password ? 'input-error' : ''}`}
                            />
                            {errors.password && <p className="error-text">{errors.password}</p>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Re-enter password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                            />
                            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
                        </div>

                        <button 
                            type="submit" 
                            className="submit-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating account...' : 'Create your account'}
                        </button>
                    </form>

                    <div className="divider">
                        <p className="signin-text">
                            Already have an account?{' '}
                            <a href="/signin" className="signin-link">Sign in</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;