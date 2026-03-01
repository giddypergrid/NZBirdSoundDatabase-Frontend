import React, { useEffect, useCallback, useState } from "react";
import SearchBar from "components/SearchBar";
import DefaultHeader from "staticComponents/DefaultHeader";
import { Bird } from "types/bird";
import BirdCard from "components/BirdCard";
import { fetchAllBirds, fetchBirdImage } from "helpers/ApiHelper";
import { DEFAULT_BIRD_BATCH_SIZE } from "settings";
import InfiniteScrollArea from "components/InfiniteScrollArea";
import { useBirdSearch } from "helpers/useBirdSearch";
import BirdAudio from "components/BirdAudioSection";

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allBirds, setAllBirds] = useState<Bird[]>([]);
  const {filteredBirds, handleSearch} = useBirdSearch(allBirds);
  const [audioShownBird, setAudioShownBird] = useState<Bird | null>(null);

  useEffect(() => {
    const loadBirds = async () => {
      const birds = await fetchAllBirds();
      setAllBirds(birds);
    };
    loadBirds();
  }, []);

  return (
    <div className="relative min-h-screen">
      <DefaultHeader />
      <section className="absolute top-24 inset-x-0 z-20 px-4">
        <SearchBar onSearch={handleSearch} allBirds={allBirds} />
      </section>

      <div className="flex w-full gap-2">
        {/* Left Select Area */}
        <section className = "p-3 flex-[1]">
          <InfiniteScrollArea<Bird, 'eBird'>
            ItemComponent={BirdCard}
            BatchSize={DEFAULT_BIRD_BATCH_SIZE}
            ItemIndexType="eBird"
            items={filteredBirds}
            className="w-full h-[calc(100vh-200px)] overflow-y-auto scroll-bar-thin"
            onItemClick={(bird:Bird) => setAudioShownBird(bird)}
          />
        </section>

        {/* Right Audio Area */}
        {audioShownBird && (
          <section className="p-3 flex-[1]">
            <BirdAudio bird={audioShownBird}/>
          </section>
        )}
      </div>
    </div>
  );
};

export default HomePage;
