import { Checkbox } from "./ui/checkbox";
import React from "react";

const TOP_ROW = ["MDC", "TMILLY", "ML"] as const;
const BOTTOM_ROW = ["PLAYGROUND", "EIGHTYEIGHT", "THESIX"] as const;

type StudioName = (typeof TOP_ROW | typeof BOTTOM_ROW)[number];

interface ClassCheckBoxesProps {
  onVisibilityChange: (studioName: StudioName, checked: boolean) => void;
}

export default function ClassCheckBoxes({
  onVisibilityChange,
}: ClassCheckBoxesProps) {
  const renderRow = (row: readonly StudioName[]) => (
    <div className="grid grid-cols-3 gap-4 w-full">
      {row.map((studioName) => (
        <div key={studioName} className="flex items-center space-x-2 w-full">
          <Checkbox
            id={studioName}
            defaultChecked={row === TOP_ROW}
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

  return (
    <div className="mt-5 space-y-4">
      {renderRow(TOP_ROW)}
      {renderRow(BOTTOM_ROW)}
    </div>
  );
}
