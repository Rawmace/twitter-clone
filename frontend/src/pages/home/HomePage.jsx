import { useState } from "react";
import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
  const [feedType, setFeedType] = useState("forYou");

  return (
    <div className="flex-[4_4_0] w-full md:mr-auto border-r border-gray-700 min-h-screen">
      {/* Header - Enhanced for better mobile contrast */}
      <div className="flex w-full border-b border-gray-700 sticky top-0 bg-black z-20 backdrop-blur-sm">
        <div
          className={`flex justify-center flex-1 p-3 hover:bg-gray-800/50 transition duration-300 cursor-pointer relative ${
            feedType === "forYou" ? "text-white" : "text-gray-400"
          }`}
          onClick={() => setFeedType("forYou")}
        >
          <span className="text-sm md:text-base font-medium">
            For you
            {feedType === "forYou" && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 md:w-20 h-1 rounded-full bg-blue-500"></div>
            )}
          </span>
        </div>
        <div
          className={`flex justify-center flex-1 p-3 hover:bg-gray-800/50 transition duration-300 cursor-pointer relative ${
            feedType === "following" ? "text-white" : "text-gray-400"
          }`}
          onClick={() => setFeedType("following")}
        >
          <span className="text-sm md:text-base font-medium">
            Following
            {feedType === "following" && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 md:w-20 h-1 rounded-full bg-blue-500"></div>
            )}
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
        {/* Create Post - Added mobile padding */}
        <div className="py-3 md:py-4 border-b border-gray-700">
          <CreatePost />
        </div>

        {/* Posts - Added scroll area */}
        <div className="overflow-y-auto h-[calc(100vh-145px)] md:h-[calc(100vh-160px)]">
          <Posts feedType={feedType} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
