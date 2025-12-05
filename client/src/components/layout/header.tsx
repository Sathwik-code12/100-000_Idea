// import { Menu, User, LogOut, Bookmark, Lightbulb as IdeaIcon, Settings, ChevronDown } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";
// import { Link, useLocation } from "wouter";
// import { useAuth } from "@/hooks/use-auth";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger
// } from "@/components/ui/dropdown-menu";

// export default function Header() {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [location] = useLocation();
//   const { user, logoutMutation } = useAuth();

//   const handleLogout = async () => {
//     try {
//       await logoutMutation.mutateAsync();
//     } catch (error) {
//       // Error handling is done in the mutation
//     }
//   };

//   return (
//     <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
//       <nav className="bg-white">
//         <div className="container mx-auto px-6">
//           <div className="flex justify-between items-center h-16">
//             {/* Logo */}
//             <Link href="/" className="flex items-center">
//               <span className="text-2xl font-bold text-yellow-500" style={{ fontFamily: 'serif' }}>10000</span>
//               <span className="text-2xl font-light text-yellow-500 ml-0.5" style={{ fontFamily: 'serif' }}>IDEAS</span>
//             </Link>

//             {/* Navigation */}
            

//             {/* Right Side Actions */}
//             <div className="flex items-center space-x-4">
//               <div className="hidden lg:flex items-end space-x-8">
//               <Link href="/all-ideas" className="text-gray-800 hover:text-gray-600 text-base font-semibold transition-colors">
//                 Ideas
//               </Link>
//               <Link href="/about" className="text-gray-800 hover:text-gray-600 text-base font-semibold transition-colors">
//                 About
//               </Link>
//               <Link href="/admin" className="text-gray-800 hover:text-gray-600 text-base font-semibold transition-colors">
//                 Admin Panel
//               </Link>
//             </div>
//               {user ? (
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-50 px-3 py-2">
//                       <User className="h-5 w-5 text-gray-600" />
//                       <div className="hidden sm:flex flex-col items-start">
//                         <span className="text-sm font-semibold text-gray-800">{user.name}</span>
//                         <span className="text-xs text-gray-500">View Profile</span>
//                       </div>
//                       <ChevronDown className="h-4 w-4 text-gray-600" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end" className="w-56">
//                     <DropdownMenuItem className="cursor-default hover:bg-transparent">
//                       <div className="flex flex-col py-2">
//                         <span className="font-semibold text-gray-800">{user.name}</span>
//                         <span className="text-sm text-gray-500">{user.email}</span>
//                       </div>
//                     </DropdownMenuItem>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem asChild>
//                       <Link href="/dashboard" className="cursor-pointer flex w-full items-center py-2">
//                         <User className="h-4 w-4 mr-3 text-gray-600" />
//                         <span className="text-sm">My Profile</span>
//                       </Link>
//                     </DropdownMenuItem>
//                     <DropdownMenuItem asChild>
//                       <Link href="/submit-idea" className="cursor-pointer flex w-full items-center py-2">
//                         <IdeaIcon className="h-4 w-4 mr-3 text-yellow-500" />
//                         <span className="text-sm">Your Ideas</span>
//                       </Link>
//                     </DropdownMenuItem>
//                     <DropdownMenuItem asChild>
//                       <Link href="/all-ideas?saved=true" className="cursor-pointer flex w-full items-center py-2">
//                         <Bookmark className="h-4 w-4 mr-3 text-gray-600" />
//                         <span className="text-sm">My Saved Ideas</span>
//                       </Link>
//                     </DropdownMenuItem>
//                     <DropdownMenuItem asChild>
//                       <Link href="#" className="cursor-pointer flex w-full items-center py-2">
//                         <Settings className="h-4 w-4 mr-3 text-gray-600" />
//                         <span className="text-sm">Settings</span>
//                       </Link>
//                     </DropdownMenuItem>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem onClick={handleLogout} className="cursor-pointer py-2">
//                       <LogOut className="h-4 w-4 mr-3 text-red-500" />
//                       <span className="text-sm text-red-500">Logout</span>
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               ) : (
//                 <Link href="/auth">
//                   <Button className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-6 py-2 rounded-md text-sm font-bold transition-all duration-200">
//                     Get Started
//                   </Button>
//                 </Link>
//               )}

//               <button
//                 className="lg:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-all duration-200"
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               >
//                 <Menu className="h-5 w-5" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         {isMobileMenuOpen && (
//           <div className="lg:hidden border-t border-gray-200 py-4">
//             <div className="container mx-auto px-4">
//               <nav className="flex flex-col space-y-2">
//                 <Link href="/all-ideas" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">Ideas</Link>
//                 <Link href="/about" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">About</Link>
//                 <Link href="/admin" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">Admin Panel</Link>

//                 {user ? (
//                   <>
//                     <div className="px-3 py-2 text-sm text-gray-500 border-t border-gray-200 mt-2 pt-4">
//                       <div className="font-semibold text-gray-800">{user.name}</div>
//                       <div className="text-xs text-gray-500">{user.email}</div>
//                     </div>
//                     <Link href="/dashboard" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">My Profile</Link>
//                     <Link href="/my-ideas" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">Your Ideas</Link>
//                     <Link href="/all-ideas?saved=true" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">My Saved Ideas</Link>
//                     <Link href="/settings" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">Settings</Link>
//                     <button
//                       onClick={handleLogout}
//                       className="text-red-500 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors text-left"
//                     >
//                       Logout
//                     </button>
//                   </>
//                 ) : (
//                   <Link href="/auth" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">Get Started</Link>
//                 )}
//               </nav>
//             </div>
//           </div>
//         )}
//       </nav>
//     </header>
//   );
// }



import { Search, Menu, Lightbulb, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  return (
    <header className="bg-yellow-400 shadow-lg sticky top-0 z-50">
      <nav className="bg-yellow-400 border-b border-yellow-300">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Lightbulb className="text-gray-800 text-sm h-4 w-4" />
              </div>
              <span className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                10000Ideas
              </span>
            </Link>
            
            {/* Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/" className={`relative text-base font-bold transition-all duration-200 ${location === '/' ? 'text-gray-900' : 'text-gray-800 hover:text-gray-900'}`}>
                Home
                {location === '/' && <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-900 rounded-full"></div>}
              </Link>
              <Link href="/all-ideas" className={`relative text-base font-bold transition-all duration-200 ${location === '/all-ideas' ? 'text-gray-900' : 'text-gray-800 hover:text-gray-900'}`}>
                All Ideas
                {location === '/all-ideas' && <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-900 rounded-full"></div>}
              </Link>
              <Link href="/submit-idea" className={`relative text-base font-bold transition-all duration-200 ${location === '/submit-idea' ? 'text-gray-900' : 'text-gray-800 hover:text-gray-900'}`}>
                Submit an Idea
                {location === '/submit-idea' && <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-900 rounded-full"></div>}
              </Link>

              <Link href="/fundraising" className={`relative text-base font-bold transition-all duration-200 ${location === '/fundraising' ? 'text-gray-900' : 'text-gray-800 hover:text-gray-900'}`}>
                Fundraising
                {location === '/fundraising' && <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-900 rounded-full"></div>}
              </Link>
              <Link href="/advisory" className={`relative text-base font-bold transition-all duration-200 ${location === '/advisory' ? 'text-gray-900' : 'text-gray-800 hover:text-gray-900'}`}>
                Advisory
                {location === '/advisory' && <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-900 rounded-full"></div>}
              </Link>
              <Link href="/blog" className={`relative text-base font-bold transition-all duration-200 ${location === '/blog' ? 'text-gray-900' : 'text-gray-800 hover:text-gray-900'}`}>
                Blog
                {location === '/blog' && <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-900 rounded-full"></div>}
              </Link>
              <Link href="/about" className={`relative text-base font-bold transition-all duration-200 ${location === '/about' ? 'text-gray-900' : 'text-gray-800 hover:text-gray-900'}`}>
                About Us
                {location === '/about' && <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-900 rounded-full"></div>}
              </Link>
            </div>
            
            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-700 hover:text-blue-600 hover:bg-yellow-300 rounded-full transition-all duration-200">
                <Search className="text-sm h-4 w-4" />
              </button>
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 hover:bg-yellow-300">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="cursor-default">
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-sm text-gray-500">{user.email}</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer flex w-full">
                        <User className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/auth">
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
                    Sign In/Sign Up
                  </Button>
                </Link>
              )}
              
              <button 
                className="lg:hidden p-2 text-gray-700 hover:text-blue-600 hover:bg-yellow-300 rounded-lg transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-yellow-300 bg-yellow-400 py-4">
            <div className="container mx-auto px-4">
              <nav className="flex flex-col space-y-2">
                <Link href="/" className="text-gray-800 hover:text-blue-700 px-3 py-2 text-sm font-medium transition-colors">Home</Link>
                <Link href="/all-ideas" className="text-gray-800 hover:text-blue-700 px-3 py-2 text-sm font-medium transition-colors">All Ideas</Link>
                <Link href="/submit-idea" className="text-gray-800 hover:text-blue-700 px-3 py-2 text-sm font-medium transition-colors">Submit an Idea</Link>
                <Link href="/fundraising" className="text-gray-800 hover:text-blue-700 px-3 py-2 text-sm font-medium transition-colors">Fundraising</Link>
                <Link href="/advisory" className="text-gray-800 hover:text-blue-700 px-3 py-2 text-sm font-medium transition-colors">Advisory</Link>
                <Link href="/blog" className="text-gray-800 hover:text-blue-700 px-3 py-2 text-sm font-medium transition-colors">Blog</Link>
                <Link href="/about" className="text-gray-800 hover:text-blue-700 px-3 py-2 text-sm font-medium transition-colors">About Us</Link>
                
                {user ? (
                  <>
                    <div className="px-3 py-2 text-sm text-gray-700 border-t border-yellow-300 mt-2 pt-4">
                      <div className="font-medium text-gray-800">{user.name}</div>
                      <div className="text-xs">{user.email}</div>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="text-gray-800 hover:text-blue-700 px-3 py-2 text-sm font-medium transition-colors text-left"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link href="/auth" className="text-gray-800 hover:text-blue-700 px-3 py-2 text-sm font-medium transition-colors">Sign In/Sign Up</Link>
                )}
              </nav>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
