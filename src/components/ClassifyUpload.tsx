import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Upload, Mic, MicOff, X, ChevronRight, AudioLines } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import SimpleAudioPlayer from "components/AudioPlayer";
import ImageNotFound from "components/ImageNotFound";
import { classifyApi } from "services/api";
import { ClassifyResponse, ClassifyPrediction, Bird } from "types/bird";
import { useBirdList, useBirdImage } from "hooks/useQueries";
import loadingBirdAnimation from "assets/LoadingBird.json";

const ALLOWED_EXTENSIONS = [".wav", ".flac", ".mp3", ".ogg", ".m4a"];
const MAX_SECS = 60;

function getBestMimeType(): string {
  for (const t of ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus", "audio/mp4"]) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t)) return t;
  }
  return "";
}

function mimeToExt(mime: string): string {
  if (mime.includes("webm")) return "webm";
  if (mime.includes("ogg")) return "ogg";
  if (mime.includes("mp4")) return "mp4";
  return "wav";
}

type MicState = "idle" | "requesting" | "recording" | "done" | "denied";

// thumbnail for a result — real image, grey fallback when missing
const ResultThumb: React.FC<{ bird: Bird }> = ({ bird }) => {
  const { data: imgUrl, isError } = useBirdImage(bird);
  const [failed, setFailed] = useState(false);
  if (isError || failed || !imgUrl) return <ImageNotFound />;
  return <img src={imgUrl} alt={bird.common_name} className="w-full h-full object-cover" onError={() => setFailed(true)} />;
};

