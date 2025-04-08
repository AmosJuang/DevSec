import { Box, Container, Typography, TextField, Button, Paper } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";

const SignIn = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await signIn(formData);
            console.log("Sign-in response:", response);
            
            await login(response.user);
            
            // Redirect based on user role
            if (response.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/profile'); // or navigate('/') for home page
            }
        } catch (error) {
            console.error("Sign-in error:", error);
            setError(error.message || "Failed to sign in");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        backgroundColor: "#121212",
                        border: "1px solid #E50914",
                        width : "100%",
                    }}
                >
                    <Typography component="h1" variant="h5" sx={{ color: "#E50914", marginBottom: 3 }}>
                        Sign in
                    </Typography>
                    {error && (
                        <Typography variant="body2" sx={{ color: "#E50914", marginBottom: 2 }}>
                            {error}
                        </Typography>
                    )}
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width : "100%" }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address or Username"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={formData.email}
                            onChange={handleChange}
                            sx={{
                                backgroundColor: "#333",
                                input: { color: "white" },
                                "& label": { color: "gray" },
                                "& label.Mui-focused": { color: "#E50914" },
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": { borderColor: "gray" },
                                    "&:hover fieldset": { borderColor: "#E50914" },
                                    "&.Mui-focused fieldset": { borderColor: "#E50914" },
                                },
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            sx={{
                                backgroundColor: "#333",
                                input: { color: "white" },
                                "& label": { color: "gray" },
                                "& label.Mui-focused": { color: "#E50914" },
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": { borderColor: "gray" },
                                    "&:hover fieldset": { borderColor: "#E50914" },
                                    "&.Mui-focused fieldset": { borderColor: "#E50914" },
                                },
                            }}
                        />
                        <Box sx={{ textAlign: 'right', marginBottom: '10px' }}>
                            <Link to="/forget-password" style={{ color: '#E50914', textDecoration: 'none' }}>
                                Forgot your password?
                            </Link>
                        </Box>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                mb: 2,
                                backgroundColor: "#E50914",
                                color: "black",
                                "&:hover": {
                                    backgroundColor: "#8B0000",
                                },
                            }}
                        >
                            Sign In
                        </Button>
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: 'white' }}>
                            Belum punya akun ? {' '}
                            <Button
                                onClick={() => navigate('/register')}
                                sx={{
                                    color: '#E50914',
                                    textTransform: 'none',
                                    '&:hover': {
                                        textDecoration: 'underline',
                                        backgroundColor: 'transparent'
                                    }
                                }}
                            >
                                Register!
                            </Button>
                        </Typography>
                    </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default SignIn;