"use client";
// hello world
//this is a testing change 
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;
      const imagePosition = imageElement.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      // Add scrolled class for initial animation
      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }

      // Add fade-in animation when image comes into view
      if (imagePosition < windowHeight * 0.8) {
        imageElement.classList.add("fade-in");
      }
    };

    // Initial check for elements in view
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full pt-36 md:pt-48 pb-10 bg-gradient-to-br from-gray-900 via-gray-950 to-black overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 max-w-[90%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[1200px]">
        <div className="space-y-6 text-center">
          <div className="space-y-6 mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold gradient-title animate-gradient">
              AI Powered Platform for
              <br />
              Mock Interviews.
            </h1>
            <p className="mx-auto max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[600px] text-muted-foreground text-base sm:text-lg md:text-xl">
              Advance your career with personalized guidance, interview prep, and
              AI-powered tools for job success.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/interview-type" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto px-8 cursor-pointer">
                Get Started
              </Button>
            </Link>
            <Link target="_blank" href="/" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 cursor-pointer">
                Watch Demo
              </Button>
            </Link>
          </div>
          <div className="hero-image-wrapper mt-5 md:mt-0">
            <div
              ref={imageRef}
              className="hero-image opacity-0 translate-y-10 transition-all duration-1000 ease-out"
            >
              <Image
                src="/check3.png"
                width={700}
                height={400}
                alt="Dashboard Preview"
                className="rounded-lg shadow-2xl border mx-auto w-full max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[700px] transform transition-transform duration-700 hover:scale-[1.02]"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-image {
          opacity: 0;
          transform: translateY(40px);
          transition: all 1s ease-out;
        }

        .hero-image.fade-in {
          opacity: 1;
          transform: translateY(0);
        }

        .hero-image.scrolled {
          transform: translateY(-20px);
          transition: transform 0.5s ease-out;
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        .hero-image:hover {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
