"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

// Animation Variants
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } },
};

export default function ViewProfilePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoaded || !user) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/profile");
        const data = await response.json();

        if (response.ok) {
          setProfileData(data);
        } else {
          setError(data.error || "Failed to load profile");
        }
      } catch (error) {
        console.error(error);
        setError("Network error. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, isLoaded]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-4">
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-400 border-t-transparent animate-spin"></div>
          <div className="absolute inset-3 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin animate-duration-2000"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-600/20 to-purple-600/0 animate-pulse"></div>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Loading Profile</h3>
          <p className="text-indigo-400 animate-pulse">Retrieving your skill data...</p>
        </div>
      </div>
    );
  }

  if (!profileData && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeIn}
          className="w-full max-w-xl bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 space-y-6 shadow-xl border border-gray-700/50 text-center"
        >
          <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent pb-1">
            Profile Not Found
          </h2>
          <p className="text-gray-400">You haven't set up your profile yet.</p>
          <Link href="/profile/update">
            <button className="py-3.5 px-8 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium hover:from-indigo-500 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-indigo-500/25">
              Create Profile
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <motion.div
          className="absolute top-[10%] left-[15%] w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-[80px]"
          animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-[40%] right-[15%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[80px]"
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.1, 1] }}
          transition={{ duration: 7, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute bottom-[10%] left-[35%] w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-[80px]"
          animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        />
      </div>

      <motion.div
        className="w-full max-w-xl bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 space-y-6 shadow-xl border border-gray-700/50 z-10"
        variants={fadeIn}
      >
        <div className="flex justify-between items-center mb-6">
          <motion.h2
            className="text-3xl font-bold text-white bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent pb-1"
            variants={cardVariants}
          >
            Your Profile
          </motion.h2>
          <motion.div variants={cardVariants}>
            <Link href="/profile/update">
              <button className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium hover:from-indigo-500 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-indigo-500/25 hover:scale-105 active:scale-95">
                Update Profile
              </button>
            </Link>
          </motion.div>
        </div>

        {error && (
          <motion.div
            variants={cardVariants}
            className="bg-red-900/50 text-red-200 p-4 rounded-xl text-sm border-l-4 border-red-500"
          >
            <strong>Error:</strong> {error}
          </motion.div>
        )}

        {profileData && (
          <motion.div className="space-y-5" variants={containerVariants}>
            {/* Personal Info */}
            <motion.div variants={cardVariants} className="bg-gray-700/40 p-5 rounded-xl border border-gray-600/30 hover:border-indigo-500/20 transition-all duration-300 hover:translate-y-[-4px]">
              <h3 className="text-lg font-semibold text-white mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">First Name</p>
                  <p className="text-white text-lg">{profileData.first_name || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">Last Name</p>
                  <p className="text-white text-lg">{profileData.last_name || "Not specified"}</p>
                </div>
              </div>
            </motion.div>

            {/* Professional Details */}
            <motion.div variants={cardVariants} className="bg-gray-700/40 p-5 rounded-xl border border-gray-600/30 hover:border-indigo-500/20 transition-all duration-300 hover:translate-y-[-4px]">
              <h3 className="text-lg font-semibold text-white mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Professional Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">Industry</p>
                  <p className="text-white text-lg">{profileData.industry || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">Position</p>
                  <p className="text-white text-lg">{profileData.position || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">Years of Experience</p>
                  <p className="text-white text-lg">{profileData.experience ? `${profileData.experience} years` : "Not specified"}</p>
                </div>
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div variants={cardVariants} className="bg-gray-700/40 p-5 rounded-xl border border-gray-600/30 hover:border-indigo-500/20 transition-all duration-300 hover:translate-y-[-4px]">
              <h3 className="text-lg font-semibold text-white mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Skills</h3>
              <motion.div className="flex flex-wrap gap-2" variants={containerVariants}>
                {profileData.skills && profileData.skills.length > 0 ? (
                  profileData.skills.map((skill, index) => (
                    <motion.span
                      key={index}
                      variants={cardVariants}
                      className="bg-indigo-600/30 text-indigo-200 px-3 py-1.5 rounded-lg text-sm border border-indigo-500/20 shadow-sm hover:bg-indigo-600/40 transition-all duration-200 hover:scale-110"
                    >
                      {skill}
                    </motion.span>
                  ))
                ) : (
                  <p className="text-white">No skills specified</p>
                )}
              </motion.div>
            </motion.div>

            {/* Bio */}
            <motion.div variants={cardVariants} className="bg-gray-700/40 p-5 rounded-xl border border-gray-600/30 hover:border-indigo-500/20 transition-all duration-300 hover:translate-y-[-4px]">
              <h3 className="text-lg font-semibold text-white mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Professional Bio</h3>
              <p className="text-white whitespace-pre-line leading-relaxed">{profileData.bio}</p>
            </motion.div>

            {/* Resume Section */}
            <motion.div variants={cardVariants} className="bg-gray-700/40 p-5 rounded-xl border border-gray-600/30 hover:border-indigo-500/20 transition-all duration-300 hover:translate-y-[-4px]">
              <h3 className="text-lg font-semibold text-white mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Resume</h3>
              {profileData.resume_url ? (
                <p className="text-green-400 font-medium mb-2">You have uploaded your resume.</p>
              ) : (
                <div className="space-y-3">
                  <p className="text-red-400 font-medium">Resume not found</p>
                  <p className="text-gray-400 text-sm">Upload your resume to enable resume-based interviews.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}