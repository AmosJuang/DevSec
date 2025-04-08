import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setIsAnimating(true);
        // Reset animation after it completes
        const timer = setTimeout(() => setIsAnimating(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email) {
            setError("Email harus diisi");
            return;
        }

        try {
            setError('');
            setMessage('');
            setIsSubmitting(true);

            const response = await fetch(`${API_URL}/api/auth/forget-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: email.trim() 
                })
            });

            // Handle non-JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Server error: Invalid response format');
            }

            const data = await response.json();
            
            if (response.ok) {
                setMessage("Link reset password telah dikirim ke email Anda");
                setEmail('');
                setIsAnimating(true);
                setTimeout(() => setIsAnimating(false), 1000);
            } else {
                throw new Error(data.message || "Gagal mengirim email reset password");
            }
        } catch (error) {
            console.error('Password reset error:', error);
            setError(error.message || "Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(email);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setError('');
        setMessage('');
    };

    const handleBackToSignIn = () => {
        console.log('Navigate back to sign in');
        // window.location.href = '/signin';
    };

    const getPrimaryButtonStyle = () => ({
        ...styles.primaryButton,
        ...(hoverStates.primaryButton ? styles.primaryButtonHover : {}),
        ...(isSubmitting && {
            opacity: 0.7,
            cursor: 'not-allowed',
            background: 'linear-gradient(to right, #9ca3af, #6b7280)'
        })
    });


    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000000',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden'
        },
        backgroundBlur1: {
            position: 'absolute',
            top: '-80px',
            left: '-80px',
            width: '256px',
            height: '256px',
            borderRadius: '50%',
            background: 'rgba(88, 28, 135, 0.2)',
            filter: 'blur(40px)'
        },
        backgroundBlur2: {
            position: 'absolute',
            top: '33%',
            right: '25%',
            width: '384px',
            height: '384px',
            borderRadius: '50%',
            background: 'rgba(30, 64, 175, 0.1)',
            filter: 'blur(40px)'
        },
        backgroundBlur3: {
            position: 'absolute',
            bottom: '25%',
            left: '33%',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'rgba(157, 23, 77, 0.15)',
            filter: 'blur(40px)'
        },
        backgroundBlur4: {
            position: 'absolute',
            bottom: '-80px',
            right: '-80px',
            width: '256px',
            height: '256px',
            borderRadius: '50%',
            background: 'rgba(153, 27, 27, 0.2)',
            filter: 'blur(40px)'
        },
        formWrapper: {
            width: '100%',
            maxWidth: '400px',
            zIndex: '10',
            animation: isAnimating ? 'pulse 2s infinite' : 'none'
        },
        logoContainer: {
            textAlign: 'center',
            marginBottom: '32px',
            transform: 'scale(1)',
            transition: 'transform 0.5s ease'
        },
        logoContainerHover: {
            transform: 'scale(1.1)'
        },
        logoCircle: {
            display: 'inline-block',
            padding: '16px',
            borderRadius: '50%',
            backgroundColor: '#1f2937',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #374151'
        },
        logoText: {
            fontSize: '36px',
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #ef4444, #8b5cf6, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent'
        },
        card: {
            backgroundColor: '#1f2937',
            borderRadius: '8px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
            border: '1px solid #374151',
            transform: 'scale(1)',
            transition: 'transform 0.5s ease, box-shadow 0.5s ease'
        },
        gradientLine: {
            height: '4px',
            background: 'linear-gradient(to right, #dc2626, #8b5cf6, #3b82f6)'
        },
        cardContent: {
            padding: '32px'
        },
        title: {
            fontSize: '30px',
            fontWeight: 'bold',
            marginBottom: '8px',
            textAlign: 'center',
            background: 'linear-gradient(to right, #ef4444, #8b5cf6, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent'
        },
        subtitle: {
            color: '#9ca3af',
            marginBottom: '24px',
            textAlign: 'center',
            fontSize: '14px'
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
        },
        formGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
        },
        label: {
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#d1d5db',
            marginBottom: '4px'
        },
        inputWrapper: {
            position: 'relative'
        },
        input: {
            width: '100%',
            padding: '12px 16px',
            backgroundColor: '#374151',
            border: '1px solid #4b5563',
            color: 'white',
            borderRadius: '6px',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.3s ease'
        },
        inputIcon: {
            position: 'absolute',
            right: '0',
            top: '0',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            paddingRight: '12px',
            pointerEvents: 'none',
            color: '#9ca3af'
        },
        primaryButton: {
            width: '100%',
            padding: '12px 16px',
            borderRadius: '6px',
            color: 'white',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            background: 'linear-gradient(to right, #dc2626, #b91c1c)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.3)',
            fontSize: '14px'
        },
        primaryButtonHover: {
            background: 'linear-gradient(to right, #b91c1c, #991b1b)',
            transform: 'scale(1.05)',
            boxShadow: '0 10px 15px -3px rgba(220, 38, 38, 0.3)'
        },
        secondaryButton: {
            padding: '8px 16px',
            borderRadius: '6px',
            color: 'white',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            background: 'linear-gradient(to right, #7c3aed, #2563eb)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(124, 58, 237, 0.3)',
            fontSize: '14px',
            marginTop: '8px'
        },
        secondaryButtonHover: {
            background: 'linear-gradient(to right, #6d28d9, #1d4ed8)',
            transform: 'scale(1.05)',
            boxShadow: '0 10px 15px -3px rgba(124, 58, 237, 0.3)'
        },
        buttonContainer: {
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '8px'
        },
        successMessage: {
            marginTop: '16px',
            padding: '12px',
            backgroundColor: 'rgba(6, 78, 59, 0.3)',
            border: '1px solid #047857',
            color: '#34d399',
            borderRadius: '6px',
            textAlign: 'center',
            fontSize: '14px',
            animation: 'pulse 2s infinite'
        },
        errorMessage: {
            marginTop: '16px',
            padding: '12px',
            backgroundColor: 'rgba(127, 29, 29, 0.3)',
            border: '1px solid #b91c1c',
            color: '#f87171',
            borderRadius: '6px',
            textAlign: 'center',
            fontSize: '14px',
            animation: 'pulse 2s infinite'
        },
        backLink: {
            marginTop: '24px',
            textAlign: 'center'
        },
        backButton: {
            color: '#22d3ee',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
        },
        backButtonHover: {
            color: '#67e8f9',
            textDecoration: 'underline'
        },
        arrow: {
            fontSize: '18px'
        },
        footer: {
            padding: '16px 32px',
            borderTop: '1px solid #374151',
            backgroundColor: 'rgba(31, 41, 55, 0.5)',
            textAlign: 'center'
        },
        footerText: {
            fontSize: '14px',
            color: '#6b7280'
        },
        socialButtonsContainer: {
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            marginTop: '12px'
        },
        socialButton: {
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            border: 'none',
            cursor: 'pointer'
        },
        facebookButton: {
            backgroundColor: '#2563eb'
        },
        facebookButtonHover: {
            backgroundColor: '#3b82f6'
        },
        googleButton: {
            backgroundColor: '#dc2626'
        },
        googleButtonHover: {
            backgroundColor: '#ef4444'
        },
        appleButton: {
            backgroundColor: '#7c3aed'
        },
        appleButtonHover: {
            backgroundColor: '#8b5cf6'
        },
        socialButtonText: {
            color: 'white',
            fontWeight: 'bold'
        },
        copyright: {
            textAlign: 'center',
            marginTop: '24px'
        },
        copyrightText: {
            color: '#6b7280',
            fontSize: '12px'
        },
        '@keyframes pulse': {
            '0%, 100%': {
                opacity: 1
            },
            '50%': {
                opacity: 0.8
            }
        }
    };

    const [hoverStates, setHoverStates] = useState({
        logo: false,
        primaryButton: false,
        secondaryButton: false,
        backButton: false,
        facebookButton: false,
        googleButton: false,
        appleButton: false
    });

    return (
        <div style={styles.container}>
            {/* Background blur elements */}
            <div style={styles.backgroundBlur1}></div>
            <div style={styles.backgroundBlur2}></div>
            <div style={styles.backgroundBlur3}></div>
            <div style={styles.backgroundBlur4}></div>
            
            <div style={styles.formWrapper}>
                <div 
                    style={{
                        ...styles.logoContainer,
                        ...(hoverStates.logo ? styles.logoContainerHover : {})
                    }}
                    onMouseEnter={() => setHoverStates({...hoverStates, logo: true})}
                    onMouseLeave={() => setHoverStates({...hoverStates, logo: false})}
                >
                </div>
                
                <div style={styles.card}>
                    <div style={styles.gradientLine}></div>
                    
                    <div style={styles.cardContent}>
                        <h1 style={styles.title}>Reset Password</h1>
                        
                        <p style={styles.subtitle}>
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                        
                        <form onSubmit={handleSubmit} style={styles.form}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>
                                    Email Address
                                </label>
                                <div style={styles.inputWrapper}>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        style={styles.input}
                                        placeholder="Enter your email"
                                    />
                                    <div style={styles.inputIcon}>
                                        @
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                type="submit" 
                                style={getPrimaryButtonStyle()}
                                disabled={isSubmitting}
                                onMouseEnter={() => setHoverStates({...hoverStates, primaryButton: true})}
                                onMouseLeave={() => setHoverStates({...hoverStates, primaryButton: false})}
                            >
                                {isSubmitting ? 'Mengirim...' : 'Reset Password'}
                            </button>
                            
                            <div style={styles.buttonContainer}>
                                <button 
                                    type="button" 
                                    style={{
                                        ...styles.secondaryButton,
                                        ...(hoverStates.secondaryButton ? styles.secondaryButtonHover : {})
                                    }}
                                    onMouseEnter={() => setHoverStates({...hoverStates, secondaryButton: true})}
                                    onMouseLeave={() => setHoverStates({...hoverStates, secondaryButton: false})}
                                >
                                    Contact Support
                                </button>
                            </div>
                            
                            {message && (
                                <div style={styles.successMessage}>
                                    {message}
                                </div>
                            )}
                            
                            {error && (
                                <div style={styles.errorMessage}>
                                    {error}
                                </div>
                            )}
                        </form>
                        
                        <div style={styles.backLink}>
                            <Link
                                to = "/signin"
                                style={{
                                    ...styles.backButton,
                                    ...(hoverStates.backButton ? styles.backButtonHover : {})
                                }}
                                onMouseEnter={() => setHoverStates({...hoverStates, backButton: true})}
                                onMouseLeave={() => setHoverStates({...hoverStates, backButton: false})}
                            >
                                <span style={styles.arrow}>←</span> Kembali ke Sign In
                            </Link>
                        </div>
                    </div>
                    
                    <div style={styles.footer}>
                        <span style={styles.footerText}>Atau reset menggunakan</span>
                        <div style={styles.socialButtonsContainer}>
                            <button 
                                style={{
                                    ...styles.socialButton,
                                    ...styles.facebookButton,
                                    ...(hoverStates.facebookButton ? styles.facebookButtonHover : {})
                                }}
                                onMouseEnter={() => setHoverStates({...hoverStates, facebookButton: true})}
                                onMouseLeave={() => setHoverStates({...hoverStates, facebookButton: false})}
                            >
                                <span style={styles.socialButtonText}>f</span>
                            </button>
                            <button 
                                style={{
                                    ...styles.socialButton,
                                    ...styles.googleButton,
                                    ...(hoverStates.googleButton ? styles.googleButtonHover : {})
                                }}
                                onMouseEnter={() => setHoverStates({...hoverStates, googleButton: true})}
                                onMouseLeave={() => setHoverStates({...hoverStates, googleButton: false})}
                            >
                                <span style={styles.socialButtonText}>G</span>
                            </button>
                            <button 
                                style={{
                                    ...styles.socialButton,
                                    ...styles.appleButton,
                                    ...(hoverStates.appleButton ? styles.appleButtonHover : {})
                                }}
                                onMouseEnter={() => setHoverStates({...hoverStates, appleButton: true})}
                                onMouseLeave={() => setHoverStates({...hoverStates, appleButton: false})}
                            >
                                <span style={styles.socialButtonText}>A</span>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div style={styles.copyright}>
                    <p style={styles.copyrightText}>
                        © 2025 Movie Review. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;