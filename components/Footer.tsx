import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { FacebookIcon, WhatsAppIcon, YoutubeIcon } from './icons.tsx';

interface FooterProps {
  onOpenCalendarModal: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenCalendarModal }) => {
  const handleDownloadLogo = () => {
    const link = document.createElement('a');
    link.href = 'https://ik.imagekit.io/fonepay/I%20lovePDLY%20logo.PNG?updatedAt=1753104228877';
    link.download = 'ilovepdfly-logo.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <footer className="bg-black text-white w-full">
      <div className="container mx-auto px-6 py-8 md:py-12">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-y-8 gap-x-6">
          
          {/* Logo & Socials */}
          <div className="col-span-2 lg:col-span-3">
            <h3 className="font-bold text-lg sm:text-xl mb-3 text-white flex items-center gap-1.5">
              <span>I</span>
              <span className="text-brand-red">❤</span>
              <span>PDFLY</span>
            </h3>
            <p className="text-gray-400 text-sm max-w-xs">
              Our mission is to make document management simple, secure, and accessible for everyone.
            </p>
            <div className="flex space-x-4 mt-5">
              <a href="https://www.facebook.com/share/16sdjGNVGr/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                <FacebookIcon className="h-6 w-6" />
              </a>
              <a href="https://wa.me/message/JYA22CVSYSZ4N1" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="WhatsApp">
                <WhatsAppIcon className="h-6 w-6" />
              </a>
              <a href="https://www.youtube.com/@btmobilecare" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="YouTube">
                <YoutubeIcon className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          {/* Top Tools */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-base sm:text-lg mb-3 text-white">Top Tools</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/merge-pdf" className="hover:text-white transition-colors">Merge PDF</Link></li>
              <li><Link to="/split-pdf" className="hover:text-white transition-colors">Split PDF</Link></li>
              <li><Link to="/compress-pdf" className="hover:text-white transition-colors">Compress PDF</Link></li>
              <li><Link to="/pdf-to-word" className="hover:text-white transition-colors">PDF to Word</Link></li>
              <li><Link to="/jpg-to-pdf" className="hover:text-white transition-colors">JPG to PDF</Link></li>
              <li><Link to="/invoice-generator" className="hover:text-white transition-colors">Invoice Generator</Link></li>
               <li><Link to="/#all-tools" className="font-semibold text-white hover:text-brand-red transition-colors">All Tools &rarr;</Link></li>
            </ul>
          </div>
          
          {/* Solutions */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-base sm:text-lg mb-3 text-white">Solutions</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/education" className="hover:text-white transition-colors">For Education</Link></li>
              <li><Link to="/business" className="hover:text-white transition-colors">For Business</Link></li>
              <li><Link to="/how-to-use" className="hover:text-white transition-colors">How-to Guides</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-base sm:text-lg mb-3 text-white">Company</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About us</Link></li>
              <li><Link to="/ceo" className="hover:text-white transition-colors">Message from CEO</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/developer" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><button onClick={onOpenCalendarModal} className="hover:text-white transition-colors text-left">Calendar</button></li>
              <li><button onClick={handleDownloadLogo} className="hover:text-white transition-colors text-left">Our Logo</button></li>
            </ul>
          </div>

          {/* Trustpilot & Download App */}
          <div className="lg:col-span-3">
             <div className="mb-5">
              <a href="https://www.trustpilot.com/review/ilovepdfly.com" target="_blank" rel="noopener noreferrer">
                <img 
                    src="https://ik.imagekit.io/fonepay/widget.jpg?updatedAt=1752933053507" 
                    alt="Review us on Trustpilot"
                    className="h-auto transition-transform hover:scale-105"
                    style={{ maxWidth: '150px' }}
                    width="150"
                    height="78"
                    loading="lazy"
                />
              </a>
            </div>
            <h3 className="font-bold text-base sm:text-lg mb-3 text-white">Download our App</h3>
            <div className="flex flex-col items-start gap-3">
                <a href="https://play.google.com/store/apps/details?id=com.ilovepdf.ilovepdf" target="_blank" rel="noopener noreferrer" aria-label="Get it on Google Play">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png" alt="Google Play Store Badge" className="h-10 hover:opacity-90 transition-opacity" width="121" height="40" loading="lazy" />
                </a>
                <a href="https://apps.apple.com/us/app/ilovepdf-pdf-editor-scanner/id1485633453" target="_blank" rel="noopener noreferrer" aria-label="Download on the App Store">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/2560px-Download_on_the_App_Store_Badge.svg.png" alt="App Store Badge" className="h-10 hover:opacity-90 transition-opacity" width="120" height="40" loading="lazy" />
                </a>
            </div>
          </div>
          
          {/* Subscribe Form */}
          <div className="col-span-2 lg:col-span-12">
             <h3 className="font-bold text-base sm:text-lg mb-3 text-white">Stay Connected</h3>
             <p className="text-gray-400 text-sm mb-3">Get the latest news and updates from our team.</p>
             <form className="flex flex-col sm:flex-row gap-2 max-w-sm">
                <input type="email" placeholder="Enter your email" className="flex-grow px-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-brand-red focus:border-transparent text-white" />
                <button type="submit" className="bg-brand-red hover:bg-brand-red-dark text-white font-bold py-2 sm:py-3 px-4 rounded-md transition-colors">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="mt-8 md:mt-10 border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center text-gray-400 text-sm">
          <p className="order-2 sm:order-1 mt-4 sm:mt-0">&copy; {new Date().getFullYear()} I Love PDFLY. All Rights Reserved.</p>
          <div className="flex space-x-4 order-1 sm:order-2">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
             <Link to="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);