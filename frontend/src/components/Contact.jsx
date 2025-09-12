import Header from "./Header";
import Footer from "./Footer";
import "../styles/contact.css";

export default function Contact() {
  return (
    <div className="contactContainer">
      <Header />
      <div className="contactWrapper">
          <h2>Contact Us</h2>
          <p>For any queries, feedback, or support, please reach out to us:</p>
          <div className="contactDetails">
            <div><span><b>Email:</b></span> support@hamrotask.com</div>
            <div><span><b>Phone:</b></span> +977-9800000000</div>
            <div><span><b>Address:</b></span> Kathmandu, Nepal</div>
          </div>
          <div className="socialLinks">
            <a href="" target="_blank" >Facebook</a> |
            <a href="" target="_blank" >Twitter</a> |
            <a href="" target="_blank" >Instagram</a>
          </div>
      </div>
      <Footer />
    </div>
  );
}
