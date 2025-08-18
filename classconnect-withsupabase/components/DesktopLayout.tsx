"use client";

import React from "react";
import AllPageContent from "./AllPageContent";
import Search from "./Search";

interface DesktopLayoutProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  debouncedSearchTerm: string;
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  searchTerm,
  setSearchTerm,
  debouncedSearchTerm,
}) => {
  return (
    <main className="flex flex-col w-full">
      <Search
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        className="text-center"
      />
      <AllPageContent searchTerm={debouncedSearchTerm} />
    </main>
  );
};

export default DesktopLayout;
