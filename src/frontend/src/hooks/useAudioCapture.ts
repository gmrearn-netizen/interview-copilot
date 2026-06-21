import type { AudioState } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult:
    | ((event: {
        resultIndex: number;
        results: { isFinal: boolean; 0: { transcript: string } }[];
      }) => void)
    | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

interface WindowWithSpeech extends Window {
  SpeechRecognition?: new () => SpeechRecognitionInstance;
  webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
}

export function useAudioCapture() {
  const [state, setState] = useState<AudioState>({
    isListening: false,
    transcript: "",
    interimTranscript: "",
    error: null,
  });

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const transcriptBufferRef = useRef<string>("");

  const startListening = useCallback(() => {
    const w = window as unknown as WindowWithSpeech;
    if (!w.webkitSpeechRecognition && !w.SpeechRecognition) {
      setState((s) => ({
        ...s,
        error: "Speech recognition not supported in this browser.",
      }));
      return;
    }

    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) return;
    const recognition: SpeechRecognitionInstance = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "hi-IN";

    recognition.onstart = () => {
      setState((s) => ({ ...s, isListening: true, error: null }));
    };

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += `${transcript} `;
        } else {
          interim += transcript;
        }
      }
      if (final) {
        transcriptBufferRef.current += final;
      }
      setState((s) => ({
        ...s,
        transcript: transcriptBufferRef.current,
        interimTranscript: interim,
      }));
    };

    recognition.onerror = (event) => {
      if (event.error === "no-speech" || event.error === "aborted") return;
      setState((s) => ({ ...s, error: event.error }));
    };

    recognition.onend = () => {
      setState((s) => ({ ...s, isListening: false }));
    };

    recognition.start();
    recognitionRef.current = recognition;
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setState((s) => ({ ...s, isListening: false, interimTranscript: "" }));
  }, []);

  const clearTranscript = useCallback(() => {
    transcriptBufferRef.current = "";
    setState((s) => ({ ...s, transcript: "", interimTranscript: "" }));
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    clearTranscript,
  };
}
