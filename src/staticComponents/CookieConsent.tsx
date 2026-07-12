import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'cookieConsent';

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted');
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="max-w-3xl mx-auto bg-card border border-hair rounded-xl shadow-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 text-sm text-subtle">
          <p className="text-ink font-semibold mb-1">We value your privacy</p>
          <p>
            This site uses a single piece of local browser storage to remember
            that you've seen this notice. No tracking or advertising cookies
            are used. See our{' '}
            <Link
              to="/legal#cookies"
              className="text-brand underline hover:text-brand-600"
            >
              cookie settings
            </Link>
            .
          </p>
        </div>
        <button
          onClick={accept}
          className="shrink-0 px-5 py-2 rounded-md bg-brand text-white font-medium hover:bg-brand-600 transition-colors"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
