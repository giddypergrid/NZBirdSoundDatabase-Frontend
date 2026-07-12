import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { BirdSoundFilterParams } from 'types/bird';

type Props = {
  onFilterChange: (filters: BirdSoundFilterParams) => void;
  stations: string[];
  recordingModes: string[];
};

const AudioFilters: React.FC<Props> = ({ onFilterChange, stations, recordingModes }) => {
  const [showStation, setShowStation] = useState(false);
  const [station, setStation] = useState('');
  const [activeMode, setActiveMode] = useState('');

  const fireFilters = (mode: string, st: string) => {
    const filters: BirdSoundFilterParams = {};
    if (mode) filters.recording_mode = mode;
    if (st) filters.station = st;
    onFilterChange(filters);
  };

  const handleModeClick = (mode: string) => {
    const next = activeMode === mode ? '' : mode;
    setActiveMode(next);
    fireFilters(next, station);
  };

  const handleStationChange = (value: string) => {
    setStation(value);
    fireFilters(activeMode, value);
  };

  const clearAll = () => {
    setActiveMode('');
    setStation('');
    setShowStation(false);
    onFilterChange({});
  };

  const hasActiveFilters = !!station || !!activeMode;

  return (
    stations.length > 0 && recordingModes.length > 0 && (
    <div className="border-b border-hair">
      {/* Recording mode tabs */}
      <div className="flex items-center gap-1 px-5 py-3 overflow-x-auto scrollbar-thin">
        {recordingModes.map((mode) => (
          <button
            key={mode}
            onClick={() => handleModeClick(mode)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeMode === mode
                ? 'bg-brand text-white border border-brand'
                : 'text-subtle hover:text-ink hover:bg-card-2'
            }`}
          >
            {mode}
          </button>
        ))}

        {/* Station toggle */}
        {stations.length > 0 && (
          <button
            onClick={() => setShowStation(!showStation)}
            className={`ml-auto px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              station ? 'text-ink' : 'text-subtle hover:text-ink'
            }`}
          >
            <Filter className="w-3 h-3" />
            Station
            {station && <span className="w-1.5 h-1.5 rounded-full bg-brand" />}
          </button>
        )}

        {/* Clear all */}
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="px-2.5 py-1.5 rounded-full text-xs font-medium text-subtle hover:text-ink transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* Station dropdown */}
      {showStation && stations.length > 0 && (
        <div className="px-5 pb-3">
          <select
            value={station}
            onChange={(e) => handleStationChange(e.target.value)}
            className="w-full max-w-xs bg-card border border-hair-strong rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
          >
            <option value="" className="bg-card text-ink">All stations</option>
            {stations.map((s) => (
              <option key={s} value={s} className="bg-card text-ink">{s}</option>
            ))}
          </select>
        </div>
      )}
    </div>
    )
  );
};

export default AudioFilters;
