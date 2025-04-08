import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Import poster image from assets
import poster1 from '../assets/1.jpg';

const Trailer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [newComment, setNewComment] = useState('');
    const [newRating, setNewRating] = useState(5);
    const [guestName, setGuestName] = useState('');
    const [showTrailer, setShowTrailer] = useState(false);
    const [movie, setMovie] = useState({
        id: 1,
        title: "Death of a Unicorn",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
        posterImage: poster1, // Update to use imported image
        releaseYear: "2024",
        genre: "Drama, Fantasy",
        duration: "2h 15m",
        director: "Jane Doe",
        trailerUrl: "uLtkt8BonwM",
        rating: 4.2
    });
    
    const [comments, setComments] = useState([
        { id: 1, user: 'Guest123', comment: 'Great movie!', rating: 4, date: '2024-03-17' },
        { id: 2, user: 'Guest456', comment: 'Loved the plot twists', rating: 5, date: '2024-03-16' }
    ]);

    // Calculate average rating from comments
    const calculateAverageRating = () => {
        if (comments.length === 0) return 0;
        const sum = comments.reduce((acc, comment) => acc + comment.rating, 0);
        return (sum / comments.length).toFixed(1);
    };

    const handleSubmitReview = (e) => {
        e.preventDefault();
        if (!guestName.trim()) {
            alert('Please enter a guest name');
            return;
        }
        if (!newComment.trim()) {
            alert('Please enter a comment');
            return;
        }

        const newReview = {
            id: comments.length + 1,
            user: `Guest_${guestName}`,
            comment: newComment,
            rating: newRating,
            date: new Date().toISOString().split('T')[0]
        };
        setComments([...comments, newReview]);
        setNewComment('');
        setGuestName('');
        setNewRating(5);
    };

    const goBack = () => {
        navigate(-1);
    };

    // Styling with a dark theme and red accents
    const styles = {
        container: {
            backgroundColor: '#0a0a0a',
            color: '#ffffff',
            minHeight: '100vh',
            padding: '0 0 40px 0'
        },
        backdrop: {
            position: 'relative',
            height: '500px',
            overflow: 'hidden',
            marginBottom: '30px'
        },
        backdropImage: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(40%)',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 80%, transparent 100%)'
        },
        backdropOverlay: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to top, #0a0a0a 0%, transparent 50%)'
        },
        contentContainer: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px',
            position: 'relative'
        },
        posterSection: {
            display: 'flex',
            marginTop: '-150px',
            position: 'relative',
            zIndex: 10,
            gap: '30px',
            flexWrap: 'wrap'
        },
        posterContainer: {
            width: '280px',
        },
        poster: {
            width: '100%',
            height: 'auto',
            borderRadius: '10px',
            boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
            border: '2px solid #222'
        },
        infoSection: {
            flex: 1,
            minWidth: '300px'
        },
        title: {
            fontSize: '40px',
            fontWeight: 'bold',
            marginBottom: '10px',
            color: '#ffffff',
            textShadow: '2px 2px 4px rgba(0,0,0,0.6)'
        },
        subtitle: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '15px',
            alignItems: 'center',
            marginBottom: '20px',
            color: '#aaaaaa',
            fontSize: '14px'
        },
        pill: {
            backgroundColor: '#222222',
            padding: '4px 10px',
            borderRadius: '50px',
            fontSize: '14px'
        },
        rating: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
        },
        ratingNumber: {
            fontSize: '22px',
            fontWeight: 'bold',
            color: '#ff3333'
        },
        stars: {
            color: '#ff3333',
            fontSize: '18px'
        },
        description: {
            fontSize: '16px',
            lineHeight: '1.8',
            color: '#cccccc',
            marginBottom: '25px'
        },
        actionButtons: {
            display: 'flex',
            gap: '15px',
            marginBottom: '40px',
            flexWrap: 'wrap'
        },
        button: {
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 'bold',
            border: 'none',
            transition: 'transform 0.1s, opacity 0.2s'
        },
        primaryButton: {
            backgroundColor: '#ff3333',
            color: 'white',
        },
        secondaryButton: {
            backgroundColor: '#222222',
            color: 'white',
            border: '1px solid #444'
        },
        trailerSection: {
            margin: '40px 0',
            display: showTrailer ? 'block' : 'none'
        },
        trailerContainer: {
            position: 'relative',
            paddingBottom: '56.25%', // 16:9 aspect ratio
            height: 0,
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 8px 16px rgba(0,0,0,0.5)'
        },
        trailerFrame: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none'
        },
        backButton: {
            position: 'absolute',
            top: '20px',
            left: '20px',
            zIndex: 100,
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        sectionTitle: {
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '20px',
            paddingBottom: '10px',
            borderBottom: '1px solid #333',
            color: '#ffffff'
        },
        reviewSection: {
            backgroundColor: '#111111',
            borderRadius: '10px',
            padding: '25px',
            marginTop: '40px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
        },
        reviewForm: {
            backgroundColor: '#1a1a1a',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '30px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        },
        formTitle: {
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '15px',
            color: '#ffffff'
        },
        inputGroup: {
            marginBottom: '15px'
        },
        label: {
            display: 'block',
            marginBottom: '5px',
            color: '#aaaaaa'
        },
        input: {
            width: '100%',
            padding: '10px 12px',
            borderRadius: '5px',
            border: '1px solid #333',
            backgroundColor: '#222222',
            color: '#ffffff',
            fontSize: '14px'
        },
        ratingSelect: {
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #333',
            backgroundColor: '#222222',
            color: '#ffffff'
        },
        commentList: {
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
        },
        comment: {
            backgroundColor: '#1a1a1a',
            padding: '16px',
            borderRadius: '8px',
            borderLeft: '3px solid #ff3333',
            animation: 'fadeIn 0.3s ease-in-out'
        },
        commentHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px'
        },
        commentUser: {
            fontWeight: 'bold',
            color: '#ffffff'
        },
        commentDate: {
            fontSize: '12px',
            color: '#777777'
        },
        commentRating: {
            marginBottom: '8px',
            color: '#ff3333'
        },
        commentText: {
            color: '#dddddd',
            lineHeight: '1.5'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.backdrop}>
                <img 
                    src={movie.posterImage} 
                    alt={movie.title} 
                    style={styles.backdropImage}
                />
                <div style={styles.backdropOverlay}></div>
                <button style={styles.backButton} onClick={goBack}>
                    <i className="fa fa-arrow-left"></i> Back
                </button>
            </div>

            <div style={styles.contentContainer}>
                <div style={styles.posterSection}>
                    <div style={styles.posterContainer}>
                        <img 
                            src={movie.posterImage}
                            alt={movie.title} 
                            style={styles.poster}
                        />
                    </div>
                    
                    <div style={styles.infoSection}>
                        <h1 style={styles.title}>{movie.title}</h1>
                        
                        <div style={styles.subtitle}>
                            <span>{movie.releaseYear}</span>
                            <span>•</span>
                            <span style={styles.pill}>{movie.genre}</span>
                            <span>•</span>
                            <span>{movie.duration}</span>
                            <span>•</span>
                            <span>Director: {movie.director}</span>
                        </div>
                        
                        <div style={styles.rating}>
                            <div style={styles.stars}>{'★'.repeat(Math.round(movie.rating))}{'☆'.repeat(5-Math.round(movie.rating))}</div>
                            <div style={styles.ratingNumber}>{movie.rating}/5.0</div>
                            <div style={{color: '#777'}}>({comments.length} reviews)</div>
                        </div>
                        
                        <p style={styles.description}>{movie.description}</p>
                        
                        <div style={styles.actionButtons}>
                            <button 
                                style={{...styles.button, ...styles.primaryButton}}
                                onClick={() => setShowTrailer(!showTrailer)}
                            >
                                <i className="fa fa-play-circle"></i> 
                                {showTrailer ? 'Hide Trailer' : 'Watch Trailer'}
                            </button>
                            <button style={{...styles.button, ...styles.secondaryButton}}>
                                <i className="fa fa-plus"></i> Add to Watchlist
                            </button>
                            <button style={{...styles.button, ...styles.secondaryButton}}>
                                <i className="fa fa-bookmark"></i> Bookmark
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Trailer Section */}
                {showTrailer && (
                    <div style={styles.trailerSection}>
                        <h2 style={styles.sectionTitle}>Official Trailer</h2>
                        <div style={styles.trailerContainer}>
                            <iframe 
                                style={styles.trailerFrame}
                                src={`https://www.youtube.com/embed/${movie.trailerUrl}?autoplay=1`}
                                title={`${movie.title} Trailer`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                )}
                
                {/* Review Section */}
                <div style={styles.reviewSection}>
                    <h2 style={styles.sectionTitle}>Reviews & Ratings</h2>
                    
                    <form style={styles.reviewForm} onSubmit={handleSubmitReview}>
                        <div style={styles.formTitle}>Share your thoughts</div>
                        
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Your Name</label>
                            <input
                                type="text"
                                style={styles.input}
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                                placeholder="Enter your name"
                            />
                        </div>
                        
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Your Review</label>
                            <textarea
                                style={{...styles.input, minHeight: '100px'}}
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="What did you think about this movie?"
                                rows="4"
                            />
                        </div>
                        
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Rating</label>
                            <select 
                                value={newRating} 
                                onChange={(e) => setNewRating(Number(e.target.value))}
                                style={styles.ratingSelect}
                            >
                                {[1,2,3,4,5].map(num => (
                                    <option key={num} value={num}>
                                        {num} Star{num !== 1 ? 's' : ''} {['😞', '😐', '🙂', '😊', '😃'][num-1]}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <button type="submit" style={{...styles.button, ...styles.primaryButton, width: '100%'}}>
                            <i className="fa fa-paper-plane"></i> Post Review
                        </button>
                    </form>
                    
                    <div style={styles.commentList}>
                        {comments.length === 0 ? (
                            <div style={{textAlign: 'center', color: '#777', padding: '20px'}}>
                                Be the first to review this movie!
                            </div>
                        ) : (
                            comments.map(comment => (
                                <div key={comment.id} style={styles.comment}>
                                    <div style={styles.commentHeader}>
                                        <div style={styles.commentUser}>{comment.user}</div>
                                        <div style={styles.commentDate}>{comment.date}</div>
                                    </div>
                                    <div style={styles.commentRating}>
                                        {'★'.repeat(comment.rating)}{'☆'.repeat(5-comment.rating)}
                                    </div>
                                    <div style={styles.commentText}>{comment.comment}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Trailer;