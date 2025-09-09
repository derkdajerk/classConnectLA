"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LearnMorePage() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-pink-100 via-white to-purple-100 flex flex-col items-center px-6 py-12">
      <div className="absolute top-4 left-4 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-semibold text-xl text-gray-800 hover:text-purple-600 transition-all duration-200 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 hover:bg-white/30"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          ClassConnectLA
        </Link>
      </div>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl"
      >
        <Link href={"/"}>
          <h1 className="text-5xl font-extrabold text-purple-700 mb-4">
            ClassConnectLA
          </h1>
        </Link>
        <p className="text-lg text-gray-700 mb-6">
          <span className="font-semibold">The</span> dance class app built{" "}
          <span className="font-semibold">by dancers, for dancers</span>. Find,
          save, and plan your LA dance classes without the chaos.
        </p>
        <Link href={"/sign-up"}>
          <Button
            size="lg"
            className="rounded-2xl bg-purple-600 hover:bg-purple-700"
          >
            Sign up free • Become an early tester
          </Button>
        </Link>
        <br />
        <Link href={"/login"}>
          <Button
            size="lg"
            variant={"ghost"}
            className="text-purple-700 text-xs hover:bg-transparent"
          >
            Already have an account? Login here
          </Button>
        </Link>
      </motion.section>

      {/* About / Story Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-12 max-w-4xl text-center"
      >
        <h2 className="text-3xl font-bold mb-4 text-gray-900">
          Why I built this
        </h2>
        <p className="text-gray-700 leading-relaxed">
          After two years of bouncing between LA studios, juggling apps, and
          scrolling through endless Instagram pages just to plan my week, I
          realized how annoying the process was.
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
        className="mt-12 grid md:grid-cols-2 gap-12 max-w-5xl w-full"
      >
        {/* Feature 1 */}
        <div className="flex flex-col items-center text-center">
          <div className="w-200 h-200 bg-purple-200 rounded-2xl flex items-center justify-center mb-4">
            <Image
              src="/base screen.webp"
              alt="ClassConnect Schedule"
              width={200}
              height={200}
            />
          </div>
          <h3 className="text-xl font-semibold">All Studios in One Place</h3>
          <p className="text-gray-600 mt-2">
            Stop jumping between apps and accounts. Browse LA’s top studios
            right here.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col items-center text-center">
          <div className="w-200 h-200 bg-purple-200 rounded-2xl flex items-center justify-center mb-4">
            <Image
              src="/save screen.webp"
              alt="ClassConnect Save"
              width={200}
              height={200}
            />
          </div>
          <h3 className="text-xl font-semibold">Save Your Classes</h3>
          <p className="text-gray-600 mt-2">
            Bookmark classes you want to take and keep your schedule organized.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-center text-center">
          <div className="w-200 h-200 bg-yellow-200 rounded-2xl flex items-center justify-center mb-4">
            <Image
              src="/Calendar screen.webp"
              alt="ClassConnect Calendar"
              width={200}
              height={200}
            />
          </div>
          <h3 className="text-xl font-semibold">Stay in Sync</h3>
          <p className="text-gray-600 mt-2">
            Calendar-friendly and easy to integrate with your dance life.
          </p>
        </div>

        {/* Feature 4 */}
        <div className="flex flex-col items-center text-center">
          <div className="w-200 h-200 rounded-2xl flex items-center justify-center mb-4">
            <Image
              src="/high five.svg"
              alt="ClassConnect By Dancers"
              className="rounded-2xl"
              width={200}
              height={200}
            />
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
        className="mt-16 text-center"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to make your dance life easier?
        </h2>
        <Link href={"/sign-up"}>
          <Button
            size="lg"
            className="rounded-2xl bg-purple-600 hover:bg-purple-700"
          >
            Sign up free • Early tester
          </Button>
        </Link>
        <p className="text-gray-500 mt-3">
          Be one of the first to try ClassConnectLA.
        </p>
      </motion.section>
    </main>
  );
}
