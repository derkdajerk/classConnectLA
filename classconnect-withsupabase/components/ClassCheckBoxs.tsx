import { Checkbox } from "./ui/checkbox";
import React from "react";

// Define studio names as constant to ensure type safety
const STUDIO_NAMES = [
  "MDC",
  "TMILLY",
  "ML",
  "PLAYGROUND",
  "EIGHTYEIGHT",
] as const;
type StudioName = (typeof STUDIO_NAMES)[number];

interface ClassCheckBoxesProps {
  onVisibilityChange: (studioName: StudioName, checked: boolean) => void;
}

export default function ClassCheckBoxes({
  onVisibilityChange,
}: ClassCheckBoxesProps) {
  return (
    <div className="grid grid-cols-6 gap-4 mt-5">
      {STUDIO_NAMES.map((studioName, idx) => (
        <div
          key={studioName}
          className={`flex items-center space-x-2 ${
            idx < 3 ? "col-span-2" : "col-span-3"
          }`}
        >
          <Checkbox
            id={studioName}
            defaultChecked={idx < 3}
            onCheckedChange={(checked: boolean) =>
              onVisibilityChange(studioName, checked)
            }
          />
          <label
            htmlFor={studioName}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {studioName}
          </label>
        </div>
      ))}
    </div>
  );
}
