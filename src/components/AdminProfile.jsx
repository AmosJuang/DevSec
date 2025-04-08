import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminProfile = () => {

    const user = {
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        joinDate: new Date().toLocaleDateString()
    };

    const navigate = useNavigate();

    const styles = {
        container: {
            maxWidth: '800px',
            margin: '40px auto',
            padding: '20px',
            color: '#fff',
            backgroundColor: '#141414',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
        },
        header: {
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '30px',
            padding: '20px',
            backgroundColor: '#1f1f1f',
            borderRadius: '10px'
        },
        avatar: {
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: '#E50914',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            color: '#000',
            fontWeight: 'bold'
        },
        userInfo: {
            flex: 1
        },
        name: {
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '5px'
        },
        role: {
            display: 'inline-block',
            padding: '4px 12px',
            backgroundColor: '#E50914',
            color: '#000',
            borderRadius: '15px',
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '10px'
        },
        details: {
            backgroundColor: '#1f1f1f',
            borderRadius: '10px',
            padding: '20px',
            marginTop: '20px'
        },
        detailItem: {
            display: 'flex',
            justifyContent: 'space-between',
            padding: '15px 0',
            borderBottom: '1px solid #333'
        },
        label: {
            color: '#888'
        },
        value: {
            color: '#fff'
        },
        buttonContainer: {
            marginTop: '20px',
            textAlign: 'center'
        },
        button: {
            backgroundColor: '#E50914',
            color: '#000',
            padding: '12px 30px',
            fontSize: '16px',
            fontWeight: 'bold',
            borderRadius: '25px',
            cursor: 'pointer',
            border: 'none',
            transition: 'transform 0.3s ease, background-color 0.3s ease',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
        },
        buttonHover: {
            transform: 'scale(1.1)',
            backgroundColor: '#e0b617'
        }
    };

    const handleNavigate = () => {
        // Navigasi ke halaman dashboard admin
        navigate('/Dashboard');
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.avatar}>
                    {user.name.charAt(0)}
                </div>
                <div style={styles.userInfo}>
                    <h1 style={styles.name}>{user.name}</h1>
                    <span style={styles.role}>{user.role.toUpperCase()}</span>
                    <p style={{ color: '#888' }}>Member since {user.joinDate}</p>
                </div>
            </div>

            <div style={styles.details}>
                <div style={styles.detailItem}>
                    <span style={styles.label}>Email</span>
                    <span style={styles.value}>{user.email}</span>
                </div>
                <div style={styles.detailItem}>
                    <span style={styles.label}>Role</span>
                    <span style={styles.value}>{user.role}</span>
                </div>
                <div style={styles.detailItem}>
                    <span style={styles.label}>Account Status</span>
                    <span style={styles.value}>Active</span>
                </div>
            </div>

            <div style={styles.buttonContainer}>
                <button
                    style={styles.button}
                    onClick={handleNavigate}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    );
};

export default AdminProfile;