import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import HeroSection from "@/components/hero";
import StatsSection from "@/components/stats-section";
import HowItWorksSection from "@/components/how-it-works-section";
// import TestimonialsSection from "@/components/testimonials-section";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { features } from "@/data/features";
import { testimonial } from "@/data/testimonial";
import { faqs } from "@/data/faqs";
import { getUsersFeedback } from "@/actions/dashboard";

export default async function LandingPage() {
  const { feedbacks } = await getUsersFeedback();

  return (
    <>
      <div className="grid-background"></div>

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="w-full py-8 sm:py-12 md:py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 max-w-[90%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[1200px]">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter text-center mb-8 sm:mb-12">
            Powerful Features for Your Career Growth
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[1100px] mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-2 hover:border-primary transition-colors duration-300"
              >
                <CardContent className="p-4 sm:p-6 text-center flex flex-col items-center">
                  <div className="flex flex-col items-center justify-center">
                    {feature.icon}
                    <h3 className="text-lg sm:text-xl font-bold mb-2 mt-2">{feature.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-8 sm:py-12 md:py-16 lg:py-24 bg-muted/50 bg-gradient-to-br from-gray-900 via-gray-950 to-black">
        <div className="container mx-auto px-4 sm:px-6 max-w-[90%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[1200px]">
          <StatsSection />
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Testimonials Section
      <TestimonialsSection testimonials={testimonial} feedbacks={feedbacks} /> */}

      {/* FAQ Section */}
      <section className="w-full py-8 sm:py-12 md:py-16 lg:py-24 bg-gradient-to-br from-gray-900 via-gray-950 to-black">
        <div className="container mx-auto px-4 sm:px-6 max-w-[90%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[1200px]">
          <div className="text-center max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[800px] mx-auto mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              Frequently Asked Questions
            </h2>
            {/* <p className="text-sm sm:text-base text-muted-foreground">
              Find answers to common questions about our platform
            </p> */}
          </div>

          <div className="max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[800px] mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-sm sm:text-base">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm sm:text-base">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-gradient-to-br from-gray-900 via-gray-950 to-black">
        <div className="mx-auto py-12 sm:py-16 md:py-20 lg:py-24 gradient rounded-lg">
          <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[1000px] mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-primary-foreground">
              Ready to Accelerate Your Career?
            </h2>
            <p className="mx-auto max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[600px] text-sm sm:text-base md:text-lg text-primary-foreground/80">
              Join thousands of professionals who are advancing their careers
              with AI-powered guidance.
            </p>
            <Link href="/" passHref>
              <Button
                size="lg"
                variant="secondary"
                className="h-10 sm:h-11 mt-4 sm:mt-5 animate-bounce text-sm sm:text-base"
              >
                Start Your Journey Today <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
