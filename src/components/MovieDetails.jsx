import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Container, 
    Paper, 
    Typography, 
    Box, 
    Rating, 
    Button,
    CircularProgress,
    TextField,
    Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../contexts/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const MovieDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [film, setFilm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');
    const [reviews, setReviews] = useState([]);
    const [reviewData, setReviewData] = useState({
        rating: 0,
        comment: ''
    });

    useEffect(() => {
        const fetchFilm = async (retryAttempt = 0) => {
            if (!id) return;
            
            try {
                setLoading(true);
                setError(null);
                
                console.log(`Fetching film with ID: ${id}`);
                
                const response = await fetch(`${API_URL}/api/films/${id}`);
                
                if (response.status === 404) {
                    setError('Film not found');
                    setLoading(false);
                    return;
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Film data:', data);

                const transformedFilm = {
                    ...data,
                    poster_url: data.poster_url 
                        ? `${API_URL}/${data.poster_url}`
                        : '/placeholder.jpg',
                    rating: parseFloat(data.rating) || 0
                };
                
                setFilm(transformedFilm);
                await fetchReviews();
            } catch (err) {
                console.error('Error fetching film:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFilm();
    }, [id]);

    const fetchReviews = async () => {
        try {
            const response = await fetch(`${API_URL}/api/films/${id}/reviews`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch reviews');
            }
            
            const data = await response.json();
            setReviews(data);
        } catch (err) {
            console.error('Error fetching reviews:', err);
            setError(err.message);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        
        if (!user) {
            setError('Please login to submit a review');
            return;
        }
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found');
                return;
            }

            const reviewPayload = {
                film_id: parseInt(id),
                rating: parseFloat(reviewData.rating),
                comment: reviewData.comment.trim()
            };

            const response = await fetch(`${API_URL}/api/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify(reviewPayload)
            });

            const data = await response.json();
            console.log('Review submission response:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit review');
            }

            setSuccess('Review submitted successfully!');
            setReviewData({ rating: 0, comment: '' });
            
            await Promise.all([
                fetchReviews(),
                fetchFilm()
            ]);
        } catch (err) {
            console.error('Review submission error:', err);
            setError(err.message);
        }
    };

    if (!film && !loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="error">
                    Film not found or failed to load
                </Alert>
            </Container>
        );
    }

    if (loading) {
        return (
            <Box display="flex" flexDirection="column" alignItems="center" m={4}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            {film && (
                <Paper sx={{ p: 3, bgcolor: '#1a1a1a', color: 'white' }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(-1)}
                        sx={{ mb: 2 }}
                    >
                        Back
                    </Button>
                    <Box 
                        display="flex" 
                        flexDirection={{ xs: 'column', md: 'row' }} 
                        gap={4}
                    >
                        <Box 
                            flex={{ xs: '1', md: '0 0 400px' }}
                            sx={{ position: 'relative' }}
                        >
                            <img
                                src={film.poster_url}
                                alt={film.title}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    maxHeight: '600px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                                }}
                                onError={(e) => {
                                    console.log('Image load error, using placeholder');
                                    e.target.src = '/placeholder.jpg';
                                }}
                            />
                        </Box>
                        <Box flex="1">
                            <Typography 
                                variant="h3" 
                                component="h1" 
                                gutterBottom
                                sx={{ fontWeight: 'bold' }}
                            >
                                {film.title}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                                <Rating 
                                    value={Number(film.rating)} 
                                    readOnly 
                                    precision={0.5}
                                    sx={{ color: '#E50914' }}
                                />
                                <Typography>({film.rating})</Typography>
                            </Box>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    color: '#E50914',
                                    mb: 2 
                                }}
                            >
                                {film.genre}
                            </Typography>
                            <Typography 
                                variant="body1" 
                                paragraph
                                sx={{ 
                                    lineHeight: 1.8,
                                    color: '#e0e0e0' 
                                }}
                            >
                                {film.sinopsis}
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            )}

            {user && (
                <Paper sx={{ p: 3, mt: 3, bgcolor: '#1a1a1a', color: 'white' }}>
                    <Typography variant="h6" gutterBottom>Write a Review</Typography>
                    <form onSubmit={handleSubmitReview}>
                        <Box sx={{ mb: 2 }}>
                            <Rating
                                value={reviewData.rating}
                                onChange={(_, value) => setReviewData(prev => ({ ...prev, rating: value }))}
                                precision={0.5}
                            />
                        </Box>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            value={reviewData.comment}
                            onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                            placeholder="Write your review here..."
                            sx={{
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.23)' }
                                }
                            }}
                        />
                        <Button 
                            type="submit" 
                            variant="contained" 
                            disabled={!reviewData.rating || !reviewData.comment}
                        >
                            Submit Review
                        </Button>
                    </form>
                </Paper>
            )}

            <Paper sx={{ p: 3, mt: 3, bgcolor: '#1a1a1a', color: 'white' }}>
                <Typography variant="h6" gutterBottom>
                    Reviews ({reviews?.length || 0})
                </Typography>
                {reviews?.length > 0 ? (
                    reviews.map((review) => (
                        <Box key={review.id} sx={{ mb: 3, pb: 2, borderBottom: '1px solid #333' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography sx={{ mr: 2 }}>{review.username}</Typography>
                                <Rating 
                                    value={parseFloat(review.rating)} 
                                    readOnly 
                                    size="small"
                                    precision={0.5} 
                                />
                            </Box>
                            <Typography sx={{ color: '#e0e0e0' }}>{review.comment}</Typography>
                        </Box>
                    ))
                ) : (
                    <Typography color="text.secondary">No reviews yet</Typography>
                )}
            </Paper>
        </Container>
    );
};

export default MovieDetails;