// a single prediction rendered like a compact home card (picture + name + basic description)
const ResultCard: React.FC<{ pred: ClassifyPrediction; rank: number; bird?: Bird }> = ({ pred, rank, bird }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/bird/${encodeURIComponent(pred.eBird)}`)}
      className="w-full flex items-center gap-3 p-3 bg-card border border-hair hover:border-hair-strong hover:shadow-lg rounded-2xl transition-all text-left group"
    >
      <span className="font-mono text-xs text-faint w-4 shrink-0 text-center">{rank}</span>
      <div className="w-16 h-16 rounded-xl bg-card-2 overflow-hidden shrink-0">
        {bird ? <ResultThumb bird={bird} /> : <div className="w-full h-full bg-card-2" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-ink truncate">{bird?.common_name || pred.eBird}</p>
        {bird?.scientific_name && <p className="text-xs italic text-subtle truncate">{bird.scientific_name}</p>}
        {bird?.naughty_description && (
          <p className="text-xs text-ink/60 italic line-clamp-1 mt-0.5 border-l-2 border-gold pl-2">{bird.naughty_description}</p>
        )}
      </div>
      <div className="text-right shrink-0 flex items-center gap-1">
        <span className="font-mono text-sm font-semibold text-brand tabular-nums">{(pred.confidence * 100).toFixed(1)}%</span>
        <ChevronRight className="w-4 h-4 text-faint group-hover:text-brand transition-colors" />
      </div>
    </button>
  );
};

const ClassifyUpload: React.FC = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [micHidden, setMicHidden] = useState(false);
  const [micState, setMicState] = useState<MicState>("idle");
  const [countdown, setCountdown] = useState(MAX_SECS);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClassifyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { data: allBirds = [] } = useBirdList();
  const birdMap = useMemo(() => {
    const m: Record<string, Bird> = {};
    allBirds.forEach(b => { m[b.eBird] = b; });
    return m;
  }, [allBirds]);

  // Cleanup on unmount
  useEffect(() => () => {
    timerRef.current && clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
  }, []);

  const stopRecording = useCallback(() => {
    timerRef.current && clearInterval(timerRef.current);
    if (recorderRef.current?.state !== "inactive") recorderRef.current?.stop();
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  }, []);

  const startRecording = useCallback(async () => {
    setMicState("requesting");
    setError(null);
    setResult(null);
    setAudioUrl(null);
    setFile(null);

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err: any) {
      const denied = err.name === "NotAllowedError" || err.name === "PermissionDeniedError";
      setMicState(denied ? "denied" : "idle");
      if (!denied) setError("Could not access microphone: " + (err.message || err.name));
      return;
    }

    streamRef.current = stream;
    chunksRef.current = [];
    const mime = getBestMimeType();
    const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    recorderRef.current = recorder;

    recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mime || "audio/wav" });
      setFile(new File([blob], `recording.${mimeToExt(mime)}`, { type: mime || "audio/wav" }));
      setAudioUrl(URL.createObjectURL(blob));
      setMicState("done");
      setCountdown(MAX_SECS);
    };

    recorder.start(100);
    setMicState("recording");
    setCountdown(MAX_SECS);

    let secs = MAX_SECS;
    timerRef.current = setInterval(() => {
      secs--;
      setCountdown(secs);
      if (secs <= 0) { clearInterval(timerRef.current!); stopRecording(); }
    }, 1000);
  }, [stopRecording]);

  const handleMicClick = () => {
    if (micState === "recording") stopRecording();
    else startRecording();
  };

  const pickFile = (f: File) => {
    const ext = "." + f.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setError(`Unsupported type. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`);
      return;
    }
    setFile(f);
    setAudioUrl(URL.createObjectURL(f));
    setError(null);
    setResult(null);
  };

  const handleClassify = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await classifyApi.classify(file);
      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Classification failed");
    } finally {
      setLoading(false);
    }
  };

  const isRecording = micState === "recording";
  const predictions: ClassifyPrediction[] = result
    ? (result.top_predictions?.length ? result.top_predictions.slice(0, 5) : [{ eBird: result.eBird, confidence: result.confidence }])
    : [];

  return (
    <div className="grid md:grid-cols-2 gap-6 items-start">
      {/* ── LEFT: capture / upload ─────────────────────────────── */}
      <div className="space-y-4">
        {/* Mic section */}
        {!micHidden && !showUpload && (
          <div className={`rounded-2xl p-8 flex flex-col items-center border transition-colors duration-500 ${isRecording ? "bg-red-50 border-red-200" : "bg-card border-hair"}`}>
            <div className="relative flex items-center justify-center mb-6">
              {isRecording && (
                <>
                  <span className="absolute w-28 h-28 rounded-full bg-red-500/20 animate-ping" style={{ animationDuration: "1.4s" }} />
                  <span className="absolute w-40 h-40 rounded-full bg-red-500/10 animate-ping" style={{ animationDuration: "1.4s", animationDelay: "0.35s" }} />
                  <span className="absolute w-52 h-52 rounded-full bg-red-500/[0.07] animate-ping" style={{ animationDuration: "1.4s", animationDelay: "0.7s" }} />
                </>
              )}
              <button
                onClick={handleMicClick}
                disabled={micState === "requesting"}
                aria-label={isRecording ? "Stop recording" : "Start recording"}
                className={`relative z-10 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none
                  ${isRecording ? "w-24 h-24 bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/30" : "w-16 h-16 bg-card-2 hover:bg-hair"}
                  ${micState === "requesting" ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
              >
                {isRecording ? <MicOff className="w-8 h-8 text-white" /> : <Mic className="w-7 h-7 text-subtle" />}
              </button>
            </div>

            {micState === "idle" && <p className="text-sm text-subtle">Tap to record</p>}
            {micState === "requesting" && <p className="text-sm text-subtle">Waiting for microphone…</p>}
            {micState === "done" && <p className="text-sm text-subtle">Done — tap to record again</p>}
            {micState === "recording" && (
              <div className="text-center">
                <p className="text-sm text-red-600 font-medium">Recording — tap to stop</p>
                <p className="text-xs text-faint mt-1">{countdown}s remaining</p>
              </div>
            )}
            {micState === "denied" && (
              <div className="text-center">
                <p className="text-sm text-red-600">Microphone access denied.</p>
                <p className="text-xs text-faint mt-1">Allow it in your browser's site settings, then tap again.</p>
              </div>
            )}

            <div className="flex items-center gap-5 mt-5">
              <button onClick={() => setShowUpload(true)} className="text-xs text-subtle hover:text-ink transition-colors underline">Try upload file?</button>
              <button onClick={() => setMicHidden(true)} className="text-xs text-faint hover:text-subtle transition-colors">Hide</button>
            </div>
          </div>
        )}

        {/* Restore mic button */}
        {micHidden && !showUpload && (
          <button
            onClick={() => setMicHidden(false)}
            className="w-full py-2 rounded-xl text-xs text-subtle hover:text-ink bg-card border border-hair hover:border-hair-strong transition-colors flex items-center justify-center gap-1.5"
          >
            <Mic className="w-3 h-3" /> Use microphone
          </button>
        )}

        {/* Upload section */}
        {showUpload && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-subtle">Upload a file</p>
              <button
                onClick={() => { setShowUpload(false); setFile(null); setAudioUrl(null); }}
                className="text-xs text-subtle hover:text-ink transition-colors flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Close
              </button>
            </div>
            <div
              className="border-2 border-dashed border-hair-strong rounded-xl p-8 text-center cursor-pointer hover:border-brand transition-colors bg-card-2"
              onClick={() => inputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) pickFile(f); }}
            >
              <input
                ref={inputRef}
                type="file"
                accept={ALLOWED_EXTENSIONS.join(",")}
                onChange={e => { const f = e.target.files?.[0]; if (f) pickFile(f); }}
                className="hidden"
              />
              <Upload className="w-8 h-8 text-faint mx-auto mb-3" />
              {file
                ? <p className="text-sm text-ink font-medium">{file.name}</p>
                : <p className="text-sm text-subtle">Drop an audio file or click to browse</p>
              }
              <p className="text-xs text-faint mt-2">WAV · FLAC · MP3 · OGG · M4A</p>
            </div>
          </div>
        )}

        {/* Audio player */}
        {audioUrl && (
          <div>
            <SimpleAudioPlayer src={audioUrl} />
          </div>
        )}

        {/* Match button / loading */}
        {loading ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <Lottie animationData={loadingBirdAnimation} loop style={{ width: 120, height: 120 }} />
            <p className="text-sm text-subtle">Matching…</p>
          </div>
        ) : (
          <button
            onClick={handleClassify}
            disabled={!file}
            className="w-full py-3 px-4 rounded-xl text-sm font-semibold transition-colors bg-brand text-white hover:bg-brand-600 disabled:bg-card-2 disabled:text-faint disabled:cursor-not-allowed"
          >
            Match
          </button>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>

      {/* ── RIGHT: results (5 cards) or grey empty state ───────── */}
      <div>
        {predictions.length > 0 ? (
          <div className="space-y-3">
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-subtle mb-1">Top matches — tap to view</p>
            {predictions.map((p, i) => (
              <ResultCard key={p.eBird} pred={p} rank={i + 1} bird={birdMap[p.eBird]} />
            ))}
          </div>
        ) : (
          <div className="min-h-[300px] h-full rounded-2xl border border-dashed border-hair-strong bg-card-2 flex flex-col items-center justify-center text-center p-8">
            <div className="w-12 h-12 rounded-full bg-hair flex items-center justify-center mb-3">
              <AudioLines className="w-5 h-5 text-faint" />
            </div>
            <p className="text-sm text-subtle">Your top matches will appear here</p>
            <p className="text-xs text-faint mt-1">Record or upload a sound, then press Match.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassifyUpload;
