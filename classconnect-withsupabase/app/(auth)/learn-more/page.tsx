/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function LearnMorePage() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-pink-100 via-white to-purple-100 flex flex-col items-center px-6 py-12">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl"
      >
        <h1 className="text-5xl font-extrabold text-purple-700 mb-4">
          ClassConnectLA
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          A dance class app built{" "}
          <span className="font-semibold">by dancers, for dancers</span>. Find,
          save, and plan your LA dance classes without the chaos.
        </p>
        <Button
          size="lg"
          className="rounded-2xl bg-purple-600 hover:bg-purple-700"
        >
          Sign up free • Become an early tester
        </Button>
      </motion.section>

      {/* About / Story Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-20 max-w-4xl text-center"
      >
        <h2 className="text-3xl font-bold mb-4 text-gray-900">
          Why I built this
        </h2>
        <p className="text-gray-700 leading-relaxed">
          I’ve been dancing in LA for years, bouncing between multiple studios,
          scrolling through different apps and Instagram pages just to plan my
          week. It was frustrating, so I decided to fix it.
          <br />
          <br />
          ClassConnectLA is my way of simplifying it all. One place to discover
          classes, bookmark your favorites, and stay on top of your dance
          schedule.
        </p>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-24 grid md:grid-cols-2 gap-12 max-w-5xl w-full"
      >
        {/* Feature 1 */}
        <div className="flex flex-col items-center text-center">
          <div className="w-40 h-40 bg-purple-200 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-purple-600 font-bold">[Screenshot Here]</span>
          </div>
          <h3 className="text-xl font-semibold">All Studios in One Place</h3>
          <p className="text-gray-600 mt-2">
            Stop jumping between apps and accounts. Browse LA’s top studios
            right here.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col items-center text-center">
          <div className="w-40 h-40 bg-pink-200 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-pink-600 font-bold">[Illustration]</span>
          </div>
          <h3 className="text-xl font-semibold">Save Your Classes</h3>
          <p className="text-gray-600 mt-2">
            Bookmark classes you want to take and keep your schedule organized.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-center text-center">
          <div className="w-40 h-40 bg-yellow-200 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-yellow-600 font-bold">[Screenshot Here]</span>
          </div>
          <h3 className="text-xl font-semibold">Stay in Sync</h3>
          <p className="text-gray-600 mt-2">
            Calendar-friendly and easy to integrate with your dance life.
          </p>
        </div>

        {/* Feature 4 */}
        <div className="flex flex-col items-center text-center">
          <div className="w-40 h-40 bg-blue-200 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-blue-600 font-bold">[Illustration]</span>
          </div>
          <h3 className="text-xl font-semibold">By Dancers, For Dancers</h3>
          <p className="text-gray-600 mt-2">
            I know the struggle first-hand. That’s why this app is built with
            you in mind.
          </p>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-24 text-center"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to make your dance life easier?
        </h2>
        <Button
          size="lg"
          className="rounded-2xl bg-purple-600 hover:bg-purple-700"
        >
          Sign up free • Early tester
        </Button>
        <p className="text-gray-500 mt-3">
          Be one of the first to try ClassConnectLA.
        </p>
      </motion.section>
    </main>
  );
}
