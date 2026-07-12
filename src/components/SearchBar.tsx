import React, { useState, useEffect, useRef } from "react";
import { Search, FileText } from "lucide-react";
import { Bird } from "types/bird";
import AIBorder from "components/AIBorder";

type SearchMode = 'name' | 'description';

interface SearchBarProps {
  onSearch: (query: string, mode: SearchMode) => void;
  allBirds: Bird[];
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, allBirds, placeholder }) => {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [mode, setMode] = useState<SearchMode>('name');
  const containerRef = useRef<HTMLDivElement>(null);

  const placeholderText = placeholder || (mode === 'name' ? 'Search by bird name...' : 'Describe the bird you saw...');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, mode);
    setShowDropdown(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (mode === 'name') setShowDropdown(true);
  };

  const handleOptionClick = (birdName: string) => {
    setQuery(birdName);
    onSearch(birdName, 'name');
    setShowDropdown(false);
  };

  const hintBirds = mode === 'name'
    ? allBirds.filter((bird) => bird.common_name.toLowerCase().includes(query.toLowerCase()))
    : [];

  useEffect(() => {
    const handleDropDownClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleDropDownClickOutside);
    return () => document.removeEventListener("mousedown", handleDropDownClickOutside)
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto" ref={containerRef}>
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-5">
      {/* Mode tabs — left of the search field */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => { setMode('name'); setQuery(''); setShowDropdown(false); onSearch('', 'name'); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            mode === 'name'
              ? 'bg-brand text-white border border-brand'
              : 'text-subtle hover:text-ink border border-transparent'
          }`}
        >
          <Search className="w-3 h-3" />
          Search by name
        </button>
        <AIBorder showBadge={true} className="ml-1">
          <button
            type="button"
            onClick={() => { setMode('description'); setQuery(''); setShowDropdown(false); onSearch('', 'description'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              mode === 'description'
                ? 'bg-brand text-white border border-brand'
                : 'text-subtle hover:text-ink border border-transparent'
            }`}
          >
            <FileText className="w-3 h-3" />
            Search by description
          </button>
        </AIBorder>
      </div>

      {/* Search input — right of the mode tabs */}
      <form className="w-full md:flex-1 md:min-w-0" onSubmit={handleSubmit}>
        <div className="relative w-full flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-faint" />
            <input
              className="w-full bg-card border border-hair-strong pl-11 pr-4 py-3 rounded-xl text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all placeholder:text-faint"
              value={query}
              onChange={handleChange}
              onFocus={() => mode === 'name' && setShowDropdown(true)}
              placeholder={placeholderText}
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-brand hover:bg-brand-600 text-white font-semibold rounded-xl transition-colors text-sm shrink-0"
          >
            Search
          </button>
        </div>

        {/* Dropdown for name search */}
        {showDropdown && query.length > 0 && mode === 'name' && hintBirds.length > 0 && (
          <ul className="mt-1 w-full bg-card border border-hair rounded-xl shadow-lg max-h-60 overflow-y-auto scrollbar-thin">
            {hintBirds.slice(0, 10).map((bird) => (
              <li
                key={bird.eBird}
                onClick={() => handleOptionClick(bird.common_name)}
                className="px-4 py-2.5 cursor-pointer transition-colors hover:bg-card-2 text-sm text-ink border-b border-hair last:border-0"
              >
                <span className="font-medium text-ink">{bird.common_name}</span>
                <span className="text-faint ml-2 text-xs italic">{bird.scientific_name}</span>
              </li>
            ))}
          </ul>
        )}
      </form>
      </div>
    </div>
  );
};

export default SearchBar;
