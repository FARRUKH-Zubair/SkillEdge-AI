"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { XCircle, Camera, Mic } from "lucide-react";
import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

// Extracted components for better organization
const LoadingOverlay = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-75 z-10">
    <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    <p className="mt-4 text-white text-base sm:text-lg">Generating Questions...</p>
  </div>
);

const InterviewHeader = ({ role }) => (
  <h1 className="absolute top-20 sm:top-24 left-1/2 transform -translate-x-1/2 text-xl sm:text-3xl font-bold text-white text-center w-full px-4">
    {`Interview of ${role}`}
  </h1>
);

// Simple avatar image component
function AvatarImage() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <Image
        src="/avatar.jpg"
        alt="Avatar"
        fill
        className="object-cover rounded-full"
        style={{ zIndex: 1 }}
      />
    </div>
  );
}

const AvatarSection = ({ videoRef }) => (
  <motion.div
    className="w-full sm:w-1/3 flex flex-col items-center gap-4 sm:gap-6"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full border-4 border-blue-500 overflow-hidden relative group bg-gray-900">
      <AvatarImage />
      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
    <video
      ref={videoRef}
      autoPlay
      playsInline
      className="w-full sm:w-64 h-36 sm:h-48 rounded-xl border border-gray-600 object-cover scale-x-[-1] transition-transform duration-300"
    />
  </motion.div>
);

const QuestionDisplay = ({ currentIndex, question }) => (
  <div className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700">
    <h2 className="text-lg sm:text-xl font-bold mb-2">{`Question ${currentIndex + 1}`}</h2>
    <p className="text-base sm:text-lg text-blue-300 min-h-[48px]">{question}</p>
  </div>
);

const AnswerSection = ({
  answer,
  setAnswer,
  setSpoken,
  transcribing,
  timeLeft,
  formatTime,
  startListening,
  stopListening,
  handleSubmit,
  canStart,
  canStop,
  canSubmit,
  startLabel,
  submitLabel,
  hoveredButton,
  setHoveredButton
}) => {
  const btnClass = useCallback((enabled) =>
    `${enabled ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-700 cursor-not-allowed"} px-6 py-2 rounded-lg text-white flex items-center`,
    []
  );

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 className="text-lg sm:text-xl font-bold">Your Answer</h2>
        <div className={`text-base sm:text-lg font-semibold ${timeLeft <= 30 ? 'text-red-500 animate-pulse' : 'text-blue-400'}`}>
          Time Left: {formatTime(timeLeft)}
        </div>
      </div>
      <textarea
        value={answer}
        onChange={(e) => {
          setAnswer(e.target.value);
          setSpoken(!!e.target.value);
        }}
        disabled={transcribing}
        className="w-full h-24 sm:h-32 p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none text-sm sm:text-base"
        placeholder="Type your answer here..."
      />
      <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
        <button
          onMouseEnter={() => setHoveredButton("start")}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={startListening}
          disabled={!canStart || timeLeft <= 0}
          className={`${btnClass(canStart && timeLeft > 0)} text-sm sm:text-base w-full sm:w-auto`}
        >
          {startLabel}
          {(!canStart || timeLeft <= 0) && hoveredButton === "start" && (
            <XCircle className="ml-2 text-red-500" />
          )}
        </button>
        <button
          onMouseEnter={() => setHoveredButton("stop")}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={stopListening}
          disabled={!canStop}
          className={`${btnClass(canStop)} text-sm sm:text-base w-full sm:w-auto`}
        >
          Stop Speaking
          {!canStop && hoveredButton === "stop" && (
            <XCircle className="ml-2 text-red-500" />
          )}
        </button>
        <button
          onMouseEnter={() => setHoveredButton("submit")}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`${btnClass(canSubmit)} text-sm sm:text-base w-full sm:w-auto`}
        >
          {submitLabel}
          {!canSubmit && hoveredButton === "submit" && (
            <XCircle className="ml-2 text-red-500" />
          )}
        </button>
      </div>
    </div>
  );
};

