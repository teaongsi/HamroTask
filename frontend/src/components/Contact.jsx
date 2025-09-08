import Header from "./Header";
import Footer from "./Footer";
import "../styles/contact.css";

export default function Contact() {
  return (
    <div className="contactWrapper">
      <Header />
      <main className="contactContent">
        <h2>Contact Us</h2>
        <p>For any queries, feedback, or support, please reach out to us:</p>
        <div className="contactDetails">
          <div><b>Email:</b> support@hamrotask.com</div>
          <div><b>Phone:</b> +977-9800000000</div>
          <div><b>Address:</b> Kathmandu, Nepal</div>
        </div>
        <div className="socialLinks">
          <a href="https://facebook.com/hamrotask" target="_blank" rel="noopener noreferrer">Facebook</a> |
          <a href="https://twitter.com/hamrotask" target="_blank" rel="noopener noreferrer">Twitter</a> |
          <a href="https://instagram.com/hamrotask" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
