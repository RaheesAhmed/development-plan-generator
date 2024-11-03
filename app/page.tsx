"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent mb-6">
            Transform Your Leadership Journey
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover your leadership potential through our AI-powered assessment
            platform. Get personalized insights and development plans tailored
            to your career goals.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/sign-up">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg">
                Get Started
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" className="px-8 py-6 text-lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Our Platform?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "AI-Powered Insights",
                description:
                  "Get detailed analysis of your leadership style and potential using advanced AI algorithms.",
              },
              {
                title: "Personalized Development",
                description:
                  "Receive customized development plans based on your assessment results and career goals.",
              },
              {
                title: "Track Progress",
                description:
                  "Monitor your growth with regular assessments and progress tracking tools.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Start Your Leadership Journey?
          </h2>
          <p className="text-xl mb-8 text-indigo-100">
            Join thousands of professionals who have transformed their
            leadership capabilities with our platform.
          </p>
          <Link href="/sign-up">
            <Button className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-6 text-lg">
              Start Free Assessment
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
