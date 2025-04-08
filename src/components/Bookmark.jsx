import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Bookmark = () => {
    const navigate = useNavigate();
    const [bookmarks, setBookmarks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Add custom styles from second component
        const existingStyle = document.getElementById("bookmark-styles");
        if (existingStyle) {
            existingStyle.remove();
        }

        const styles = `
      .bookmarks-container {
        padding: 24px;
        background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
        color: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
      }
      
      .bookmarks-container:hover {
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4); 
      }
      
      .bookmarks-title {
        font-size: 28px;
        margin-bottom: 24px;
        text-align: center;
        position: relative;
        padding-bottom: 12px;
        font-weight: 700;
        color: #e9e9e9;
      }
      
      .bookmarks-title:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 80px;
        height: 4px;
        background: linear-gradient(90deg, #ff6b6b, #ffa502);
        border-radius: 2px;
      }
      
      .empty-state {
        font-size: 18px;
        color: #aaa;
        text-align: center;
        padding: 40px 0;
        animation: fadeIn 1s ease-in-out;
      }
      
      .bookmarks-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 24px;
        animation: fadeIn 0.5s ease-in-out;
      }
      
      .bookmark-item {
        background-color: #292929;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        transform: translateY(0);
        position: relative;
      }
      
      .bookmark-item:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 25px rgba(0, 0, 0, 0.3);
      }
      
      .bookmark-image-container {
        width: 100%;
        height: 300px;
        overflow: hidden;
        position: relative;
      }
      
      .bookmark-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: all 0.5s ease;
      }
      
      .bookmark-item:hover .bookmark-image {
        transform: scale(1.1);
      }
      
      .bookmark-details {
        padding: 16px;
        position: relative;
      }
      
      .bookmark-name {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 8px;
        color: #e9e9e9;
      }
      
      .bookmark-rating {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        font-size: 16px;
        margin-bottom: 12px;
      }
      
      .bookmark-rating i {
        color: gold;
        transition: all 0.3s ease;
      }
      
      .bookmark-item:hover .bookmark-rating i {
        transform: rotate(360deg);
      }
      
      .remove-bookmark-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: rgba(255, 0, 0, 0.7);
        color: white;
        border: none;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0;
        transition: all 0.3s ease;
      }
      
      .bookmark-item:hover .remove-bookmark-button {
        opacity: 1;
      }

      .bookmark-actions {
        display: flex;
        gap: 8px;
        justify-content: space-between;
      }

      .add-to-watchlist-button, .play-trailer-button {
        border: none;
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 14px;
        transition: all 0.3s ease;
      }

      .add-to-watchlist-button {
        background-color: #ff6b6b;
        color: white;
      }

      .play-trailer-button {
        background-color: #4a4a4a;
        color: white;
      }

      .add-to-watchlist-button:hover, .play-trailer-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
      }
      
      .bookmarks-header {
        display: flex;
        align-items: center;
        margin-bottom: 30px;
      }

      .back-button {
        background-color: #333;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 5px;
        transition: all 0.3s ease;
        margin-right: 20px;
      }

      .back-button:hover {
        background-color: #444;
      }

      .browse-button {
        background-color: #ff6b6b;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 16px;
        margin-top: 20px;
        transition: all 0.3s ease;
      }

      .browse-button:hover {
        background-color: #ff5252;
        transform: translateY(-2px);
      }

      .loading {
        display: flex;
        justify-content: center;
        padding: 40px 0;
      }
      
      .loading::after {
        content: '';
        width: 12px;
        height: 12px;
        margin: 0 6px;
        border-radius: 50%;
        background-color: #ff6b6b;
        animation: bounce 1.4s infinite ease-in-out both;
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1.0); }
      }
    `;

        const styleSheet = document.createElement("style");
        styleSheet.id = "bookmark-styles"; // Add ID to avoid duplicates
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        // Load bookmarks from localStorage
        const loadBookmarks = () => {
            setIsLoading(true);
            const savedBookmarks = localStorage.getItem('bookmarksArray');
            
            if (savedBookmarks) {
                const parsedBookmarks = JSON.parse(savedBookmarks);
                // Sort by date added (newest first)
                parsedBookmarks.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
                setBookmarks(parsedBookmarks);
            }
            
            setIsLoading(false);
        };

        loadBookmarks();

        return () => {
            styleSheet.remove(); // Remove style when component unmounts
        };
    }, []);

    // Remove item from bookmarks
    const removeFromBookmarks = (id) => {
        // Get current bookmarked status
        const currentBookmarked = JSON.parse(localStorage.getItem('bookmarks') || '{}');
        delete currentBookmarked[id];
        localStorage.setItem('bookmarks', JSON.stringify(currentBookmarked));
        
        // Update bookmarksArray
        const updatedBookmarks = bookmarks.filter(item => item.id !== id);
        setBookmarks(updatedBookmarks);
        localStorage.setItem('bookmarksArray', JSON.stringify(updatedBookmarks));
        
        alert("Removed from bookmarks");
    };

    // Add to watchlist
    const addToWatchlist = (item) => {
        // Get current watchlist array
        let watchlistArray = JSON.parse(localStorage.getItem('watchlistArray') || '[]');
        
        // Check if item is already in watchlist
        if (!watchlistArray.some(watchItem => watchItem.id === item.id)) {
            // Add the item
            watchlistArray.push({
                ...item,
                dateAdded: new Date().toISOString()
            });
            
            // Save the updated array
            localStorage.setItem('watchlistArray', JSON.stringify(watchlistArray));
            
            // Update watchlist status object
            const watchlistStatus = JSON.parse(localStorage.getItem('watchlist') || '{}');
            watchlistStatus[item.id] = true;
            localStorage.setItem('watchlist', JSON.stringify(watchlistStatus));
            
            // Show notification
            alert(`Added to watchlist: ${item.name}`);
        } else {
            alert(`${item.name} is already in your watchlist`);
        }
    };

    // Go back to main page
    const goBack = () => {
        navigate(-1);
    };

    return (
        <div className="bookmarks-container">
            <div className="bookmarks-header">
                <button className="back-button" onClick={goBack}>
                    <i className="fa fa-arrow-left"></i> Back
                </button>
                <h1 className="bookmarks-title">My Bookmarks</h1>
            </div>

            {isLoading ? (
                <div className="loading">Loading your bookmarks...</div>
            ) : bookmarks.length === 0 ? (
                <div className="empty-state">
                    <i className="fa fa-bookmark-o empty-icon"></i>
                    <p>No movies bookmarked yet. Start exploring and save your favorites!</p>
                    <button className="browse-button" onClick={goBack}>Browse Movies</button>
                </div>
            ) : (
                <div className="bookmarks-grid">
                    {bookmarks.map((item, index) => (
                        <div 
                            key={item.id} 
                            className="bookmark-item"
                            style={{
                                animationDelay: `${index * 0.1}s`,
                                animation: 'fadeIn 0.5s ease-in-out forwards'
                            }}
                        >
                            <div className="bookmark-image-container">
                                <img 
                                    src={item.image || 'https://via.placeholder.com/200x300'} 
                                    alt={item.name} 
                                    className="bookmark-image" 
                                />
                                <button
                                    className="remove-bookmark-button"
                                    onClick={() => removeFromBookmarks(item.id)}
                                    aria-label="Remove from bookmarks"
                                >
                                    <i className="fa fa-times"></i>
                                </button>
                            </div>

                            <div className="bookmark-details">
                                <h3 className="bookmark-name">{item.name}</h3>
                                
                                <div className="bookmark-rating">
                                    <i className="fa fa-star"></i>
                                    <span>{item.rating}</span>
                                </div>

                                <div className="bookmark-actions">
                                    <button 
                                        className="add-to-watchlist-button"
                                        onClick={() => addToWatchlist(item)}
                                    >
                                        <i className="fa fa-plus"></i> Add to Watchlist
                                    </button>
                                    
                                    <button className="play-trailer-button">
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

export default Bookmark;