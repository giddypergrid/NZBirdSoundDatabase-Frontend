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
    <div className="min-h-screen bg-paper flex flex-col">
      <DefaultHeader />

      <main className="flex-1 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-ink mb-4">
              Identify a bird by its sound
            </h1>
            <p className="text-subtle max-w-md mx-auto inline">
              Capture audio or upload a file to identify the species.
            </p>
            {' '}
            <span className="relative inline-block align-middle">
              <button
                onClick={() => setShowBirds(v => !v)}
                className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gold-tint hover:bg-gold/20 text-gold text-xs font-bold transition-colors"
                aria-label="Show supported birds"
              >
                !
              </button>

              {showBirds && (
                <div className="absolute left-1/2 -translate-x-1/2 top-7 z-50 w-72 text-left bg-card border border-hair rounded-xl p-4 shadow-xl">
                  <p className="text-xs text-subtle mb-3 leading-relaxed">
                    We can only match these birds below because some species lack sufficient
                    or consistent audio data in our database.
                  </p>
                  <ul className="space-y-1 max-h-48 overflow-y-auto pr-1">
                    {classifiedBirds.map(b => (
                      <li key={b.eBird} className="text-xs text-ink/70">
                        {b.common_name} <span className="text-faint">({b.eBird})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </span>
          </div>

          <ClassifyUpload />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MatchSoundPage;
