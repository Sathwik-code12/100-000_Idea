// import { Lightbulb } from "lucide-react";

// export default function NewFooter() {
//   return (
//     <footer className="bg-gray-50 py-6">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           {/* Logo and Social */}
//           <div className="md:col-span-1">
//             <div className="flex items-center space-x-3 mb-4">
//               <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
//                 <Lightbulb className="text-gray-800 h-4 w-4" />
//               </div>
//               <span className="text-xl font-bold text-gray-800">10000IDEAS</span>
//             </div>
//             <p className="text-gray-600 text-sm mb-4">Follow us on social media</p>
//             <div className="flex space-x-3">
//               <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
//                 <span className="text-white text-xs font-bold">f</span>
//               </div>
//               <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
//                 <span className="text-white text-xs font-bold">t</span>
//               </div>
//               <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
//                 <span className="text-white text-xs font-bold">y</span>
//               </div>
//               <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
//                 <span className="text-white text-xs font-bold">x</span>
//               </div>
//               <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
//                 <span className="text-white text-xs font-bold">p</span>
//               </div>
//             </div>
//           </div>

//           {/* Categories */}
//           <div>
//             <h3 className="font-semibold text-gray-900 mb-4">CATEGORIES</h3>
//             <ul className="space-y-2 text-sm text-gray-600">
//               <li><a href="#" className="hover:text-blue-600">Technology</a></li>
//               <li><a href="#" className="hover:text-blue-600">Manufacturing</a></li>
//               <li><a href="#" className="hover:text-blue-600">For Women</a></li>
//               <li><a href="#" className="hover:text-blue-600">Fashion</a></li>
//               <li><a href="#" className="hover:text-blue-600">E-commerce</a></li>
//             </ul>
//           </div>

//           {/* About */}
//           <div>
//             <h3 className="font-semibold text-gray-900 mb-4">ABOUT</h3>
//             <ul className="space-y-2 text-sm text-gray-600">
//               <li><a href="/about" className="hover:text-blue-600">Our Company</a></li>
//               <li><a href="#" className="hover:text-blue-600">Who We Are</a></li>
//               <li><a href="#" className="hover:text-blue-600">FAQ</a></li>
//               <li><a href="#" className="hover:text-blue-600">The Journal</a></li>
//               <li><a href="#" className="hover:text-blue-600">Reviews</a></li>
//               <li><a href="/contact" className="hover:text-blue-600">Contact</a></li>
//             </ul>
//           </div>

//           {/* More */}
//           <div>
//             <h3 className="font-semibold text-gray-900 mb-4">MORE</h3>
//             <ul className="space-y-2 text-sm text-gray-600">
//               <li><a href="#" className="hover:text-blue-600">Terms of Service</a></li>
//               <li><a href="#" className="hover:text-blue-600">Privacy Policy</a></li>
//               <li><a href="/contact" className="hover:text-blue-600">Contact Us</a></li>
//               <li><a href="#" className="hover:text-blue-600">Careers</a></li>
//               <li><a href="#" className="hover:text-blue-600">News</a></li>
//             </ul>
//           </div>
//         </div>

//         {/* Disclaimer */}
//         <div className="mt-6 pt-4 border-t border-gray-200">
//           <p className="text-xs text-gray-500 leading-relaxed">
//             <strong>DISCLAIMER:</strong> 10000Ideas is only an intermediary offering its exchange of ideas...offers a platform to advertise products of seller for a subscriber (please seeked User concerning on its website and is not and cannot be a party to or any way be control or any dealing with transactions between the seller and the subscriber/purchaser...At this information...offers, subsidies, funding options, execution process on this website have been extended by various other holders of the respective intellectual property rights or their content of ideas does not and does not shall and any of them...that when these businesses involve any deposits or disqualifications between the subscriber/buyer/owner and the seller and any or all of both sellers or/and subscriber/ shall swear the such deposits amount involving 10000 ideas or its parent companies in any manner any disclosure to disqualifications between the subscriber/buyer and the seller and both sellers and subscriber document shall swear the such deposits amount involving 10000 ideas or its parent companies...
//           </p>
//           <div className="mt-4 text-center">
//             <p className="text-sm text-gray-600">© 2025 All rights reserved</p>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }

