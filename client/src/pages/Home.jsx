import Navbar from "../component/home/Navbar";
import Hero from "../component/home/Hero";
import Features from "../component/home/Features";
import Workflow from "../component/home/Workflow";
import Stats from "../component/home/Stats";
import CTA from "../component/home/CTA";
import Footer from "../component/home/Footer";

const Home = () => {
  return (
    <div className="home-page">
      <Navbar />

      <main>
        <Hero />
        <Stats />
        <Features />
        <Workflow />
        <CTA />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
