"use client";
import AllPageContent from "@/components/AllPageContent";
import Search from "@/components/Search";
import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { useDebounce } from "react-use";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setdebouncedSearchTerm] = useState("");

  useDebounce(() => setdebouncedSearchTerm(searchTerm), 675, [searchTerm]);

  return (
    <main className="flex flex-col w-full">
      <div className="text-center p-3 max-md:p-2">
        <p className="text-4xl max-md:text-3xl font-bold">ClassConnect</p>
      </div>
      <Search
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        className="text-center"
      />
      <AllPageContent searchTerm={debouncedSearchTerm}></AllPageContent>
      <Toaster
        richColors
        expand={false}
        closeButton={true}
        position="bottom-center"
        duration={3000}
      />
    </main>
  );
}
