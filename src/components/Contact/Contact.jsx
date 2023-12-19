import { useState, useEffect } from 'react';
import "./Contact.css";

const Contact = () => {
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    address: '',
    googleMapsUrl: '',
  });

  useEffect(() => {
    // Fetch contact info from the backend
    const fetchContactInfo = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${apiUrl}/api/contact`);
        if (response.ok) {
          const data = await response.json();
          setContactInfo(data);
        } else {
          console.error('Failed to fetch contact info');
        }
      } catch (error) {
        console.error('Error fetching contact info:', error);
      }
    };

    fetchContactInfo();
  }, []);

  return (
    <section className="contact">
      <div className="contact-top">
        <div className="contact-map">
          {contactInfo.googleMapsUrl && (
            <iframe
              src={contactInfo.googleMapsUrl}
              width="100%"
              height="500"
              style={{ border: "0" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          )}
        </div>
      </div>
      <div className="contact-bottom">
        <div className="container">
          <div className="contact-titles">
            <h4>Contact with us</h4>
            <h2>Get In Touch</h2>
            <p>
              In hac habitasse platea dictumst. Pellentesque viverra sem nec
              orci lacinia, in bibendum urna mollis. Quisque nunc lacus, varius
              vel leo a, pretium lobortis metus. Vivamus consectetur consequat
              justo.
            </p>
          </div>
          <div className="contact-elements">
            <form className="contact-form">
              <div className="">
                <label>
                  Your Name
                  <span>*</span>
                </label>
                <input type="text" required />
              </div>
              <div className="">
                <label>
                  Your email
                  <span>*</span>
                </label>
                <input type="text" required />
              </div>
              <div className="">
                <label>
                  Subject
                  <span>*</span>
                </label>
                <input type="text" required />
              </div>
              <div className="">
                <label>
                  Your message
                  <span>*</span>
                </label>
                <textarea
                  id="author"
                  name="author"
                  type="text"
                  defaultValue=""
                  size="30"
                  required=""
                ></textarea>
              </div>
              <button className="btn btn-sm form-button">Send Message</button>
            </form>
            <div className="contact-info">
              <div className="contact-info-item">
                <div className="contact-info-texts">
                  <strong>Contact Information</strong>
                  <p className="contact-street">Adres: {contactInfo.address}</p>
                  <a href={`tel:${contactInfo.phone}`}>Telefon: {contactInfo.phone}</a>
                  <a href={`mailto:${contactInfo.email}`}>Email: {contactInfo.email}</a>
                </div>
              </div>
              {/* Additional contact information can be added here */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
