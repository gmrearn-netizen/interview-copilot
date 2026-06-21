import { useAudioCapture } from "@/hooks/useAudioCapture";
import {
  useAddQAPair,
  useGenerateAnswer,
  useRegenerateAnswer,
} from "@/hooks/useQueries";
import { useStealth } from "@/hooks/useStealth";
import { cn } from "@/lib/utils";
import {
  Check,
  Copy,
  GripHorizontal,
  Maximize2,
  Mic,
  MicOff,
  Minimize2,
  RefreshCw,
  Save,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface StealthOverlayProps {
  activeSessionId: bigint | null;
}

export function StealthOverlay({ activeSessionId }: StealthOverlayProps) {
  const {
    isListening,
    transcript,
    interimTranscript,
    error: audioError,
    startListening,
    stopListening,
    clearTranscript,
  } = useAudioCapture();

  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const generateMutation = useGenerateAnswer();
  const regenerateMutation = useRegenerateAnswer();
  const addQAMutation = useAddQAPair();

  const {
    opacity,
    collapsed,
    position,
    setOpacity,
    toggleCollapsed,
    setPosition,
  } = useStealth();

  const dragRef = useRef<{
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        initialX: position.x,
        initialY: position.y,
      };
    },
    [position],
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPosition({
        x: Math.max(
          0,
          Math.min(window.innerWidth - 320, dragRef.current.initialX + dx),
        ),
        y: Math.max(
          0,
          Math.min(window.innerHeight - 48, dragRef.current.initialY + dy),
        ),
      });
    };
    const handleMouseUp = () => {
      dragRef.current = null;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [setPosition]);

  const handleGenerate = useCallback(async () => {
    const question = transcript.trim() || interimTranscript.trim();
    if (!question) return;
    setIsLoading(true);
    try {
      const result = await generateMutation.mutateAsync(question);
      setAnswer(result);
    } catch {
      // error handled by mutation
    } finally {
      setIsLoading(false);
    }
  }, [transcript, interimTranscript, generateMutation]);

  const handleRegenerate = useCallback(async () => {
    const question = transcript.trim() || interimTranscript.trim();
    if (!question || !answer) return;
    setIsLoading(true);
    try {
      const result = await regenerateMutation.mutateAsync({
        question,
        previousAnswer: answer,
      });
      setAnswer(result);
    } catch {
      // error handled by mutation
    } finally {
      setIsLoading(false);
    }
  }, [transcript, interimTranscript, answer, regenerateMutation]);

  const handleCopy = useCallback(async () => {
    if (!answer) return;
    await navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [answer]);

  const handleSave = useCallback(async () => {
    const question = transcript.trim() || interimTranscript.trim();
    if (!question || !answer || !activeSessionId) return;
    await addQAMutation.mutateAsync({
      sessionId: activeSessionId,
      question,
      answer,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [transcript, interimTranscript, answer, activeSessionId, addQAMutation]);

  if (collapsed) {
    return (
      <button
        type="button"
        data-ocid="stealth.expand_button"
        onClick={toggleCollapsed}
        className="fixed z-[9999] w-10 h-10 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-elevated hover:scale-110 transition-smooth"
        style={{ left: position.x, top: position.y }}
        aria-label="Expand overlay"
      >
        <Maximize2 className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed z-[9999] w-80 glass rounded-xl shadow-elevated overflow-hidden transition-smooth"
      style={{
        left: position.x,
        top: position.y,
        opacity,
      }}
    >
      {/* Drag handle / header */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b border-border/50 cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-1.5">
          <GripHorizontal className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Live Coach
          </span>
        </div>
        <div className="flex items-center gap-1">
          <input
            data-ocid="stealth.opacity_input"
            type="range"
            min={0.3}
            max={1}
            step={0.1}
            value={opacity}
            onChange={(e) => setOpacity(Number.parseFloat(e.target.value))}
            className="w-16 h-1 accent-primary"
            title="Opacity"
          />
          <button
            type="button"
            data-ocid="stealth.collapse_button"
            onClick={toggleCollapsed}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-smooth"
            aria-label="Collapse"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-3 space-y-3">
        {/* Mic control */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-ocid="stealth.mic_button"
            onClick={isListening ? stopListening : startListening}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-smooth",
              isListening
                ? "bg-destructive/20 text-destructive animate-pulse-soft"
                : "bg-primary/10 text-primary hover:bg-primary/20",
            )}
          >
            {isListening ? (
              <MicOff className="w-3.5 h-3.5" />
            ) : (
              <Mic className="w-3.5 h-3.5" />
            )}
            {isListening ? "Stop" : "Listen"}
          </button>
          {isListening && (
            <span className="text-[10px] text-muted-foreground animate-pulse-soft">
              Recording...
            </span>
          )}
          <button
            type="button"
            data-ocid="stealth.clear_button"
            onClick={clearTranscript}
            className="ml-auto p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-smooth"
            aria-label="Clear transcript"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Transcript */}
        <div className="space-y-1">
          <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            Question
          </div>
          <div className="min-h-[3rem] max-h-24 overflow-y-auto rounded-lg bg-muted/50 p-2 text-xs text-foreground leading-relaxed">
            {transcript || interimTranscript ? (
              <>
                <span className="text-foreground">{transcript}</span>
                {interimTranscript && (
                  <span className="text-muted-foreground italic">
                    {" "}
                    {interimTranscript}
                  </span>
                )}
              </>
            ) : (
              <span className="text-muted-foreground italic">
                Start listening to capture interviewer speech...
              </span>
            )}
          </div>
          {audioError && (
            <div className="text-[10px] text-destructive">{audioError}</div>
          )}
        </div>

        {/* Generate */}
        <button
          type="button"
          data-ocid="stealth.generate_button"
          onClick={handleGenerate}
          disabled={
            isLoading || (!transcript.trim() && !interimTranscript.trim())
          }
          className={cn(
            "w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-smooth",
            isLoading || (!transcript.trim() && !interimTranscript.trim())
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:bg-primary/90",
          )}
        >
          {isLoading ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Zap className="w-3.5 h-3.5" />
          )}
          {isLoading ? "Generating..." : "Generate Answer"}
        </button>

        {/* Answer */}
        {answer && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Answer
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  data-ocid="stealth.copy_button"
                  onClick={handleCopy}
                  className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-smooth"
                  aria-label="Copy answer"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-success" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  data-ocid="stealth.regenerate_button"
                  onClick={handleRegenerate}
                  disabled={isLoading}
                  className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-smooth disabled:opacity-50"
                  aria-label="Regenerate answer"
                >
                  <RefreshCw
                    className={cn("w-3.5 h-3.5", isLoading && "animate-spin")}
                  />
                </button>
                {activeSessionId && (
                  <button
                    type="button"
                    data-ocid="stealth.save_button"
                    onClick={handleSave}
                    disabled={addQAMutation.isPending}
                    className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-smooth disabled:opacity-50"
                    aria-label="Save to session"
                  >
                    {saved ? (
                      <Check className="w-3.5 h-3.5 text-success" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>
            <div className="max-h-40 overflow-y-auto rounded-lg bg-muted/50 p-2 text-xs text-foreground leading-relaxed whitespace-pre-wrap">
              {answer}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Need to import Zap for the generate button
