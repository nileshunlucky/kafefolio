import React from "react";
import { motion } from "framer-motion";

const Classic = ({ user }) => {
  const mediaVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Function to check if a media file is a video
  const isVideo = (file) => {
    const videoExtensions = ["mp4", "webm", "ogg", "mov", "avi", "mkv", "flv", "wmv", "m4v"];
    const fileExtension = file?.split(".").pop().toLowerCase();
    return videoExtensions.includes(fileExtension);
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen"
      style={{
        backgroundColor: user?.theme?.backgroundColor,
        color: user?.theme?.color,
        fontFamily: user?.theme?.font,
      }}
    >
      {user?.portfolio?.media?.length === 1 ? (
        // Single Media: Full screen height
        <motion.div
          className="w-full h-screen overflow-hidden"
          initial="hidden"
          animate="visible"
          variants={mediaVariants}
        >
          {isVideo(user?.portfolio?.media[0]) ? (
            <motion.video
              src={user?.portfolio?.media[0]}
              muted
              loop
              autoPlay
              className="w-full h-full object-cover"
            />
          ) : (
            <motion.img
              src={user?.portfolio?.media[0]}
              alt="Portfolio"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              whileHover={{ scale: 1.1 }}
            />
          )}
        </motion.div>
      ) : (
        // Multiple Media: Grid layout
        <motion.div
          className="grid md:grid-cols-3 grid-cols-1 gap-3 max-w-7xl padding10"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
          }}
        >
          {user?.portfolio?.media && user?.portfolio?.media.length > 0 ? (
            user?.portfolio?.media.map((media, index) => (
              <motion.div
                key={index}
                className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-500"
                variants={mediaVariants}
              >
                {isVideo(media) ? (
                  <motion.video
                    src={media}
                    muted
                    loop
                    autoPlay
                    className="w-full h-full md:object-cover object-contain"
                  />
                ) : (
                  <motion.img
                    src={media}
                    alt={`Portfolio ${index}`}
                    className="w-full h-full md:object-cover object-contain hover:scale-105 transition-transform duration-500"
                    whileHover={{ scale: 1.1 }}
                  />
                )}
              </motion.div>
            ))
          ) : (
            <motion.p
              className="text-center col-span-full text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.5 } }}
            >
              No media available
            </motion.p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Classic;
