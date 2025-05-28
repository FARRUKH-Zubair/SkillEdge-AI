"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";

export default function InterviewTypeSelector() {
  const { user } = useUser();
  const [selectedType, setSelectedType] = useState("technical");
  const [selectedRole, setSelectedRole] = useState("Software Engineer");
  const [isLoaded, setIsLoaded] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [position, setPosition] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [existingResume, setExistingResume] = useState(null);

  const interviewTypes = [
    {
      id: "technical",
      name: "Technical",
      description: "Coding, algorithms, and system design questions.",
      bg: "bg-blue-600",
      hover: "hover:bg-blue-700",
      ring: "ring-blue-400",
      accent: "text-blue-400",
    },
    {
      id: "behavioral",
      name: "Behavioral",
      description: "STAR method, soft skills, and communication.",
      bg: "bg-green-600",
      hover: "hover:bg-green-700",
      ring: "ring-green-400",
      accent: "text-green-400",
    },
    {
      id: "resume",
      name: "Resume-Based",
      description: "Get personalized questions based on your resume content.",
      bg: "bg-purple-600",
      hover: "hover:bg-purple-700",
      ring: "ring-purple-400",
      accent: "text-purple-400",
    },
  ];

  const technicalRoles = [
    "Software Engineer",
    "ML Engineer",
    "Web Developer",
    "Mobile Developer",
  ];

  // Fetch user's profile data to check for existing resume
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("resume_url, position")
        .eq("user_id", user.id)
        .single();

      if (!error && data?.resume_url) {
        setExistingResume(data.resume_url);
        if (data.position) {
          setPosition(data.position);
        }
      }
    };

    fetchProfile();
  }, [user]);

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      toast.error("Please select a resume file");
      return;
    }

    if (!position) {
      toast.error("Please select a position");
      return;
    }

    if (resumeFile.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    window.location.href = `/interview-simulator?type=resume&position=${encodeURIComponent(position)}`;
  };

  const handleContinue = () => {
    if (selectedType === "resume") {
      if (existingResume) {
        // If resume exists, use the position from profile
        window.location.href = `/interview-simulator?type=resume&position=${encodeURIComponent(position)}`;
      } else {
        // If no resume exists, handle new upload
        handleResumeUpload();
      }
      return;
    }

    let url;
    if (selectedType === "technical") {
      url = `/interview-simulator?type=technical&role=${encodeURIComponent(selectedRole)}`;
    } else {
      url = `/interview-simulator?type=behavioral`;
    }

    window.location.href = url;
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black text-white flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"
        }`}
    >
      <div className="w-full max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[1200px] mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8 sm:mb-14 text-center bg-gradient-to-r from-blue-400 to-green-400 text-transparent bg-clip-text animate-pulse">
          Select Interview Type
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10 w-full mb-8 sm:mb-10">
          {interviewTypes.map((type) => {
            const isSelected = selectedType === type.id;
            return (
              <div
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`cursor-pointer transform transition-all duration-500 hover:scale-105 backdrop-blur-md bg-gray-800/70 border-2 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl ${isSelected
                  ? `border-transparent ring-2 sm:ring-4 ${type.ring}`
                  : "border-gray-700 hover:border-gray-500"
                  }`}
              >
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${type.accent}`}>
                    {type.name}
                  </h2>
                  {isSelected && (
                    <span className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium ${type.bg}`}>
                      Selected
                    </span>
                  )}
                </div>
                <p className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed">
                  {type.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Sub-options for Technical roles */}
        {selectedType === "technical" && (
          <div className="mb-8 sm:mb-10 text-center">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-blue-300">
              Select a Technical Role:
            </h3>
            <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
              {technicalRoles.map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 border text-sm sm:text-base ${selectedRole === role
                    ? "bg-blue-600 text-white border-blue-500"
                    : "bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700"
                    }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Upload option for Resume-Based */}
        {selectedType === "resume" && (
          <div className="mb-8 sm:mb-10 text-center space-y-4 sm:space-y-6">
            {existingResume ? (
              <div className="max-w-[95%] sm:max-w-md mx-auto p-4 bg-purple-900/30 rounded-lg border border-purple-500/30">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-purple-300">
                  Resume Already Uploaded
                </h3>
                <p className="text-sm text-gray-300">
                  You have already uploaded your resume. You can proceed with the interview.
                </p>
              </div>
            ) : (
              <>
                <div className="max-w-[95%] sm:max-w-md mx-auto">
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 text-purple-300">
                    Select Position:
                  </h3>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm sm:text-base"
                  >
                    <option value="">Select a position</option>
                    {technicalRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="max-w-[95%] sm:max-w-md mx-auto">
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 text-purple-300">
                    Upload Your Resume:
                  </h3>
                  <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setResumeFile(e.target.files[0])}
                      className="block w-full text-xs sm:text-sm text-gray-300
                        file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4
                        file:rounded-lg file:border-0
                        file:text-xs sm:file:text-sm file:font-semibold
                        file:bg-purple-600 file:text-white
                        hover:file:bg-purple-700
                        cursor-pointer"
                    />
                    <p className="text-xs sm:text-sm text-gray-400">
                      Only PDF files are accepted
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            disabled={isUploading || (selectedType === "resume" && !existingResume && !resumeFile)}
            className={`px-6 sm:px-8 py-2 sm:py-3 rounded-xl text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 text-sm sm:text-base ${selectedType === "resume" && !existingResume && !resumeFile
              ? "bg-gray-600 cursor-not-allowed"
              : selectedType === "resume"
                ? "bg-purple-600 hover:bg-purple-700"
                : selectedType === "technical"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
          >
            {isUploading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Uploading...</span>
              </div>
            ) : (
              "Continue"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
