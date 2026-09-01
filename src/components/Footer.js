"use client";

import { useCallback } from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Smooth scroll function
  const scrollToSection = useCallback((sectionId, event) => {
    if (event) event.preventDefault();
    
    const targetSection = document.getElementById(sectionId);
    if (!targetSection) return;
    
    const offset = 80; // Adjust this value based on header height
    const targetPosition = targetSection.offsetTop - offset;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }, []);
  
  return (
    <footer className="bg-primary text-white pt-20 pb-10">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="animate-fade-in">
            <h3 className="text-xl mb-3 font-normal logo-emblem text-white">Ambreen Rashid Khan</h3>
            <p className="text-white/80 text-sm mb-6">Clinical Psychologist</p>
            <p className="text-white/70 text-sm mb-8 max-w-xs">
              Dedicated to providing compassionate, evidence-based therapy that honors your unique experiences and challenges.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="social-icon bg-white/10 border-0 text-white hover:text-primary hover:bg-white" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                </svg>
              </a>
              <a href="#" className="social-icon bg-white/10 border-0 text-white hover:text-primary hover:bg-white" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="social-icon bg-white/10 border-0 text-white hover:text-primary hover:bg-white" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="social-icon bg-white/10 border-0 text-white hover:text-primary hover:bg-white" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="animate-fade-in delay-100">
            <h4 className="text-white font-medium mb-6 text-base relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-white/30"></span>
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#about" onClick={(e) => scrollToSection('about', e)} className="text-white/80 hover:text-white transition-colors text-sm flex items-center group">
                  <span className="mr-2 transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span> 
                  About
                </a>
              </li>
              <li>
                <a href="#approach" onClick={(e) => scrollToSection('approach', e)} className="text-white/80 hover:text-white transition-colors text-sm flex items-center group">
                  <span className="mr-2 transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span> 
                  Approach
                </a>
              </li>
              <li>
                <a href="#services" onClick={(e) => scrollToSection('services', e)} className="text-white/80 hover:text-white transition-colors text-sm flex items-center group">
                  <span className="mr-2 transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span> 
                  Services
                </a>
              </li>
              <li>
                <a href="#faq" onClick={(e) => scrollToSection('faq', e)} className="text-white/80 hover:text-white transition-colors text-sm flex items-center group">
                  <span className="mr-2 transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span> 
                  FAQ
                </a>
              </li>
              <li>
                <a href="#contact" onClick={(e) => scrollToSection('contact', e)} className="text-white/80 hover:text-white transition-colors text-sm flex items-center group">
                  <span className="mr-2 transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span> 
                  Contact
                </a>
              </li>
            </ul>
          </div>
          
          <div className="animate-fade-in delay-200">
            <h4 className="text-white font-medium mb-6 text-base relative inline-block">
              Contact
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-white/30"></span>
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/60 mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-white/80 text-sm">ambreenrashidkhan@gmail.com</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/60 mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-white/80 text-sm">+92 333 5515445</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/60 mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-white/80 text-sm">Shadman 2, Lahore, Pakistan</span>
              </li>
            </ul>
          </div>

          <div className="animate-fade-in delay-300">
            <h4 className="text-white font-medium mb-6 text-base relative inline-block">
              Hours & Availability
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-white/30"></span>
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/60 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-white/80 text-sm">Monday - Friday</p>
                  <p className="text-white/60 text-xs">9:00 AM - 6:00 PM</p>
                </div>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/60 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-white/80 text-sm">Saturday</p>
                  <p className="text-white/60 text-xs">By appointment only</p>
                </div>
              </li>
              <li className="mt-6">
                <a href="#contact" onClick={(e) => scrollToSection('contact', e)} className="inline-block bg-white text-primary hover:bg-white/90 transition-colors py-2 px-4 rounded text-sm font-medium">
                  Contact Me
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-8 mt-10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-xs mb-4 md:mb-0">
            &copy; {currentYear} Ambreen Rashid Khan. All rights reserved.
          </p>
          <div>
            <ul className="flex flex-wrap space-x-6 justify-center md:justify-end">
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors text-xs">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors text-xs">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors text-xs">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors text-xs">
                  Accessibility
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
} 