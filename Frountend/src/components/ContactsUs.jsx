import React, { useState } from 'react';
import "../App.css"
const ContactUsPage = ({ darkMode }) => {
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Update the formData state as the user types
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
    setLoader(false);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${darkMode ? 'from-black via-gray-900 to-blue-900 text-white' : 'from-white via-gray-100 to-blue-50 text-black'} p-6 md:p-10`}>
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section */}
        <header className="text-center space-y-4 mt-10">
          <h1 className={`text-4xl md:text-5xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>Contact Us</h1>
          <p className={`text-lg md:text-xl ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            We would love to hear from you! Reach out to us with any questions, feedback, or concerns.
          </p>
        </header>

        {/* Contact Information Section */}
        <section className="grid md:grid-cols-2 gap-10 md:gap-20">
          <div className="space-y-6">
            <h2 className={`text-3xl font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>Our Office</h2>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Visit our office or get in touch with us through the following details:
            </p>
            <ul className="space-y-4">
              <li className={`${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                <strong>Address:</strong> AKGEC, Ghaziabad Delhi, Meerut-Delhi Road
              </li>
              <li className={`${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                <strong>Email:</strong> <a href="mailto:info@sma.com" className="text-blue-400 hover:underline">FastFinger@akgec.ac.in</a>
              </li>
              <li className={`${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                <strong>Phone:</strong> <a href="tel:+1234567890" className="text-blue-400 hover:underline">+91 9719167540</a>
              </li>
              <li className={`${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                <strong>Business Hours:</strong> Mon - Fri: 9:00 AM - 6:00 PM
              </li>
            </ul>
          </div>

          <div className="relative w-full h-64 rounded-lg shadow-lg overflow-hidden">
            <iframe
              title="Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14014.88252402814!2d77.40994685!3d28.6691564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cf053a6eaa2b7%3A0xf2577dfbaae1ff97!2sGhaziabad%2C%20Uttar%20Pradesh%20201009%2C%20India!5e0!3m2!1sen!2sin!4v1697874999649!5m2!1sen!2sin"
              className="absolute inset-0 w-full h-full"
              allowFullScreen
            ></iframe>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="space-y-8">
          <h2 className={`text-3xl font-semibold text-center ${darkMode ? 'text-white' : 'text-black'}`}>Send Us a Message</h2>

          {loader ? (
            <div className="w-full my-20 flex justify-center items-center">
              <div className="loader mx-auto"></div>
            </div>
          ) : (
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto" onSubmit={handleSubmit}>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  className={`w-full py-3 px-4 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  className={`w-full py-3 px-4 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="relative md:col-span-2">
                <input
                  type="tel"
                  name="phone"
                  className={`w-full py-3 px-4 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                  placeholder="Your Phone Number (optional)"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="relative md:col-span-2">
                <textarea
                  name="message"
                  className={`w-full py-3 px-4 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                  placeholder="Your Message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <div className="md:col-span-2 flex justify-center">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 py-2 px-6"
                >
                  Send Message
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Social Media Section */}
        <section className="space-y-6 text-center">
          <h2 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>Connect With Us</h2>
          <div className="flex justify-center space-x-6">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500">
              <i className="fab fa-facebook-f text-2xl"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500">
              <i className="fab fa-twitter text-2xl"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500">
              <i className="fab fa-instagram text-2xl"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500">
              <i className="fab fa-linkedin-in text-2xl"></i>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactUsPage;
