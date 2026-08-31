"use client";

import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    enquiryType: 'general', // Default value
    message: '',
    privacy: false,
    website: '',
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: '',
  });
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message || !formData.privacy) {
      setFormStatus({
        submitted: true,
        success: false,
        message: 'Please fill out all required fields and agree to the privacy statement.',
      });
      return;
    }

    setIsSending(true);
    setFormStatus({
      submitted: false,
      success: false,
      message: '',
    });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Unable to send your message. Please try again later.');
      }

      setFormStatus({
        submitted: true,
        success: true,
        message: 'Thank you for reaching out. I will respond to your message within 24-48 hours.',
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        enquiryType: 'general',
        message: '',
        privacy: false,
        website: '',
      });
    } catch (error) {
      setFormStatus({
        submitted: true,
        success: false,
        message: error instanceof Error && error.message
          ? error.message
          : 'Unable to send your message. Please try again later.',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contact" className="section bg-cream-white">
      <div className="container max-w-5xl mx-auto">
        <h2 className="section-title animate-fade-in">Get in Touch</h2>
        
        <div className="text-center max-w-3xl mx-auto mb-10 animate-fade-in">
          <p className="text-text-light">I&apos;m here to listen and support you on your journey to better mental health. Feel free to reach out with any questions you have about my services or to schedule a consultation.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white rounded-lg shadow-md overflow-hidden">
          {/* Contact Info Column */}
          <div className="lg:col-span-5 bg-white p-8 text-gray-700 animate-slide-right">
            <h3 className="text-xl font-medium mb-6">How I Can Help</h3>
            
            <div className="space-y-6 mb-10">
              <div className="flex items-start space-x-4 animate-fade-in delay-100">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-700 text-sm">Email</p>
                  <p className="text-gray-900">consult@ambreenrashidkhan.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 animate-fade-in delay-200">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-700 text-sm">Phone</p>
                  <p className="text-gray-900">+92 333 5515445</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 animate-fade-in delay-300">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-700 text-sm">Location</p>
                  <p className="text-gray-900">Shadman 2, Lahore, Pakistan</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 animate-fade-in delay-400">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-700 text-sm">Working Hours</p>
                  <p className="text-gray-900">Monday - Friday: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h4 className="text-gray-700 text-sm font-medium mb-4">Connect With Me</h4>
              <div className="flex space-x-3">
                <a href="#" className="w-9 h-9 rounded-full flex items-center justify-center bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                  </svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-full flex items-center justify-center bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                  </svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-full flex items-center justify-center bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* Contact Form Column */}
          <div className="lg:col-span-7 p-8 animate-slide-left">
            <h3 className="text-xl font-medium mb-6">Send Me a Message</h3>
            
            <form onSubmit={handleSubmit} noValidate>
              {formStatus.submitted && (
                <div className={`mb-6 p-4 rounded-md ${formStatus.success ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                  {formStatus.message}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50" 
                    required 
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50" 
                    required 
                  />
                </div>
              </div>

              <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="phone" className="block mb-1 text-sm font-medium text-gray-700">Phone (optional)</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50" 
                  />
                </div>
                
                <div>
                  <label htmlFor="enquiryType" className="block mb-1 text-sm font-medium text-gray-700">Enquiry Type</label>
                  <select 
                    id="enquiryType" 
                    name="enquiryType" 
                    value={formData.enquiryType} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                  >
                    <option value="general">General Enquiry</option>
                    <option value="individual">Individual Therapy</option>
                    <option value="couples">Couples Therapy</option>
                    <option value="assessment">Assessment & Consultation</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-5">
                <label htmlFor="message" className="block mb-1 text-sm font-medium text-gray-700">Message <span className="text-red-500">*</span></label>
                <textarea 
                  id="message" 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  rows="4"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50" 
                  required 
                ></textarea>
              </div>
              
              <div className="mb-5">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="privacy"
                      name="privacy"
                      type="checkbox"
                      checked={formData.privacy}
                      onChange={handleChange}
                      required
                      className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="privacy" className="text-gray-700">
                      I understand that my information will be treated confidentially and securely in accordance with professional standards.
                    </label>
                  </div>
                </div>
              </div>
              
              <button 
                type="submit"
                disabled={isSending}
                className="w-full bg-primary text-white font-medium py-2.5 px-4 rounded-md hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSending ? 'Sending...' : 'Send Message'}
              </button>
              
              <p className="text-xs text-gray-500 mt-4 text-center">Your privacy is important to me. All information shared will be kept confidential in accordance with ethical guidelines.</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}