/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DanceClass } from "@/types/danceClass";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  HeartOff,
  Search,
  Calendar,
  Clock,
  User,
  Trash2,
  CheckSquare,
  Square,
} from "lucide-react";
import { toast } from "sonner";
import { removeClassFromBookmarks } from "@/lib/classfunctions";
import Link from "next/link";
import MobileLayoutSavedClasses from "@/components/MobileLayoutSavedClasses";

interface BookmarkedClass extends DanceClass {
  bookmarked_at?: string;
}

export default function BookmarksPage() {
  const [savedClasses, setSavedClasses] = useState<BookmarkedClass[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<BookmarkedClass[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudio, setSelectedStudio] = useState<string>("all");
  const [sortBy, setSortBy] = useState<
    "date" | "time" | "studio" | "instructor"
  >("date");
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(
    new Set()
  );
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Get current user
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

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

  // Fetch bookmarked classes with full class details
  useEffect(() => {
    if (!userId) return;

    const loadBookmarkedClasses = async () => {
      setIsLoading(true);
      try {
        const supabase = createClient();

        // Get bookmarked class IDs with timestamp
        const { data: bookmarkData, error: bookmarkError } = await supabase
          .from("bookmarks")
          .select("class_id, created_at")
          .eq("user_id", userId);

        if (bookmarkError) throw bookmarkError;

        if (!bookmarkData || bookmarkData.length === 0) {
          setSavedClasses([]);
          setFilteredClasses([]);
          return;
        }

        // Get full class details for bookmarked classes
        const classIds = bookmarkData.map((item) => item.class_id);
        const { data: classData, error: classError } = await supabase
          .from("danceClassStorage")
          .select("*")
          .in("class_id", classIds);

        if (classError) throw classError;

        // Combine bookmark data with class data
        const enrichedClasses: BookmarkedClass[] = (classData || []).map(
          (classItem) => {
            const bookmark = bookmarkData.find(
              (b) => b.class_id === classItem.class_id
            );
            return {
              ...classItem,
              bookmarked_at: bookmark?.created_at,
            };
          }
        );

        setSavedClasses(enrichedClasses);
        setFilteredClasses(enrichedClasses);
      } catch (error) {
        console.error("Failed to load bookmarked classes:", error);
        toast.error("Failed to load your saved classes");
      } finally {
        setIsLoading(false);
      }
    };

    loadBookmarkedClasses();
  }, [userId]);

  // Filter and sort classes
  useEffect(() => {
    let filtered = [...savedClasses];

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (cls) =>
          cls.classname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cls.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cls.studio_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply studio filter
    if (selectedStudio !== "all") {
      filtered = filtered.filter((cls) => cls.studio_name === selectedStudio);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "time":
          return a.time.localeCompare(b.time);
        case "studio":
          return a.studio_name.localeCompare(b.studio_name);
        case "instructor":
          return a.instructor.localeCompare(b.instructor);
        default:
          return 0;
      }
    });

    setFilteredClasses(filtered);
  }, [savedClasses, searchTerm, selectedStudio, sortBy]);

  // Get unique studios for filter
  const studios = Array.from(
    new Set(savedClasses.map((cls) => cls.studio_name))
  );

  // Format time for display
  const formatTime = (time: string): string => {
    const hours = parseInt(time.slice(0, 2));
    return hours > 12
      ? `${hours - 12}${time.slice(2, 5)} PM`
      : hours === 12
      ? `${hours}${time.slice(2, 5)} PM`
      : hours < 10
      ? `${hours}${time.slice(2, 5)} AM`
      : `${hours}${time.slice(2, 5)} AM`;
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString + "T00:00:00");
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Remove from bookmarks
  const handleRemoveBookmark = async (classId: string, className: string) => {
    if (!userId) return;

    try {
      await removeClassFromBookmarks(userId, classId);
      setSavedClasses((prev) => prev.filter((cls) => cls.class_id !== classId));
      toast.success(`${className} removed from bookmarks`);
    } catch (error) {
      console.error("Failed to remove bookmark:", error);
      toast.error("Failed to remove bookmark");
    }
  };

  // Toggle selection mode
  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedClasses(new Set());
  };

  // Toggle class selection
  const toggleClassSelection = (classId: string) => {
    const newSelected = new Set(selectedClasses);
    if (newSelected.has(classId)) {
      newSelected.delete(classId);
    } else {
      newSelected.add(classId);
    }
    setSelectedClasses(newSelected);
  };

  // Select all classes
  const selectAllClasses = () => {
    const allIds = new Set(filteredClasses.map((cls) => cls.class_id));
    setSelectedClasses(allIds);
  };

  // Deselect all classes
  const deselectAllClasses = () => {
    setSelectedClasses(new Set());
  };

  // Bulk remove selected classes
  const handleBulkRemove = async () => {
    if (!userId || selectedClasses.size === 0) return;

    try {
      const classesToRemove = Array.from(selectedClasses);

      // Remove all selected classes
      await Promise.all(
        classesToRemove.map((classId) =>
          removeClassFromBookmarks(userId, classId)
        )
      );

      // Update state
      setSavedClasses((prev) =>
        prev.filter((cls) => !selectedClasses.has(cls.class_id))
      );
      setSelectedClasses(new Set());
      setIsSelectionMode(false);

      toast.success(
        `${classesToRemove.length} ${
          classesToRemove.length === 1 ? "class" : "classes"
        } removed from bookmarks`
      );
    } catch (error) {
      console.error("Failed to remove bookmarks:", error);
      toast.error("Failed to remove some bookmarks");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              Loading your saved classes...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const pageContent = (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-2">My Saved Classes</h1>
      <p className="text-muted-foreground pb-1">
        {savedClasses.length === 0
          ? "You haven't saved any classes yet."
          : `You have ${savedClasses.length} saved ${
              savedClasses.length === 1 ? "class" : "classes"
            }.`}
      </p>

      {savedClasses.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No saved classes yet</h3>
            <p className="text-muted-foreground mb-4">
              Start exploring classes and save your favorites to see them here.
            </p>
            <Button asChild>
              <Link href="/schedule">Browse Classes</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Bulk Actions Header */}
          {savedClasses.length > 1 && (
            <div className="mb-4 flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-4">
                <Button
                  variant={isSelectionMode ? "destructive" : "outline"}
                  size="sm"
                  onClick={toggleSelectionMode}
                  className="gap-2"
                >
                  {isSelectionMode ? (
                    <>
                      <Square className="h-4 w-4" />
                      Cancel Selection
                    </>
                  ) : (
                    <>
                      <CheckSquare className="h-4 w-4" />
                      Select Multiple
                    </>
                  )}
                </Button>

                {isSelectionMode && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={
                        selectedClasses.size === filteredClasses.length
                          ? deselectAllClasses
                          : selectAllClasses
                      }
                      className="gap-2"
                    >
                      {selectedClasses.size === filteredClasses.length
                        ? "Deselect All"
                        : "Select All"}
                    </Button>

                    {selectedClasses.size > 0 && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleBulkRemove}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove ({selectedClasses.size})
                      </Button>
                    )}
                  </>
                )}
              </div>

              {isSelectionMode && (
                <p className="text-sm text-muted-foreground">
                  {selectedClasses.size} of {filteredClasses.length} selected
                </p>
              )}
            </div>
          )}

          {/* Filters and Search */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search classes, instructors, or studios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Studio Filter */}
              <select
                value={selectedStudio}
                onChange={(e) => setSelectedStudio(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="all">All Studios</option>
                {studios.map((studio) => (
                  <option key={studio} value={studio}>
                    {studio}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="date">Sort by Date</option>
                <option value="time">Sort by Time</option>
                <option value="studio">Sort by Studio</option>
                <option value="instructor">Sort by Instructor</option>
              </select>
            </div>

            {/* Results summary */}
            {filteredClasses.length !== savedClasses.length && (
              <p className="text-sm text-muted-foreground">
                Showing {filteredClasses.length} of {savedClasses.length} saved
                classes
              </p>
            )}
          </div>

          {/* Classes Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredClasses.map((danceClass) => {
              const isSelected = selectedClasses.has(danceClass.class_id);
              return (
                <Card
                  key={danceClass.class_id}
                  className={`relative hover:shadow-md transition-all cursor-pointer ${
                    isSelectionMode
                      ? isSelected
                        ? "ring-2 ring-primary bg-primary/5"
                        : "hover:ring-1 hover:ring-muted-foreground/20"
                      : ""
                  }`}
                  onClick={
                    isSelectionMode
                      ? () => toggleClassSelection(danceClass.class_id)
                      : undefined
                  }
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {isSelectionMode && (
                          <div className="flex items-center">
                            {isSelected ? (
                              <CheckSquare className="h-5 w-5 text-primary" />
                            ) : (
                              <Square className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                        )}
                        <Badge variant="secondary" className="mb-2">
                          {danceClass.studio_name}
                        </Badge>
                      </div>
                      {!isSelectionMode && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveBookmark(
                              danceClass.class_id,
                              danceClass.classname
                            );
                          }}
                          className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                        >
                          <HeartOff className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <CardTitle className="text-lg leading-tight">
                      {danceClass.classname}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{danceClass.instructor}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(danceClass.date)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {formatTime(danceClass.time)} • {danceClass.length}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="font-semibold text-lg">
                        {typeof danceClass.price === "number"
                          ? danceClass.price.toFixed(2)
                          : danceClass.price}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* No results state */}
          {filteredClasses.length === 0 && savedClasses.length > 0 && (
            <Card className="text-center py-8">
              <CardContent>
                <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No classes found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters to find classes.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );

  return (
    <>
      {isMobile ? (
        <MobileLayoutSavedClasses>{pageContent}</MobileLayoutSavedClasses>
      ) : (
        pageContent
      )}
    </>
  );
}
