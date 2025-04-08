const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const filmService = {
    async getAllFilms() {
        const response = await fetch(`${API_URL}/api/films`);
        if (!response.ok) {
            throw new Error('Failed to fetch films');
        }
        return response.json();
    },

    async getMovies(query = '') {
        try {
            const url = query 
                ? `${API_URL}/api/films/search?title=${encodeURIComponent(query)}`
                : `${API_URL}/api/films`;

            console.log('Fetching from:', url);
            
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            // Log response details for debugging
            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers));

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Get the raw text first to check the response
            const rawText = await response.text();
            console.log('Raw response:', rawText);

            let data;
            try {
                data = JSON.parse(rawText);
            } catch (parseError) {
                console.error('Failed to parse response:', parseError);
                return [];
            }
            
            if (!Array.isArray(data)) {
                console.error('Unexpected response format:', data);
                return [];
            }

            // Transform the results
            return data.map(film => ({
                ...film,
                rating: parseFloat(film.rating) || 0,
                poster_url: film.poster_url 
                    ? film.poster_url.startsWith('http') 
                        ? film.poster_url 
                        : `${API_URL}/${film.poster_url}`
                    : null
            }));
        } catch (error) {
            console.error('Error fetching films:', error);
            return []; // Return empty array instead of throwing
        }
    },

    async addFilm(formData) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authorization token found');
            }

            const response = await fetch(`${API_URL}/api/films`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to add film');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error adding film:', error);
            throw new Error('Failed to add film: ' + error.message);
        }
    },

    async getFilmById(id) {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/films/${id}`);
            
            if (!response.ok) {
                throw new Error('Film not found');
            }
            
            return response.json();
        } catch (error) {
            console.error('Error fetching film:', error);
            throw error;
        }
    },

    async getUserProfile() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            // Changed endpoint to match backend route
            const response = await fetch(`${API_URL}/api/users/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch profile');
            }

            const data = await response.json();
            if (!data || !data.username) {
                throw new Error('Invalid user data received');
            }
            return data;
        } catch (error) {
            console.error('Error fetching profile:', error);
            throw new Error('Failed to load profile. Please try again later.');
        }
    },

    async deleteFilm(id) {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authorization token found');
        }

        const response = await fetch(`${API_URL}/api/films/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete film');
        }

        return await response.json();
    }
};