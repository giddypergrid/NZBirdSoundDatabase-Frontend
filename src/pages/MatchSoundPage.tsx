import React, { useState } from 'react';
import DefaultHeader from 'staticComponents/DefaultHeader';
import Footer from 'staticComponents/Footer';
import ClassifyUpload from 'components/ClassifyUpload';
import { useBirdList } from 'hooks/useQueries';

const EXCLUDED_CODES = new Set([
  'x00458', 'tomtit1', 'nezbel1', 'oyster1', 'eurbla', 'ausbit1', 'silver3', 'nezfan1',
]);

const MatchSoundPage: React.FC = () => {
  const [showBirds, setShowBirds] = useState(false);
  const { data: allBirds = [] } = useBirdList();
  const classifiedBirds = allBirds.filter(b => !EXCLUDED_CODES.has(b.eBird));

  return (
    <div className="min-h-screen bg-forest-800 flex flex-col">
      <DefaultHeader />

      <main className="flex-1 py-16">
        <div className="max-w-xl mx-auto px-6">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Identify a bird by its sound
            </h1>
            <p className="text-white/40 max-w-md mx-auto inline">
              Capture audio or upload a file and we'll identify the most likely bird species.
            </p>
            {' '}
            <button
              onClick={() => setShowBirds(v => !v)}
              className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 text-white/50 hover:text-white text-xs font-bold transition-colors align-middle"
              aria-label="Show supported birds"
            >
              !
            </button>

            {showBirds && (
              <div className="mt-4 text-left max-w-md mx-auto bg-forest-700/50 border border-white/10 rounded-xl p-4">
                <p className="text-xs text-white/50 mb-3 leading-relaxed">
                  We can identify these {classifiedBirds.length} birds. Some birds have been
                  excluded due to insufficient or unevenly distributed audio samples in our database.
                </p>
                <ul className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {classifiedBirds.map(b => (
                    <li key={b.eBird} className="text-xs text-white/40">
                      {b.common_name} <span className="text-white/20">({b.eBird})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <ClassifyUpload />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MatchSoundPage;
