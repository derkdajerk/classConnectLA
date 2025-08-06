"use client";
import { useEffect, useState } from "react";
import DesktopLayout from "@/components/DesktopLayout";
import MobileLayout from "@/components/MobileLayout";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setdebouncedSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Implement proper debouncing with useEffect and setTimeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setdebouncedSearchTerm(searchTerm);
    }, 750);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    // Function to check if screen is mobile size
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Render either mobile or desktop layout based on screen size
  if (isMobile) {
    return (
      <MobileLayout
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        debouncedSearchTerm={debouncedSearchTerm}
      />
    );
  }

  return (
    <div className="w-full">
      <DesktopLayout
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        debouncedSearchTerm={debouncedSearchTerm}
      />
    </div>
  );
}
