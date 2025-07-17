import ClassScrollBar from "@/components/ClassScrollBar";
import React from "react";
import { DanceClass } from "../lib/danceclass";

interface StudioVisibility {
  MDC: boolean;
  TMILLY: boolean;
  ML: boolean;
  PLAYGROUND: boolean;
  EIGHTYEIGHT: boolean;
}

interface ClassContentProps {
  danceClassMDC: DanceClass[];
  danceClassTMILLY: DanceClass[];
  danceClassML: DanceClass[];
  danceClassEIGHTYEIGHT: DanceClass[];
  danceClassPLAYGROUND: DanceClass[];
  searchTerm: string;
  studioVisibility: StudioVisibility;
}

const ClassContent: React.FC<ClassContentProps> = ({
  danceClassMDC,
  danceClassTMILLY,
  danceClassML,
  danceClassEIGHTYEIGHT,
  danceClassPLAYGROUND,
  searchTerm,
  studioVisibility,
}) => (
  <div className="grid grid-flow-col auto-cols-max pt-2 overflow-x-auto px-4 max-w-full">
    {studioVisibility.PLAYGROUND && (
      <ClassScrollBar
        studioName="PLAYGROUND"
        danceClassList={danceClassPLAYGROUND}
        isSearchTerm={Boolean(searchTerm?.trim())}
      />
    )}
    {studioVisibility.MDC && (
      <ClassScrollBar
        studioName="MDC"
        danceClassList={danceClassMDC}
        isSearchTerm={Boolean(searchTerm?.trim())}
      />
    )}
    {studioVisibility.TMILLY && (
      <ClassScrollBar
        studioName="TMILLY"
        danceClassList={danceClassTMILLY}
        isSearchTerm={Boolean(searchTerm?.trim())}
      />
    )}
    {studioVisibility.ML && (
      <ClassScrollBar
        studioName="ML"
        danceClassList={danceClassML}
        isSearchTerm={Boolean(searchTerm?.trim())}
      />
    )}
    {studioVisibility.EIGHTYEIGHT && (
      <ClassScrollBar
        studioName="EIGHTYEIGHT"
        danceClassList={danceClassEIGHTYEIGHT}
        isSearchTerm={Boolean(searchTerm?.trim())}
      />
    )}
  </div>
);

export default ClassContent;
