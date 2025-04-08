import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const styles = {
    container: {
      maxWidth: "800px",
      margin: "40px auto",
      padding: "20px",
      color: "#fff",
      backgroundColor: "#141414",
    },
    header: {
      display: "flex",
      alignItems: "center",
      gap: "20px",
      marginBottom: "30px",
      padding: "20px",
      backgroundColor: "#1f1f1f",
      borderRadius: "10px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
    },
    avatar: {
      width: "100px",
      height: "100px",
      borderRadius: "50%",
      backgroundColor: "#E50914",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "40px",
      color: "#000",
      fontWeight: "bold",
    },
    userInfo: {
      flex: 1,
    },
    name: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "5px",
    },
    role: {
      display: "inline-block",
      padding: "4px 12px",
      backgroundColor: "#E50914",
      color: "#000",
      borderRadius: "15px",
      fontSize: "14px",
      fontWeight: "bold",
      marginBottom: "10px",
    },
    details: {
      backgroundColor: "#1f1f1f",
      borderRadius: "10px",
      padding: "20px",
      marginTop: "20px",
    },
    detailItem: {
      display: "flex",
      justifyContent: "space-between",
      padding: "15px 0",
      borderBottom: "1px solid #333",
    },
    label: {
      color: "#888",
    },
    value: {
      color: "#fff",
    },
    loading: {
      textAlign: "center",
      fontSize: "20px",
      color: "#888",
    },
  };

  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading profile...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.avatar}>
          {user?.username ? user.username.charAt(0).toUpperCase() : '?'}
        </div>
        <div style={styles.userInfo}>
          <h1 style={styles.name}>{user?.username || 'Guest'}</h1>
          <span style={styles.role}>{user?.role?.toUpperCase() || 'USER'}</span>
        </div>
      </div>
      {/* ...rest of your component */}
    </div>
  );
};

export default Profile;