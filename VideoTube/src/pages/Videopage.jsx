import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { VideoPlayer, RecommendedVideos, Comments } from "@/comps/Compiled.js";

const Videopage = () => {
  const { videoId } = useParams();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-black px-6 py-4 flex h-full">
      <div className="main-video-container flex-1 mr-4">
        <VideoPlayer videoId={videoId} />
        <Comments videoId={videoId} className = "no-scrollbar overflow-y-auto"/>
      </div>
      <div
        className={`sidebar no-scrollbar overflow-y-auto transition-all duration-500 ${
          isExpanded ? "w-1/3" : "w-1/4"
        }`}
      >
        <RecommendedVideos />
      </div>
    </div>
  );
};

export default Videopage;
