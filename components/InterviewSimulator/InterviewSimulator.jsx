// InterviewSimulatorWithVoice.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export default function InterviewSimulatorWithVoice() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [transcribing, setTranscribing] = useState(false);
  const recognitionRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    fetchNextQuestion();
    enableWebcam();
  }, []);

  const enableWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Webcam access denied or not supported:", err);
    }
  };

  const fetchNextQuestion = async () => {
    try {
      const res = await fetch("/api/interview/generate-question", {
        method: "POST",
      });
      if (!res.ok) throw new Error(`Server responded with status ${res.status}`);
      const data = await res.json();
      if (!data?.question) throw new Error("No question returned by server");
      setQuestion(data.question);
      speakText(data.question);
      setAnswer("");
    } catch (err) {
      console.error("Error fetching question:", err);
      const fallback = "Describe a difficult bug you fixed in a project.";
      setQuestion(fallback);
      speakText(fallback);
    }
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
    const recognition = new webkitSpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setTranscribing(true);
    recognition.onend = () => setTranscribing(false);
    recognition.onerror = (e) => console.error("Speech error:", e);

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setAnswer(transcript);
    };

    recognition.start();
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/interview/evaluate-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer }),
      });
      if (!res.ok) throw new Error(`Evaluation failed: ${res.status}`);
    } catch (err) {
      console.error("Error submitting answer:", err);
    } finally {
      fetchNextQuestion();
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 flex items-center justify-center">
      <div className="flex w-full max-w-7xl gap-10">
        {/* Left Panel: Avatar and Webcam */}
        <motion.div
          className="w-1/3 flex flex-col items-center gap-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src="https://img.freepik.com/free-vector/graident-ai-robot-vectorart_78370-4114.jpg?uid=R106067768&ga=GA1.1.885685089.1730820066&semt=ais_hybrid&w=740"
            alt="Robot Avatar"
            className="w-48 h-48 rounded-full border-4 border-blue-500"
          />
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-64 h-48 rounded-xl border border-gray-600 object-cover"
          />
        </motion.div>

        {/* Interview Panel */}
        <div className="w-2/3 space-y-6">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-bold mb-2">Question</h2>
            <p className="text-lg text-blue-300 min-h-[48px]">{question}</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-4">
            <h2 className="text-xl font-bold">Your Answer</h2>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full h-32 p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none"
              placeholder="Speak or type your answer here..."
            />
            <div className="flex gap-4">
              <button
                onClick={startListening}
                disabled={transcribing}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white"
              >
                {transcribing ? "Listening..." : "Speak Answer"}
              </button>
              <button
                onClick={handleSubmit}
                disabled={!answer.trim()}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
              >
                Submit & Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}