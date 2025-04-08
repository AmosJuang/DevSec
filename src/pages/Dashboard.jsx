import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Box,
    Grid,
    Typography,
    Paper,
    Container,
    Alert,
    Snackbar,
    Input,
    CircularProgress,
    Tabs,
    Tab,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { Navigate } from 'react-router-dom';
import { filmService } from '../services/filmService';
import { useAuth } from '../contexts/AuthContext';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const Dashboard = () => {
    const { isAdmin } = useAuth();
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [formData, setFormData] = useState({
        title: '',
        sinopsis: '',
        genre: '',
        rating: '',
        image: null,
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [films, setFilms] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedFilm, setSelectedFilm] = useState(null);

    useEffect(() => {
        loadFilms();
    }, []);

    const loadFilms = async () => {
        try {
            const data = await filmService.getMovies();
            setFilms(data);
        } catch (error) {
            console.error('Error loading films:', error);
            setSnackbarSeverity('error');
            setSnackbarMessage('Failed to load films');
            setOpenSnackbar(true);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('sinopsis', formData.sinopsis);
            formDataToSend.append('genre', formData.genre);
            formDataToSend.append('rating', formData.rating || '0');
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            await filmService.addFilm(formDataToSend);
            setSnackbarMessage('Film added successfully!');
            setOpenSnackbar(true);
            
            setFormData({
                title: '',
                sinopsis: '',
                genre: '',
                rating: '',
                image: null
            });
            setImagePreview(null);
        } catch (error) {
            console.error('Error:', error);
            setSnackbarMessage(error.message);
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (film) => {
        setSelectedFilm(film);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            console.log('ini awalanya');
            await filmService.deleteFilm(selectedFilm.id);
            setFilms(films.filter(f => f.id !== selectedFilm.id));
            console.log('Film deleted:', selectedFilm.id);
            setSnackbarSeverity('success');
            setSnackbarMessage('Film deleted successfully');
            setOpenSnackbar(true);
        } catch (error) {
            console.error('ini disini kann');
            console.error('Error deleting film:', error);
            setSnackbarSeverity('error');
            setSnackbarMessage('Failed to delete film');
            setOpenSnackbar(true);
        } finally {
            setDeleteDialogOpen(false);
            setSelectedFilm(null);
        }
    };

    const renderAddFilmForm = () => (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': { borderColor: 'rgba(255,255,255,0.23)' }
                            },
                            '& .MuiInputLabel-root': { color: 'white' }
                        }}
                    />
                </Grid>
                
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        multiline
                        rows={4}
                        label="Synopsis"
                        name="sinopsis"
                        value={formData.sinopsis}
                        onChange={handleChange}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': { borderColor: 'rgba(255,255,255,0.23)' }
                            },
                            '& .MuiInputLabel-root': { color: 'white' }
                        }}
                    />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        fullWidth
                        label="Genre"
                        name="genre"
                        value={formData.genre}
                        onChange={handleChange}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': { borderColor: 'rgba(255,255,255,0.23)' }
                            },
                            '& .MuiInputLabel-root': { color: 'white' }
                        }}
                    />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        fullWidth
                        type="number"
                        label="Rating"
                        name="rating"
                        inputProps={{ step: "0.1", min: "0", max: "5" }}
                        value={formData.rating}
                        onChange={handleChange}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': { borderColor: 'rgba(255,255,255,0.23)' }
                            },
                            '& .MuiInputLabel-root': { color: 'white' }
                        }}
                    />
                </Grid>
                
                <Grid item xs={12}>
                    <Box 
                        sx={{ 
                            border: '2px dashed rgba(255,255,255,0.23)',
                            borderRadius: 1,
                            p: 3,
                            textAlign: 'center'
                        }}
                    >
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="image-upload"
                            type="file"
                            onChange={handleImageChange}
                        />
                        <label htmlFor="image-upload">
                            <Button
                                component="span"
                                startIcon={<CloudUploadIcon />}
                                variant="outlined"
                                sx={{ color: 'white', borderColor: 'white' }}
                            >
                                Upload Poster
                            </Button>
                        </label>
                        {imagePreview && (
                            <Box mt={2}>
                                <img 
                                    src={imagePreview} 
                                    alt="Preview" 
                                    style={{ 
                                        maxWidth: '200px',
                                        maxHeight: '300px',
                                        objectFit: 'contain'
                                    }} 
                                />
                            </Box>
                        )}
                    </Box>
                </Grid>
                
                <Grid item xs={12}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        disabled={loading}
                        sx={{ 
                            bgcolor: '#E50914',
                            '&:hover': {
                                bgcolor: '#b2070f'
                            }
                        }}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Add Film'
                        )}
                    </Button>
                </Grid>
            </Grid>
        </form>
    );

    const renderManageFilms = () => (
        <Grid container spacing={3}>
            {films.map((film) => (
                <Grid item xs={12} sm={6} md={4} key={film.id}>
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            p: 2,
                            bgcolor: '#1a1a1a',
                            color: 'white',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <Box 
                            sx={{
                                position: 'relative',
                                paddingTop: '150%',
                                mb: 2
                            }}
                        >
                            <img
                                src={film.poster_url}
                                alt={film.title}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '4px'
                                }}
                            />
                        </Box>
                        <Typography variant="h6" gutterBottom>
                            {film.title}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2, color: '#E50914' }}>
                            {film.genre}
                        </Typography>
                        <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <IconButton 
                                onClick={() => handleDeleteClick(film)}
                                sx={{ color: '#E50914' }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    );

    if (!isAdmin) {
        return <Navigate to="/signin" replace />;
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#E50914' }}>
                    Admin Dashboard
                </Typography>
                
                <Tabs 
                    value={activeTab} 
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    sx={{ 
                        mb: 4,
                        borderBottom: 1,
                        borderColor: 'divider',
                        '& .MuiTab-root': { color: 'white' },
                        '& .Mui-selected': { color: '#E50914' }
                    }}
                >
                    <Tab label="Add Film" />
                    <Tab label="Manage Films" />
                </Tabs>

                {activeTab === 0 && renderAddFilmForm()}
                {activeTab === 1 && renderManageFilms()}
            </Box>

            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                PaperProps={{
                    sx: { bgcolor: '#1a1a1a', color: 'white' }
                }}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete "{selectedFilm?.title}"?
                    This action cannot be undone.
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setDeleteDialogOpen(false)}
                        sx={{ color: 'white' }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleDeleteConfirm}
                        sx={{ 
                            bgcolor: '#E50914',
                            color: 'white',
                            '&:hover': { bgcolor: '#b2070f' }
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert 
                    onClose={() => setOpenSnackbar(false)} 
                    severity={snackbarSeverity}
                    sx={{ bgcolor: snackbarSeverity === 'success' ? '#2e7d32' : '#d32f2f', color: 'white' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Dashboard;