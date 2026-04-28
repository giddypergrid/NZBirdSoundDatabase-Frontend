import React from 'react';
import DefaultHeader from 'staticComponents/DefaultHeader';
import Footer from 'staticComponents/Footer';
import ClassifyUpload from 'components/ClassifyUpload';

const MatchSoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-forest-800 flex flex-col">
      <DefaultHeader />

      <main className="flex-1 py-16">
        <div className="max-w-xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-xs text-white/50 font-medium uppercase tracking-wider mb-2">Identify</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Match a bird by its sound
            </h1>
            <p className="text-white/40 max-w-md mx-auto">
              Upload a recording and we'll identify the most likely bird species. Click any result to explore that bird.
            </p>
          </div>

          <ClassifyUpload />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MatchSoundPage;
