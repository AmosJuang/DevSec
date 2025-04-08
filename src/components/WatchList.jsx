import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Watchlist = () => {
    const navigate = useNavigate();
    const [watchlist, setWatchlist] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load watchlist from localStorage
        const loadWatchlist = () => {
            setIsLoading(true);
            const savedWatchlist = localStorage.getItem('watchlistArray');

            if (savedWatchlist) {
                const parsedWatchlist = JSON.parse(savedWatchlist);
                // Sort by date added (newest first)
                parsedWatchlist.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
                setWatchlist(parsedWatchlist);
            }

            setIsLoading(false);
        };

        loadWatchlist();
    }, []);

    // Remove item from watchlist
    const removeFromWatchlist = (id) => {
        // Get current watchlist status
        const currentWatchlist = JSON.parse(localStorage.getItem('watchlist') || '{}');
        delete currentWatchlist[id];
        localStorage.setItem('watchlist', JSON.stringify(currentWatchlist));

        // Update watchlistArray
        const updatedWatchlist = watchlist.filter(item => item.id !== id);
        setWatchlist(updatedWatchlist);
        localStorage.setItem('watchlistArray', JSON.stringify(updatedWatchlist));

        alert("Removed from watchlist");
    };

    // Add to bookmarks
    const addToBookmarks = (item) => {
        // Get current bookmarks array
        let bookmarksArray = JSON.parse(localStorage.getItem('bookmarksArray') || '[]');

        // Check if item is already in bookmarks
        if (!bookmarksArray.some(bookmarkItem => bookmarkItem.id === item.id)) {
            // Add the item
            bookmarksArray.push({
                ...item,
                dateAdded: new Date().toISOString()
            });

            // Save the updated array
            localStorage.setItem('bookmarksArray', JSON.stringify(bookmarksArray));

            // Update bookmark status object
            const bookmarkedStatus = JSON.parse(localStorage.getItem('bookmarks') || '{}');
            bookmarkedStatus[item.id] = true;
            localStorage.setItem('bookmarks', JSON.stringify(bookmarkedStatus));

            // Show notification
            alert(`Added to bookmarks: ${item.name}`);
        } else {
            alert(`${item.name} is already in your bookmarks`);
        }
    };

    // Go back to main page
    const goBack = () => {
        navigate(-1);
    };

    // Mark as watched
    const markAsWatched = (id) => {
        // Update the watched status in the watchlist array
        const updatedWatchlist = watchlist.map(item => {
            if (item.id === id) {
                return { ...item, watched: !item.watched };
            }
            return item;
        });

        setWatchlist(updatedWatchlist);
        localStorage.setItem('watchlistArray', JSON.stringify(updatedWatchlist));

        const itemName = watchlist.find(item => item.id === id).name;
        const status = !watchlist.find(item => item.id === id).watched;
        alert(`${itemName} marked as ${status ? 'watched' : 'unwatched'}`);
    };

    // Dark theme with red accents
    const styles = {
        watchlistContainer: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#121212',
            color: '#ffffff',
            minHeight: '100vh',
        },
        watchlistHeader: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '30px',
            borderBottom: '1px solid #333333',
            paddingBottom: '15px',
        },
        backButton: {
            background: 'transparent',
            border: 'none',
            color: '#ff3333',
            fontSize: '16px',
            cursor: 'pointer',
            marginRight: '20px',
            display: 'flex',
            alignItems: 'center',
            padding: '8px 12px',
            borderRadius: '4px',
        },
        watchlistTitle: {
            fontSize: '28px',
            fontWeight: 'bold',
            margin: '0',
            color: '#ffffff',
        },
        loading: {
            textAlign: 'center',
            padding: '40px',
            fontSize: '18px',
            color: '#cccccc',
        },
        emptyState: {
            textAlign: 'center',
            padding: '60px 20px',
            border: '2px dashed #333333',
            borderRadius: '8px',
            color: '#cccccc',
        },
        emptyIcon: {
            fontSize: '48px',
            marginBottom: '15px',
            color: '#ff3333',
        },
        browseButton: {
            background: '#ff3333',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '12px 24px',
            fontSize: '16px',
            marginTop: '20px',
            cursor: 'pointer',
        },
        watchlistGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '25px',
        },
        watchlistItem: {
            border: '1px solid #333333',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            backgroundColor: '#1e1e1e',
            position: 'relative',
            ":hover": {
                transform: 'translateY(-5px)',
                boxShadow: '0 6px 12px rgba(255, 51, 51, 0.2)',
            }
        },
        watchedItem: {
            opacity: '0.7',
            position: 'relative',
        },
        watchlistImageContainer: {
            position: 'relative',
            height: '200px',
            overflow: 'hidden',
        },
        watchlistImage: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
        },
        removeWatchlistButton: {
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(255, 51, 51, 0.8)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
        },
        watchedBadge: {
            position: 'absolute',
            top: '10px',
            left: '10px',
            background: 'rgba(255, 51, 51, 0.8)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
        },
        watchlistDetails: {
            padding: '15px',
        },
        watchlistName: {
            fontSize: '18px',
            margin: '0 0 10px 0',
            fontWeight: 'bold',
            color: '#ffffff',
        },
        watchlistRating: {
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            color: '#ff3333',
            marginBottom: '15px',
        },
        watchlistActions: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
        },
        actionButton: {
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            border: 'none',
            transition: 'background-color 0.2s',
        },
        watchedToggleButton: {
            backgroundColor: '#ff3333',
            color: 'white',
        },
        unwatchedToggleButton: {
            backgroundColor: '#333333',
            color: 'white',
        },
        bookmarkButton: {
            backgroundColor: '#2a2a2a',
            color: 'white',
            border: '1px solid #ff3333',
        },
        trailerButton: {
            backgroundColor: '#000000',
            color: '#ff3333',
            border: '1px solid #ff3333',
        }
    };

    return (
        <div style={styles.watchlistContainer}>
            <div style={styles.watchlistHeader}>
                <button style={styles.backButton} onClick={goBack}>
                    <i className="fa fa-arrow-left"></i> Back
                </button>
                <h1 style={styles.watchlistTitle}>My Watchlist</h1>
            </div>

            {isLoading ? (
                <div style={styles.loading}>Loading your watchlist...</div>
            ) : watchlist.length === 0 ? (
                <div style={styles.emptyState}>
                    <i className="fa fa-list-ul" style={styles.emptyIcon}></i>
                    <p>Your watchlist is empty.</p>
                    <button style={styles.browseButton} onClick={goBack}>Browse Movies</button>
                </div>
            ) : (
                <div style={styles.watchlistGrid}>
                    {watchlist.map((item) => (
                        <div key={item.id} style={{
                            ...styles.watchlistItem,
                            ...(item.watched ? styles.watchedItem : {})
                        }}>
                            <div style={styles.watchlistImageContainer}>
                                <img src={item.image} alt={item.name} style={styles.watchlistImage} />
                                <button
                                    style={styles.removeWatchlistButton}
                                    onClick={() => removeFromWatchlist(item.id)}
                                    aria-label="Remove from watchlist"
                                >
                                    <i className="fa fa-times"></i>
                                </button>
                                {item.watched && (
                                    <div style={styles.watchedBadge}>
                                        <i className="fa fa-check"></i> Watched
                                    </div>
                                )}
                            </div>

                            <div style={styles.watchlistDetails}>
                                <h3 style={styles.watchlistName}>{item.name}</h3>

                                <div style={styles.watchlistRating}>
                                    <i className="fa fa-star"></i>
                                    <span>{item.rating}</span>
                                </div>

                                <div style={styles.watchlistActions}>
                                    <button
                                        style={{
                                            ...styles.actionButton,
                                            ...(item.watched ? styles.unwatchedToggleButton : styles.watchedToggleButton)
                                        }}
                                        onClick={() => markAsWatched(item.id)}
                                    >
                                        <i className={`fa ${item.watched ? 'fa-undo' : 'fa-check'}`}></i>
                                        {item.watched ? 'Mark Unwatched' : 'Mark Watched'}
                                    </button>

                                    <button
                                        style={{...styles.actionButton, ...styles.bookmarkButton}}
                                        onClick={() => addToBookmarks(item)}
                                    >
                                        <i className="fa fa-bookmark"></i> Bookmark
                                    </button>

                                    <button style={{...styles.actionButton, ...styles.trailerButton}}>
                                        <i className="fa fa-play-circle"></i> Trailer
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Watchlist;