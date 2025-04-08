import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";

// Import images from assets folder
import image1 from '../assets/1.jpg';
import image2 from '../assets/2.jpg';
import image3 from '../assets/3.jpg';
import image4 from '../assets/4.jpg';
import image5 from '../assets/5.jpg';
import image6 from '../assets/6.jpg';

// Data film
const images = [
    { id: 1, src: image1, title: "Death of a Unicorn", description: "Watch the thrilling new trailer now!", related: image1, genre: "Thriller" },
    { id: 2, src: image2, title: "Movie 2", description: "An adventure you don't want to miss.", related: image2, genre: "Adventure" },
    { id: 3, src: image3, title: "Movie 3", description: "A cinematic experience like no other.", related: image3, genre: "Drama" },
    { id: 4, src: image4, title: "Movie 4", description: "A cinematic experience like no other.", related: image4, genre: "Action" },
    { id: 5, src: image5, title: "Movie 5", description: "A cinematic experience like no other.", related: image5, genre: "Comedy" },
    { id: 6, src: image6, title: "Movie 6", description: "A cinematic experience like no other.", related: image6, genre: "Horror" },
];

const HeroSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [autoplay, setAutoplay] = useState(true);
    const [direction, setDirection] = useState(0); // -1 untuk kiri, 1 untuk kanan, 0 untuk awal
    const [isHovering, setIsHovering] = useState(false);
    const progressIntervalRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();

    // Reset progress saat slide berubah
    useEffect(() => {
        setProgress(0);
    }, [currentIndex]);

    // Animasi progress bar
    useEffect(() => {
        if (!autoplay || isHovering) {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
            return;
        }

        const duration = 5000; // 5 detik
        const increment = 100 / (duration / 16); // Update setiap 16ms (60fps)
        let currentProgress = 0;

        progressIntervalRef.current = setInterval(() => {
            currentProgress += increment;
            setProgress(Math.min(currentProgress, 100));

            if (currentProgress >= 100) {
                nextImage();
                currentProgress = 0;
                setProgress(0);
            }
        }, 16);

        return () => {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
        };
    }, [currentIndex, autoplay, isHovering]);

    // Handle mouse enter/leave untuk autoplay pause
    const handleMouseEnter = () => {
        setIsHovering(true);
        setAutoplay(false);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        setAutoplay(true);
    };

    const handleImageChange = (index) => {
        // Tentukan arah transisi
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
    };

    const nextImage = () => {
        setDirection(1);
        setCurrentIndex((prevIndex) =>
            prevIndex < images.length - 1 ? prevIndex + 1 : 0
        );
    };

    const prevImage = () => {
        setDirection(-1);
        setCurrentIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : images.length - 1
        );
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowLeft") prevImage();
            if (e.key === "ArrowRight") nextImage();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentIndex]);

    const handleMovieClick = (movieId) => {
        navigate(`/movie/${movieId}`);
    };

    // Variasi animasi untuk slide
    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction) => ({
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        }),
    };

    // Animasi untuk teks
    const textVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                delay: 0.3,
                duration: 0.5,
            }
        }
    };

    return (
        <div
            style={{
                backgroundColor: "#1a1a1a",
                color: "white",
                borderRadius: "16px",
                maxWidth: "1280px",
                margin: "20px auto",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                position: "relative"
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Progress Bar */}
            <div style={{
                width: "100%",
                height: "4px",
                backgroundColor: "rgba(255,255,255,0.1)",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 10
            }}>
                <motion.div
                    style={{
                        height: "100%",
                        backgroundColor: "#E50914",
                        transformOrigin: "left center"
                    }}
                    animate={{ width: `${progress}%` }}
                />
            </div>

            <div style={{
                display: "flex",
                flexDirection: "row",
                gap: "20px",
                padding: "30px",
                flexWrap: "wrap",
                minHeight: "550px",
                position: "relative"
            }}>
                {/* Main Carousel Section */}
                <div style={{
                    flex: "2 1 500px",
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "12px",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.4)"
                }}>
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.3 }
                            }}
                            style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%"
                            }}
                        >
                            <img
                                src={images[currentIndex].src}
                                alt={images[currentIndex].title}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                            {/* Overlay gradient */}
                            <div style={{
                                position: "absolute",
                                inset: 0,
                                background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.1) 100%)"
                            }} />

                            {/* Caption overlay */}
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={textVariants}
                                style={{
                                    position: "absolute",
                                    bottom: "30px",
                                    left: "30px",
                                    right: "30px",
                                    zIndex: 2
                                }}
                            >
                                <div style={{
                                    display: "inline-block",
                                    background: "#E50914",
                                    color: "#000",
                                    padding: "4px 10px",
                                    borderRadius: "4px",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                    marginBottom: "10px"
                                }}>
                                    {images[currentIndex].genre}
                                </div>
                                <h2 style={{
                                    fontSize: "32px",
                                    fontWeight: "bold",
                                    marginBottom: "10px",
                                    textShadow: "0 2px 4px rgba(0,0,0,0.5)"
                                }}>
                                    {images[currentIndex].title}
                                </h2>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation buttons */}
                    <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.8)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={prevImage}
                        style={{
                            position: "absolute",
                            left: "15px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            backgroundColor: "rgba(0,0,0,0.5)",
                            border: "none",
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "white",
                            fontSize: "20px",
                            zIndex: 3,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
                        }}
                        aria-label="Previous slide"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.8)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={nextImage}
                        style={{
                            position: "absolute",
                            right: "15px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            backgroundColor: "rgba(0,0,0,0.5)",
                            border: "none",
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "white",
                            fontSize: "20px",
                            zIndex: 3,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
                        }}
                        aria-label="Next slide"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </motion.button>

                    {/* Dots indicator */}
                    <div style={{
                        position: "absolute",
                        bottom: "15px",
                        right: "20px",
                        display: "flex",
                        gap: "8px",
                        zIndex: 3
                    }}>
                        {images.map((_, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleImageChange(index)}
                                style={{
                                    width: index === currentIndex ? "20px" : "10px",
                                    height: "10px",
                                    borderRadius: index === currentIndex ? "10px" : "50%",
                                    background: index === currentIndex ? "#E50914" : "rgba(255,255,255,0.5)",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: 0,
                                    transition: "width 0.3s ease, background 0.3s ease"
                                }}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Right side content */}
                <div style={{
                    flex: "1 1 300px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "10px"
                }}>
                    <motion.div
                        key={`description-${currentIndex}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            marginBottom: "25px"
                        }}
                    >
                        <h2 style={{
                            fontSize: "28px",
                            fontWeight: "bold",
                            marginBottom: "15px",
                            color: "#E50914"
                        }}>
                            {images[currentIndex].title}
                        </h2>
                        <p style={{
                            fontSize: "18px",
                            marginBottom: "25px",
                            opacity: "0.9",
                            lineHeight: "1.6"
                        }}>
                            {images[currentIndex].description}
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: "#E50914" }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                background: "#E50914",
                                color: "#111",
                                fontSize: "16px",
                                padding: "14px 28px",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "bold",
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                boxShadow: "0 4px 12px rgba(229, 9, 20, 0.3)"
                            }}
                            onClick={() => handleMovieClick(images[currentIndex].id)}
                        >
                            Watch Now
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                        </motion.button>
                    </motion.div>

                    <div style={{
                        marginTop: "20px",
                        maxHeight: "300px",
                        overflowY: "auto",
                        overflowX: "hidden",
                        paddingRight: "10px",
                        scrollbarWidth: "thin",
                        scrollbarColor: "#E50914 #333",
                        "&::-webkit-scrollbar": {
                            width: "6px",
                        },
                        "&::-webkit-scrollbar-track": {
                            background: "#333",
                        },
                        "&::-webkit-scrollbar-thumb": {
                            background: "#E50914",
                            borderRadius: "3px",
                        }
                    }}>
                        <h3 style={{
                            marginBottom: "15px",
                            fontSize: "18px",
                            opacity: 0.8,
                            fontWeight: "normal"
                        }}>
                            More to explore
                        </h3>

                        {images.map((image, index) => (
                            <motion.div
                                key={image.id}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1, duration: 0.3 }}
                                whileHover={{
                                    scale: 1.02,
                                    backgroundColor: index === currentIndex ? "rgba(229, 9, 20, 0.9)" : "rgba(255,255,255,0.1)"
                                }}
                                onClick={() => handleImageChange(index)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    padding: "10px",
                                    borderRadius: "10px",
                                    background: index === currentIndex ? "rgba(229, 9, 20, 0.8)" : "rgba(40,40,40,0.5)",
                                    marginBottom: "10px",
                                    cursor: "pointer",
                                    transition: "transform 0.2s, background-color 0.3s",
                                    transform: index === currentIndex ? "translateX(5px)" : "translateX(0)",
                                    boxShadow: index === currentIndex ? "0 3px 10px rgba(229, 9, 20, 0.3)" : "none"
                                }}
                            >
                                <img
                                    src={image.related}
                                    alt={`Thumbnail of ${image.title}`}
                                    style={{
                                        width: "90px",
                                        height: "50px",
                                        borderRadius: "6px",
                                        objectFit: "cover",
                                        boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
                                    }}
                                />
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column"
                                }}>
                                    <span style={{
                                        color: index === currentIndex ? "#111" : "white",
                                        fontWeight: index === currentIndex ? "bold" : "normal",
                                        fontSize: "15px"
                                    }}>
                                        {image.title}
                                    </span>
                                    <span style={{
                                        color: index === currentIndex ? "#333" : "#aaa",
                                        fontSize: "12px",
                                        marginTop: "3px"
                                    }}>
                                        {image.genre}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {autoplay && !isHovering && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                        position: "absolute",
                        bottom: "15px",
                        left: "15px",
                        background: "rgba(0,0,0,0.6)",
                        padding: "8px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polygon points="10 8 16 12 10 16 10 8" />
                    </svg>
                    Auto-playing • Hover to pause
                </motion.div>
            )}
        </div>
    );
};

export default HeroSection;