import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Typography, Box, Grid, Card, CardMedia, CardContent, CircularProgress, Container, Alert, Grow } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import { filmService } from '../services/filmService';

// Import placeholder image
import placeholderImage from '../assets/placeholder.jpg';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleImageError = (e) => {
        e.target.src = placeholderImage;
        console.error(`Failed to load image: ${e.target.src}`);
    };

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) {
                setResults([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                console.log('Searching for:', query);
                const films = await filmService.getMovies(query);
                console.log('Search results:', films);
                setResults(films);
                setError(null);
            } catch (err) {
                console.error('Search error:', err);
                setError('Failed to fetch search results');
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" m={4}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            )}

            <Typography variant="h4" gutterBottom>
                Search Results for: "{query}"
            </Typography>

            {results.length === 0 ? (
                <Box 
                    display="flex" 
                    flexDirection="column" 
                    alignItems="center" 
                    mt={4}
                >
                    <SearchIcon sx={{ fontSize: 60, color: 'grey.500', mb: 2 }} />
                    <Typography variant="h6" color="textSecondary">
                        No films found matching "{query}"
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {results.map((film) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={film.id}>
                            <Grow in={true}>
                                <Card 
                                    sx={{ 
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        bgcolor: '#1a1a1a',
                                        color: 'white'
                                    }}
                                    onClick={() => navigate(`/film/${film.id}`)}
                                >
                                    <CardMedia
                                        component="img"
                                        height="300"
                                        image={film.poster_url || placeholderImage}
                                        alt={film.title}
                                        onError={handleImageError}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6">
                                            {film.title}
                                        </Typography>
                                        <Box display="flex" alignItems="center">
                                            <StarIcon sx={{ color: '#FFD700', mr: 1 }} />
                                            <Typography>
                                                {typeof film.rating === 'number' 
                                                    ? film.rating.toFixed(1) 
                                                    : 'N/A'}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grow>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default SearchResults;