import HeroSection from "../components/HeroSection";
import Featured from "../components/Featured";
import Category from '../components/Category';
import Footer from "../components/Footer";

const Home = () => {
    return (
        <div style={{ backgroundColor: "#000", minHeight: "100vh", color: "white" }}>
            <HeroSection />
            <Featured/>
            <Category/>
            <Footer />
        </div>
    );
};

export default Home;