export default function InterviewSimulatorWithVoice() {
  // State management
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [transcribing, setTranscribing] = useState(false);
  const [spoken, setSpoken] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [timeLeft, setTimeLeft] = useState(180);
  const [timerActive, setTimerActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Refs
  const timerRef = useRef(null);
  const recognitionRef = useRef(null);
  const videoRef = useRef(null);

  // Router and params
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "technical";
  const role = useMemo(() =>
    type === "technical"
      ? searchParams.get("role") || "Software Engineer"
      : type === "behavioral"
        ? "behavioral"
        : "resume",
    [type, searchParams]
  );

  // Memoized values
  const canStart = useMemo(() => !transcribing, [transcribing]);
  const canStop = useMemo(() => transcribing, [transcribing]);
  const canSubmit = useMemo(() => !transcribing && spoken, [transcribing, spoken]);
  const startLabel = useMemo(() =>
    transcribing
      ? "Speaking..."
      : spoken
        ? "Continue Speaking"
        : "Start Speaking",
    [transcribing, spoken]
  );
  const isLast = useMemo(() => currentIndex === questions.length - 1, [currentIndex, questions.length]);
  const submitLabel = useMemo(() => isLast ? "Finish Interview" : "Submit & Next", [isLast]);

  // Device check
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      setIsMobile(mobileRegex.test(userAgent));
    };
    checkMobile();
  }, []);

  // Start interview
  useEffect(() => {
    if (started) {
      if (!isMobile) {
        enableWebcam();
      }
      fetchAllQuestions();
    }
  }, [started, isMobile]);

  // Cleanup
  useEffect(() => {
    return () => {
      stopTimer();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Webcam setup
  const enableWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Media access denied or not supported:", err);
    }
  }, []);

  // Question fetching
  const fetchAllQuestions = useCallback(async () => {
    setLoadingQuestions(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/interview/generate-question`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, role }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || `API error ${res.status}`);
      }
      const { question: fetched } = await res.json();
      const firstSeven = Array.isArray(fetched) ? fetched.slice(0, 7) : [];
      setQuestions(firstSeven);
      playQuestion(0, firstSeven);
    } catch (err) {
      console.error("Error fetching questions:", err);
    } finally {
      setLoadingQuestions(false);
    }
  }, [type, role]);

  // Question playback
  const playQuestion = useCallback(async (index, qs) => {
    setCurrentIndex(index);
    const text = qs[index];
    setSpoken(false);
    setAnswer("");
    setTimeLeft(180);
    setCountdown(3);
    for (let i = 3; i > 0; i--) {
      setCountdown(i);
      await new Promise((res) => setTimeout(res, 1000));
    }
    setCountdown(null);
    speakText(text);
  }, []);

  // Text-to-speech
  const speakText = useCallback((text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.onstart = () => setSpoken(true);
    utterance.onend = () => setSpoken(false);
    speechSynthesis.speak(utterance);
  }, []);

  // Speech recognition
  const startListening = useCallback(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Your browser doesn't support Speech Recognition");
      return;
    }

    if (timeLeft <= 0) {
      alert("You have used all your time for this question!");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setTranscribing(true);
      setTimerActive(true);
      startTimer();
    };
    recognition.onend = () => {
      setTranscribing(false);
      setTimerActive(false);
      stopTimer();
    };
    recognition.onerror = (e) => {
      console.error("Speech error:", e);
      if (e.error === 'no-speech') {
        alert("No speech detected. Please try speaking again.");
      }
    };

    recognition.onresult = (e) => {
      let transcript = "";
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        transcript += e.results[i][0].transcript;
      }
      setAnswer((prev) => prev + " " + transcript);
      setSpoken(true);
    };

    try {
      recognition.start();
    } catch (err) {
      console.error("Error starting speech recognition:", err);
      alert("Error starting speech recognition. Please try again.");
    }
  }, [timeLeft]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      const tracks = recognitionRef.current.stream?.getTracks() || [];
      tracks.forEach(track => track.stop());
    }
    setTranscribing(false);
    setTimerActive(false);
    stopTimer();
    setSpoken(true);
  }, []);

  // Timer management
  const startTimer = useCallback(() => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopTimer();
          stopListening();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Answer submission
  const handleSubmit = useCallback(async () => {
    try {
      const evalRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/interview/evaluate-answer`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: questions[currentIndex],
            answer,
            role,
          }),
        }
      );
      if (!evalRes.ok) throw new Error(`Eval error ${evalRes.status}`);
      console.log("Evaluation result:", await evalRes.json());
    } catch (err) {
      console.error(err);
    }

    setAnswers((prev) => [...prev, answer]);

    if (currentIndex < questions.length - 1) {
      playQuestion(currentIndex + 1, questions);
    } else {
      const payload = { questions, answers: [...answers, answer] };
      localStorage.setItem("interviewResults", JSON.stringify(payload));
      router.push("/interview/complete");
    }
  }, [questions, currentIndex, answer, role, answers, playQuestion, router]);

  const handleTerminate = useCallback(() => {
    if (
      window.confirm(
        "Terminating now will lose all progress. Are you sure you want to terminate the interview?"
      )
    ) {
      router.push("/");
    }
  }, [router]);

  if (!started) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4 sm:p-8">
        <h1 className="text-2xl sm:text-4xl font-bold mb-6 text-center">Ready to Start Your Interview?</h1>
        <button
          onClick={() => setStarted(true)}
          className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg transition-transform hover:scale-105 w-full sm:w-auto max-w-xs"
        >
          Start Interview
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-950 text-white p-4 sm:p-8">
      {loadingQuestions && <LoadingOverlay />}

      <button
        onClick={handleTerminate}
        className="absolute bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg shadow-lg text-sm sm:text-base"
      >
        Terminate Interview
      </button>

      <InterviewHeader role={role} />

      <div className="mt-28 sm:mt-32 flex flex-col sm:flex-row items-center justify-center w-full max-w-7xl mx-auto gap-6 sm:gap-10 opacity-90">
        {!isMobile && (
          <AvatarSection
            videoRef={videoRef}
          />
        )}

        <div className={`w-full ${!isMobile ? 'sm:w-2/3' : ''} space-y-4 sm:space-y-6`}>
          {countdown !== null && (
            <div className="text-center text-4xl sm:text-5xl font-bold text-yellow-400 animate-pulse mb-4">
              {countdown}
            </div>
          )}

          <QuestionDisplay
            currentIndex={currentIndex}
            question={questions[currentIndex]}
          />

          <AnswerSection
            answer={answer}
            setAnswer={setAnswer}
            setSpoken={setSpoken}
            transcribing={transcribing}
            timeLeft={timeLeft}
            formatTime={formatTime}
            startListening={startListening}
            stopListening={stopListening}
            handleSubmit={handleSubmit}
            canStart={canStart}
            canStop={canStop}
            canSubmit={canSubmit}
            startLabel={startLabel}
            submitLabel={submitLabel}
            hoveredButton={hoveredButton}
            setHoveredButton={setHoveredButton}
          />
        </div>
      </div>
    </div>
  );
}
