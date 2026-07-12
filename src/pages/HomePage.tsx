import React from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import SearchBar from "components/SearchBar";
import DefaultHeader from "staticComponents/DefaultHeader";
import Footer from "staticComponents/Footer";
import { Bird } from "types/bird";
import BirdCard from "components/BirdCard";
import { DEFAULT_BIRD_BATCH_SIZE } from "settings";
import InfiniteScrollArea from "components/InfiniteScrollArea";
import { useBirdSearch } from "helpers/useBirdSearch";
import HeroSection from "components/HeroSection";
import loadingBirdAnimation from "assets/LoadingBird.json";
import { useBirdList } from "hooks/useQueries";

const HomePage: React.FC = () => {
  const { data: allBirds = [] } = useBirdList();
  const {
    filteredBirds,
    handleSearch,
    activeMode,
    isSearching,
    searchError,
    validationError,
    searchQuery,
  } = useBirdSearch(allBirds);
  const navigate = useNavigate();

  const handleBirdClick = (bird: Bird) => {
    navigate(`/bird/${encodeURIComponent(bird.eBird)}`);
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <DefaultHeader />

      {/* Hero Section */}
      <HeroSection birds={allBirds} />

      {/* Search + Browse — one seamless section */}
      <section id="search-section" className="w-full max-w-6xl mx-auto px-6 py-12">
        {/* Search */}
        <div className="max-w-4xl">
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-subtle mb-2.5">Search</p>
          <h2 className="text-2xl md:text-3xl font-bold text-ink">
            Find bird sounds in our database
          </h2>
          <p className="text-sm text-subtle mt-2 mb-6">
            Search by name, or describe the bird and we'll rank the closest matches.
          </p>
          <SearchBar onSearch={handleSearch} allBirds={allBirds} />
          {validationError && (
            <div className="mt-4 max-w-2xl bg-yellow-100 border border-yellow-300 rounded-lg px-4 py-3">
              <p className="text-yellow-800 text-sm">{validationError}</p>
            </div>
          )}
          {searchError && (
            <div className="mt-4 max-w-2xl bg-red-100 border border-red-300 rounded-lg px-4 py-3">
              <p className="text-red-700 text-sm">{searchError}</p>
            </div>
          )}
        </div>

        {/* Results grid — flows directly from search, no seam */}
        <div id="database-section" className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm font-medium text-ink">
              {isSearching
                ? 'Searching…'
                : filteredBirds.length === allBirds.length
                  ? `Browse all ${allBirds.length} birds`
                  : activeMode === 'description'
                    ? `Top ${filteredBirds.length} matches`
                    : `${filteredBirds.length} birds found`}
            </p>
            {filteredBirds.length !== allBirds.length && (
              <button
                onClick={() => handleSearch('', 'name')}
                className="text-sm text-subtle hover:text-ink transition-colors"
              >
                View all
              </button>
            )}
          </div>

          {isSearching ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Lottie animationData={loadingBirdAnimation} className="w-32 h-32" />
              <p className="text-subtle mt-4">Searching...</p>
            </div>
          ) : (
            <InfiniteScrollArea<Bird, 'eBird'>
              ItemComponent={BirdCard}
              BatchSize={DEFAULT_BIRD_BATCH_SIZE}
              ItemIndexType="eBird"
              items={filteredBirds}
              className="w-full"
              listClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              onItemClick={handleBirdClick}
            />
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
