import Header from "./Header";
import Footer from "./Footer";
import "../styles/about.css";

export default function About() {
  return (
    <div className="aboutWrapper">
      <Header />
      <main className="aboutContent">
        <h2>About HamroTask</h2>
        <p>HamroTask is a platform designed to connect clients and taskers in Nepal for everyday tasks and services. Our mission is to make it easy, safe, and reliable for people to get help or offer their skills.</p>
        <div className="aboutDetails">
          <h3>Our Vision</h3>
          <p>Empowering Nepali communities by bridging the gap between service seekers and providers.</p>
          <h3>Our Team</h3>
          <p>HamroTask is built by passionate Nepali developers and entrepreneurs who care about local impact.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
