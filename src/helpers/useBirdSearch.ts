import { useState, useEffect, useMemo } from 'react';
import { Bird } from 'types/bird';

export const useBirdSearch = (allBirds: Bird[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredBirds =useMemo(() => {
    if (!searchQuery) {
      return allBirds;
    } else {
      return allBirds.filter(b => b.common_name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
  }, [searchQuery, allBirds]);
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log("Search query:", query);
  };
  return {filteredBirds, handleSearch}
}
