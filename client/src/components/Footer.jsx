import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsEnvelope, BsGeoAlt } from 'react-icons/bs';

export default function FooterCom() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center mb-4">
              <img
                src="https://media-hosting.imagekit.io//ede03161e2da49d8/logo.png?Expires=1833770545&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=TeutU~sf62gjBH6OthznEX0kRRgdotvnfqDIiC9uB5WoCO6IoTITWx9PDBSipxbBXwvLlGU-9Wy92tjnvyOWTGaHINnvI9dS9zr80fmRVIpf0rdhT8NKaYqODJ6o4n3R4Jzj53SMYg~uzbNvhaqo~8~6EqSp1qqbcWrVRKnKWfxHoKd~IduexgO16PUbBINr02nccScixmPKh49DMsg0CcVwoh8RlduzKjG~cYBHdTBBQDoibx3o3FOBeCL5LbIpNFNlPLFKFbVeWp9j5Cs67sWl6z3PNZlXZRB8XN335ztumsD4CxGNZ-ea7qSLnKsSCmrivEa9BY0wX68vzXpbBA__"
                alt="Swagatom Logo"
                className="w-10 h-10"
              />
              <span className="ml-3 text-2xl font-bold text-gray-900 dark:text-white">Swagatom World</span>
            </div>
            <p className="text-sm">Empowering students through educational experiences, events, and industrial exposure.</p>
            <div className="flex mt-4 space-x-4">
              <a href="#" aria-label="Facebook"><BsFacebook className="text-xl hover:text-blue-600" /></a>
              <a href="#" aria-label="Instagram"><BsInstagram className="text-xl hover:text-pink-500" /></a>
              <a href="#" aria-label="Twitter"><BsTwitter className="text-xl hover:text-blue-400" /></a>
              <a href="#" aria-label="GitHub"><BsGithub className="text-xl hover:text-black dark:hover:text-white" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/courses" className="hover:underline">Courses</Link></li>
              <li><Link to="/trips" className="hover:underline">Industrial Trips</Link></li>
              <li><Link to="/blog" className="hover:underline">Blog</Link></li>
              <li><Link to="/about" className="hover:underline">About Us</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/why-swagatom" className="hover:underline">Why Swagatom?</Link></li>
              <li><Link to="/testimonials" className="hover:underline">Testimonials</Link></li>
              <li><Link to="/careers" className="hover:underline">Careers</Link></li>
              <li><Link to="/partners" className="hover:underline">Partners</Link></li>
              <li><Link to="/faqs" className="hover:underline">FAQs</Link></li>
            </ul>
          </div>

          {/* Newsletter & App */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Stay in the loop</h3>
            <p className="text-sm mb-3">Get updates on new courses and events.</p>
            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button type="submit" className="bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 text-sm">
                Subscribe
              </button>
            </form>

            <div className="mt-6">
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Get our app</h4>
              <div className="flex gap-2">
                <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" className="h-10" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/512px-Google_Play_Store_badge_EN.svg.png" alt="Google Play" className="h-10" />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 dark:border-gray-700 mt-10 pt-6 text-sm flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <BsEnvelope /> <span>support@swagatomworld.com</span>
          </div>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <BsGeoAlt /> <span>Chennai, Tamil Nadu, India</span>
          </div>
          <p className="mt-4 sm:mt-0">&copy; {new Date().getFullYear()} Swagatom World. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