import { Facebook, Twitter, Youtube, Instagram, Linkedin } from "lucide-react";

export default function NewFooter() {
  return (
    
    <footer className="bg-slate-700 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and Social */}
          <div className="md:col-span-1 me-4">
            <div className=" items-center space-x-2 mb-6">
              <div className="text-4xl font-bold text-white">10000</div>
              {/* <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center"> */}
                {/* <div className="w-3 h-3 bg-slate-700 rounded-full"></div> */}
              {/* </div> */}
            </div>
            <p className="text-gray-400 text-sm mb-6">Follow us on social media</p>
            <div className="flex space-x-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-md flex items-center justify-center hover:bg-yellow-600 transition-colors cursor-pointer">
                <Facebook className="text-slate-700 h-5 w-5" />
              </div>
              <div className="w-10 h-10 bg-yellow-500 rounded-md flex items-center justify-center hover:bg-yellow-600 transition-colors cursor-pointer">
                <Twitter className="text-slate-700 h-5 w-5" />
              </div>
              <div className="w-10 h-10 bg-yellow-500 rounded-md flex items-center justify-center hover:bg-yellow-600 transition-colors cursor-pointer">
                <Youtube className="text-slate-700 h-5 w-5" />
              </div>
              <div className="w-10 h-10 bg-yellow-500 rounded-md flex items-center justify-center hover:bg-yellow-600 transition-colors cursor-pointer">
                <Instagram className="text-slate-700 h-5 w-5" />
              </div>
              <div className="w-10 h-10 bg-yellow-500 rounded-md flex items-center justify-center hover:bg-yellow-600 transition-colors cursor-pointer">
                <Linkedin className="text-slate-700 h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-white mb-6 text-sm tracking-wider">CATEGORIES</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="/all-ideas" className="hover:text-white transition-colors">All Categories</a></li>
              <li><a href="/all-ideas?category=Technology" className="hover:text-white transition-colors">Technology</a></li>
              <li><a href="/all-ideas?category=Manufacturing" className="hover:text-white transition-colors">Manufacturing</a></li>
              <li><a href="/all-ideas?category=For Women" className="hover:text-white transition-colors">For Women</a></li>
              <li><a href="/all-ideas?category=Fashion" className="hover:text-white transition-colors">Fashion</a></li>
              <li><a href="/all-ideas?category=E-commerce" className="hover:text-white transition-colors">E-commerce</a></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold text-white mb-6 text-sm tracking-wider">ABOUT</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="/about" className="hover:text-white transition-colors">Our Company</a></li>
              <li><a href="" className="hover:text-white transition-colors">Who We Are</a></li>
              <li><a href="" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="" className="hover:text-white transition-colors">The Journal</a></li>
              <li><a href="" className="hover:text-white transition-colors">Reviews</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* More */}
          <div>
            <h3 className="font-semibold text-white mb-6 text-sm tracking-wider">MORE</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">News</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 mb-8 border-t border-yellow-300 opacity-50"></div>

        {/* Disclaimer */}
        <div className="bg-yellow-300 bg-opacity-20 border border-yellow-300 rounded-lg p-6 mb-8">
          <p className="text-xs text-gray-300 leading-relaxed ">
            <strong className="text-gray-100">DISCLAIMER:</strong><br /><br /> 10000Ideas is only an intermediary offering its exchange of ideas...offers a platform to advertise products of seller for a subscriber (please seeked User concerning on its website and is not and cannot be a party to or any way be control or any dealing with transactions between the seller and the subscriber/purchaser...At this information...offers, subsidies, funding options, execution process on this website have been extended by various other holders of the respective intellectual property rights or their content of ideas does not and does not shall and any of them...that when these businesses involve any deposits or disqualifications between the subscriber/buyer/owner and the seller and any or all of both sellers or/and subscriber/ shall swear the such deposits amount involving 10000 ideas or its parent companies in any manner any disclosure to disqualifications between the subscriber/buyer and the seller and both sellers and subscriber document shall swear the such deposits amount involving 10000 ideas or its parent companies...
          </p>
        </div>
        <div className="mt-12 mb-8 border-t border-yellow-300 opacity-50"></div>
        {/* Copyright */}
        <div className="text-center">
          <p className="text-sm text-gray-400">© 2025 All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}