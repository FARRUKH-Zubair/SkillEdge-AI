"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { XCircle, Camera, Mic } from "lucide-react";

export default function InterviewSimulatorWithVoice() {
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
  const [permissions, setPermissions] = useState({
    camera: false,
    microphone: false
  });
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const timerRef = useRef(null);
  const recognitionRef = useRef(null);
  const videoRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "technical";
  const role = type === "technical"
    ? searchParams.get("role") || "Software Engineer"
    : type === "behavioral"
      ? "behavioral"
      : "resume";

  const checkPermissions = async () => {
    try {
      const cameraPermission = await navigator.permissions.query({ name: 'camera' });
      const micPermission = await navigator.permissions.query({ name: 'microphone' });

      setPermissions({
        camera: cameraPermission.state === 'granted',
        microphone: micPermission.state === 'granted'
      });

      if (cameraPermission.state !== 'granted' || micPermission.state !== 'granted') {
        setShowPermissionModal(true);
      }
    } catch (error) {
      console.error('Error checking permissions:', error);
      setShowPermissionModal(true);
    }
  };

  useEffect(() => {
    if (started) {
      checkPermissions();
      enableWebcam();
      fetchAllQuestions();
    }
  }, [started]);

  const enableWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Media access denied or not supported:", err);
      setShowPermissionModal(true);
    }
  };

  const fetchAllQuestions = async () => {
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
  };

  const playQuestion = async (index, qs) => {
    setCurrentIndex(index);
    const text = qs[index];
    setSpoken(false);
    setAnswer("");
    setTimeLeft(180); // Reset timer for new question
    setCountdown(3);
    for (let i = 3; i > 0; i--) {
      setCountdown(i);
      await new Promise((res) => setTimeout(res, 1000));
    }
    setCountdown(null);
    speakText(text);
  };

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser doesn't support Speech Recognition");
      return;
    }

    if (timeLeft <= 0) {
      alert("You have used all your time for this question!");
      return;
    }

    const recognition = new webkitSpeechRecognition();
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
    recognition.onerror = (e) => console.error("Speech error:", e);

    recognition.onresult = (e) => {
      let transcript = "";
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        transcript += e.results[i][0].transcript;
      }
      setAnswer((prev) => prev + " " + transcript);
      setSpoken(true);
    };

    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setTranscribing(false);
    setTimerActive(false);
    stopTimer();
    setSpoken(true);
  };

  const startTimer = () => {
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
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, []);

  const handleSubmit = async () => {
    // (optional) send to evaluation API
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

    // 1) store the current answer
    setAnswers((prev) => [...prev, answer]);

    // 2) either advance or finish
    if (currentIndex < questions.length - 1) {
      playQuestion(currentIndex + 1, questions);
    } else {
      // last question → persist and redirect
      const payload = { questions, answers: [...answers, answer] };
      localStorage.setItem("interviewResults", JSON.stringify(payload));
      router.push("/interview/complete");
    }
  };

  const handleTerminate = () => {
    if (
      window.confirm(
        "Terminating now will lose all progress. Are you sure you want to terminate the interview?"
      )
    ) {
      router.push("/");
    }
  };

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

  if (showPermissionModal) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="bg-gray-800 p-6 rounded-xl max-w-md w-full mx-4">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">Permissions Required</h2>
          <p className="text-gray-300 mb-6 text-center">
            This interview requires access to your camera and microphone. Please grant the necessary permissions to continue.
          </p>
          <div className="space-y-4">
            <button
              onClick={async () => {
                try {
                  await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                  setShowPermissionModal(false);
                  checkPermissions();
                } catch (err) {
                  console.error("Permission denied:", err);
                }
              }}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" />
              <Mic className="w-5 h-5" />
              Grant Permissions
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  const canStart = !transcribing;
  const canStop = transcribing;
  const canSubmit = !transcribing && spoken;
  const startLabel = transcribing
    ? "Speaking..."
    : spoken
      ? "Continue Speaking"
      : "Start Speaking";
  const btnClass = (enabled) =>
    `${enabled ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-700 cursor-not-allowed"} px-6 py-2 rounded-lg text-white flex items-center`;
  const isLast = currentIndex === questions.length - 1;
  const submitLabel = isLast ? "Finish Interview" : "Submit & Next";

  return (
    <div className="relative min-h-screen bg-gray-950 text-white p-4 sm:p-8">
      {loadingQuestions && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-75 z-10">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-white text-base sm:text-lg">Generating Questions...</p>
        </div>
      )}

      <button
        onClick={handleTerminate}
        className="absolute bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg shadow-lg text-sm sm:text-base"
      >
        Terminate Interview
      </button>

      <h1 className="absolute top-20 sm:top-24 left-1/2 transform -translate-x-1/2 text-xl sm:text-3xl font-bold text-white text-center w-full px-4">
        {`Interview of ${role}`}
      </h1>

      <div className="mt-28 sm:mt-32 flex flex-col sm:flex-row items-center justify-center w-full max-w-7xl mx-auto gap-6 sm:gap-10 opacity-90">
        <motion.div
          className="w-full sm:w-1/3 flex flex-col items-center gap-4 sm:gap-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src="https://img.freepik.com/free-vector/graident-ai-robot-vectorart_78370-4114.jpg"
            alt="Robot Avatar"
            className="w-32 h-32 sm:w-48 sm:h-48 rounded-full border-4 border-blue-500"
          />
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full sm:w-64 h-36 sm:h-48 rounded-xl border border-gray-600 object-cover scale-x-[-1]"
          />
        </motion.div>

        <div className="w-full sm:w-2/3 space-y-4 sm:space-y-6">
          {countdown !== null && (
            <div className="text-center text-4xl sm:text-5xl font-bold text-yellow-400 animate-pulse mb-4">
              {countdown}
            </div>
          )}

          <div className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700">
            <h2 className="text-lg sm:text-xl font-bold mb-2">{`Question ${currentIndex + 1}`}</h2>
            <p className="text-base sm:text-lg text-blue-300 min-h-[48px]">
              {questions[currentIndex]}
            </p>
          </div>

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
              placeholder="Speak or type your answer here..."
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
        </div>
      </div>
    </div>
  );
}
