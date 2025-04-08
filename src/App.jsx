import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AdminRoute from './components/AdminRoute';
import Register from './components/Register';
import SearchResults from './components/SearchResults';
import Profile from './components/Profile';
import MovieDetails from './components/MovieDetails';
import ForgetPassword from './components/ForgetPassword';
import { AuthProvider } from './contexts/AuthContext';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/forget-password" element={<ForgetPassword />} />
                    <Route 
                        path="/admin/dashboard" 
                        element={
                            <AdminRoute>
                                <Dashboard />
                            </AdminRoute>
                        } 
                    />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/film/:id" element={<MovieDetails />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
