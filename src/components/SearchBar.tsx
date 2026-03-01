import React, { useState, useEffect, useRef } from "react";
import { Bird } from "types/bird";

interface SearchBarProps {
  onSearch: (query: string) => void;
  allBirds: Bird[];
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, allBirds, placeholder = "Search birds..." }) => {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
    setShowDropdown(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowDropdown(true);
  };

  const handleOptionClick = (birdName: string) => {
    setQuery(birdName);
    onSearch(birdName);
    setShowDropdown(false);
  };

  const hintBirds = allBirds.filter((bird) => bird.common_name.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
  }, [hintBirds]);

  useEffect(() => {
    const handleDropDownClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)){
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleDropDownClickOutside);
    return () => document.removeEventListener("mousedown", handleDropDownClickOutside)
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto min-w-[320px]" ref={containerRef}>
      <form className="w-full" onSubmit={handleSubmit}>
        <div className="relative w-full">
            <input
                className="w-full border p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 pr-12"
                value={query}
                onChange={handleChange}
                onFocus={() => setShowDropdown(true)}
                placeholder={placeholder}
                autoComplete="off"
            />
            <button 
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors z-10 cursor-pointer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </button>
        </div>
        {showDropdown && (
            <ul className="w-full bg-white border border-gray-200 shadow-2xl max-h-60 overflow-y-auto">
                {hintBirds.map((bird) => (
                    <li 
                        key={bird.eBird} 
                        onClick={() => handleOptionClick(bird.common_name)}
                        className="p-3 cursor-pointer transition-colors hover:bg-gray-100 first:rounded-t-xl last:rounded-b-xl"
                    >
                        {bird.common_name}
                    </li>
                ))}
            </ul>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
