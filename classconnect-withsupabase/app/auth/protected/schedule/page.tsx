"use client";
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import DesktopLayout from "@/components/DesktopLayout";
import MobileLayout from "@/components/MobileLayout";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setdebouncedSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useDebounce(() => setdebouncedSearchTerm(searchTerm), 675, [searchTerm]);

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
      <div className="w-full">
        <MobileLayout
          searchTerm={debouncedSearchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <DesktopLayout
        searchTerm={debouncedSearchTerm}
        setSearchTerm={setSearchTerm}
      />
    </div>
  );
}
