import { useRef } from "react";
import "./Featured.css";

// Import images from assets folder
import featured1 from '../assets/featured/f1.jpg';
import featured2 from '../assets/featured/f2.jpg';
import featured3 from '../assets/featured/f3.jpg';
import featured4 from '../assets/featured/f4.jpg';
import featured5 from '../assets/featured/f5.jpg';
import featured6 from '../assets/featured/f6.jpg';
import placeholderImage from '../assets/placeholder.jpg';

const Featured = () => {
    const scrollRef = useRef(null);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -1200, behavior: "smooth" }); // Scroll two items at once
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 1200, behavior: "smooth" }); // Scroll two items at once
        }
    };

    // Sample celebrity data with imported images
    const celebrities = [
        { name: "Tom Cruise", image: featured1 },
        { name: "Scarlett Johansson", image: featured2 },
        { name: "Robert Downey Jr.", image: featured3 },
        { name: "Zendaya", image: featured4 },
        { name: "Chris Hemsworth", image: featured5 },
        { name: "Jennifer Lawrence", image: featured6 },
    ];

    // Add featured items data array with imported images
    const featuredItems = [
        { 
            image: featured1,
            title: "TV Tracker: Renewed and Canceled Shows",
            link: "Check the status"
        },
        // Add more items...
    ];

    return (
        <>
            <div className="featured-container">
                <h3 className="featured-title">Featured today</h3>
                <div className="featured-wrapper">
                    <button onClick={scrollLeft} className="featured-button left">&#10094;</button>
                    <div ref={scrollRef} className="featured-scroll">
                        {featuredItems.map((item, index) => (
                            <div key={index} className="featured-item">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="featured-img"
                                    onError={(e) => {
                                        e.target.src = placeholderImage;
                                        console.error(`Failed to load image: ${item.image}`);
                                    }}
                                />
                                <p className="featured-text">{item.title}</p>
                                <a href="#" className="featured-link">{item.link}</a>
                            </div>
                        ))}
                    </div>
                    <button onClick={scrollRight} className="featured-button right">&#10095;</button>
                </div>
            </div>

            <div className="celebrity-container">
                <h3 className="featured-title">Most Popular Celebrities</h3>
                <div className="celebrity-grid">
                    {celebrities.map((celeb, index) => (
                        <div key={index} className="celebrity-item">
                            <img
                                src={celeb.image}
                                alt={celeb.name}
                                className="celebrity-img"
                            />
                            <p className="celebrity-name">{celeb.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Featured;