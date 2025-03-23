import React from 'react';
import Navbar from '../components/Navbar';

const Contact = () => {
  return (
    <div className='min-h-screen bg-zinc-800'>
      <Navbar />
      <div className="bg-zinc-800 w-full flex justify-center items-center rounded-lg">
        <div className="contact-us text-white w-3/4 p-12">
          <h1 className="text-4xl mb-8">Get in Touch with Us</h1>
          <p className="text-lg mb-4">Have a question, comment, or concern? We're here to listen and help. Reach out to us using the contact form below, or get in touch with us directly using the information provided.</p>

          <div className="mb-12">
            <h2 className="text-3xl mb-2">Contact Information</h2>
            <ul className="list-disc pl-8 mb-4">
              <li className="mb-2">
                <strong>Email:</strong> <a href="mailto:info@verolens.com" className="text-blue-400 hover:text-blue-600">info@verolens.com</a>
              </li>
              <li className="mb-2">
                <strong>Phone:</strong> +1 (555) 123-4567
              </li>
              <li className="mb-2">
                <strong>Address:</strong> 123 Main St, Anytown, USA 12345
              </li>
            </ul>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl mb-2">Contact Form</h2>
            <form className="w-full max-w-lg">
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                    First Name
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-first-name" type="text" placeholder="Jane" />
                </div>
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
                    Last Name
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="Doe" />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-email">
                    Email
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-email" type="email" placeholder="jane.doe@example.com" />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-message">
                    Message
                  </label>
                  <textarea className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-message" placeholder="Enter your message here..." />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                    Send Message
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;