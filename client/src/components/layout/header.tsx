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
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <nav className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Lightbulb className="text-gray-800 text-sm h-4 w-4" />
              </div>
              <span className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">10000Ideas</span>
            </Link>
            
            {/* Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/" className={`relative text-base font-bold transition-all duration-200 ${location === '/' ? 'text-gray-800' : 'text-gray-600 hover:text-gray-800'}`}>
                Home
                {location === '/' && <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-600 rounded-full"></div>}
              </Link>
              <Link href="/all-ideas" className={`relative text-base font-bold transition-all duration-200 ${location === '/all-ideas' ? 'text-gray-800' : 'text-gray-600 hover:text-gray-800'}`}>
                All Ideas
                {location === '/all-ideas' && <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-600 rounded-full"></div>}
              </Link>
              <Link href="/submit-idea" className={`relative text-base font-bold transition-all duration-200 ${location === '/submit-idea' ? 'text-gray-800' : 'text-gray-600 hover:text-gray-800'}`}>
                Submit an Idea
                {location === '/submit-idea' && <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-600 rounded-full"></div>}
              </Link>

              <Link href="/fundraising" className={`relative text-base font-bold transition-all duration-200 ${location === '/fundraising' ? 'text-gray-800' : 'text-gray-600 hover:text-gray-800'}`}>
                Fundraising
                {location === '/fundraising' && <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-600 rounded-full"></div>}
              </Link>
              <Link href="/advisory" className={`relative text-base font-bold transition-all duration-200 ${location === '/advisory' ? 'text-gray-800' : 'text-gray-600 hover:text-gray-800'}`}>
                Advisory
                {location === '/advisory' && <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-600 rounded-full"></div>}
              </Link>
              <Link href="/blog" className={`relative text-base font-bold transition-all duration-200 ${location === '/blog' ? 'text-gray-800' : 'text-gray-600 hover:text-gray-800'}`}>
                Blog
                {location === '/blog' && <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-600 rounded-full"></div>}
              </Link>
              <Link href="/about" className={`relative text-base font-bold transition-all duration-200 ${location === '/about' ? 'text-gray-800' : 'text-gray-600 hover:text-gray-800'}`}>
                About Us
                {location === '/about' && <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-600 rounded-full"></div>}
              </Link>
            </div>
            
            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200">
                <Search className="text-sm h-4 w-4" />
              </button>
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-100">
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
                className="lg:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="container mx-auto px-4">
              <nav className="flex flex-col space-y-2">
                <Link href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Home</Link>
                <Link href="/all-ideas" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">All Ideas</Link>
                <Link href="/submit-idea" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Submit an Idea</Link>
                <Link href="/fundraising" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Fundraising</Link>
                <Link href="/advisory" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Advisory</Link>
                <Link href="/blog" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Blog</Link>
                <Link href="/about" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">About Us</Link>
                
                {user ? (
                  <>
                    <div className="px-3 py-2 text-sm text-gray-500 border-t border-gray-200 mt-2 pt-4">
                      <div className="font-medium text-gray-700">{user.name}</div>
                      <div className="text-xs">{user.email}</div>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors text-left"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link href="/auth" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Sign In/Sign Up</Link>
                )}
              </nav>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
