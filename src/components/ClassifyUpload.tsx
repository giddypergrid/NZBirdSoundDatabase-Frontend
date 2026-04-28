import React, { useState, useRef } from "react";
import { Upload, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import { classifyApi } from "services/api";
import { ClassifyResponse, ClassifyPrediction } from "types/bird";
import loadingBirdAnimation from "assets/LoadingBird.json";

const ALLOWED_EXTENSIONS = [".wav", ".flac", ".mp3", ".ogg", ".m4a"];

const ClassifyUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClassifyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const ext = "." + selected.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setError(`Unsupported file type. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`);
      setFile(null);
      return;
    }

    setFile(selected);
    setError(null);
    setResult(null);
  };

  const handleClassify = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await classifyApi.classify(file);
      setResult(response.data);
    } catch (err: any) {
      const msg =
        err.response?.data?.error || err.message || "Classification failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      const ext = "." + dropped.name.split(".").pop()?.toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        setError(`Unsupported file type. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`);
        return;
      }
      setFile(dropped);
      setError(null);
      setResult(null);
    }
  };

  const goToBird = (eBird: string) => {
    navigate(`/bird/${encodeURIComponent(eBird)}`);
  };

  const renderPredictionCard = (pred: ClassifyPrediction, rank: number) => (
    <button
      key={pred.eBird}
      onClick={() => goToBird(pred.eBird)}
      className="w-full flex items-center gap-4 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all text-left group"
    >
      <span className="text-xs text-white/30 font-mono w-5 shrink-0">{rank}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{pred.eBird}</p>
        <p className="text-xs text-white/40">{(pred.confidence * 100).toFixed(1)}% confidence</p>
      </div>
      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
    </button>
  );

  return (
    <div>
      {/* Drop zone */}
      <div
        className="border-2 border-dashed border-white/20 rounded-xl p-10 text-center cursor-pointer hover:border-white/40 transition-colors bg-white/5"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_EXTENSIONS.join(",")}
          onChange={handleFileChange}
          className="hidden"
        />
        <Upload className="w-10 h-10 text-white/30 mx-auto mb-3" />
        {file ? (
          <p className="text-sm text-white font-medium">{file.name}</p>
        ) : (
          <p className="text-sm text-white/50">
            Drop an audio file here or click to browse
          </p>
        )}
        <p className="text-xs text-white/30 mt-2">
          WAV, FLAC, MP3, OGG, M4A
        </p>
      </div>

      {/* Classify button */}
      {loading ? (
        <div className="mt-6 flex flex-col items-center gap-2">
          <Lottie animationData={loadingBirdAnimation} loop style={{ width: 120, height: 120 }} />
          <p className="text-sm text-white/50">Matching...</p>
        </div>
      ) : (
        <button
          onClick={handleClassify}
          disabled={!file}
          className="mt-4 w-full py-3 px-4 rounded-xl text-sm font-semibold transition-colors
            bg-white text-forest-900 hover:bg-white/90
            disabled:bg-white/10 disabled:text-white/30 disabled:cursor-not-allowed"
        >
          Match
        </button>
      )}

      {/* Error */}
      {error && (
        <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Results as cards */}
      {result && (
        <div className="mt-6">
          <p className="text-xs text-white/40 font-medium uppercase tracking-wider mb-3">
            Predictions — click to view bird
          </p>
          <div className="space-y-2">
            {result.top_predictions && result.top_predictions.length > 0
              ? result.top_predictions.map((pred, i) => renderPredictionCard(pred, i + 1))
              : renderPredictionCard({ eBird: result.eBird, confidence: result.confidence }, 1)
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassifyUpload;
