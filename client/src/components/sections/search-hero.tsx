import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export default function SearchHero() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", { searchTerm, selectedCategory, selectedLocation });
  };

  return (
    <section className="bg-blue-600 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 lg:gap-4 items-stretch sm:items-center">
          {/* Search Input */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search ideas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2.5 text-sm lg:text-base border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full"
            />
          </div>
          
          {/* Category Select */}
          <div className="w-full sm:w-48 lg:w-64">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="py-2.5 text-sm lg:text-base border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="food-beverage">Food & Beverage</SelectItem>
                <SelectItem value="agriculture">Agriculture</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="ecommerce">E-commerce</SelectItem>
                <SelectItem value="services">Services</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="education">Education</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Location Select */}
          <div className="w-full sm:w-48 lg:w-64">
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="py-2.5 text-sm lg:text-base border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="united-states">United States</SelectItem>
                <SelectItem value="canada">Canada</SelectItem>
                <SelectItem value="united-kingdom">United Kingdom</SelectItem>
                <SelectItem value="germany">Germany</SelectItem>
                <SelectItem value="france">France</SelectItem>
                <SelectItem value="australia">Australia</SelectItem>
                <SelectItem value="india">India</SelectItem>
                <SelectItem value="singapore">Singapore</SelectItem>
                <SelectItem value="global">Global/Remote</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Search Button */}
          <Button 
            type="submit" 
            className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-6 lg:px-8 py-2.5 text-sm lg:text-base rounded-lg transition-colors"
          >
            Search
          </Button>
        </form>
      </div>
    </section>
  );
}