import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

const Moltres = ({ user }) => {
  const backgroundRef = useRef(null);

  useEffect(() => {
    if (backgroundRef.current) {
      gsap.to(backgroundRef.current, {
        background: "linear-gradient(45deg, #ff4500, #ff6347, #ff8c00, #ff4500)",
        backgroundSize: "300% 300%",
        duration: 6,
        ease: "linear",
        repeat: -1,
        yoyo: true,
      });
    }
  }, []);

  const fireEffectVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1 } },
    click: {
      scale: 1.2,
      boxShadow: "0 0 50px rgba(255, 69, 0, 0.8)",
      backgroundColor: "black",
      transition: { duration: 0.3 },
      filter: "grayscale(100%)",
    },
  };

  const gridVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.3, duration: 1 } },
  };

  // Function to check if a media file is a video
  const isVideo = (file) => {
    const videoExtensions = ["mp4", "webm", "ogg", "mov", "avi", "mkv", "flv", "wmv", "m4v"];
    const fileExtension = file?.split(".").pop().toLowerCase();
    return videoExtensions.includes(fileExtension);
  };

  return (
    <div
      className="flex flex-col items-center min-h-screen padding20"
      ref={backgroundRef}
      style={{
        backgroundColor: "#1a0000",
        color: user?.portfolio?.theme?.color || "#fff",
        fontFamily: user?.portfolio?.theme?.font || "Arial, sans-serif",
      }}
    >
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 w-full max-w-5xl"
        initial="hidden"
        animate="visible"
        variants={gridVariants}
      >
        {user?.portfolio?.media?.length > 0 ? (
          user?.portfolio?.media.map((media, index) => (
            <motion.div
              key={index}
              className="relative w-full md:h-80 rounded-lg overflow-hidden shadow-lg cursor-pointer"
              variants={fireEffectVariants}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 20px rgba(255, 99, 71, 0.6)",
                background: "rgba(255, 69, 0, 0.3)",
              }}
              whileTap="click"
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
                  className="w-full h-full md:object-cover object-contain"
                />
              )}
            </motion.div>
          ))
        ) : (
          <motion.p
            className="text-center text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5 } }}
            style={{ color: user?.portfolio?.theme?.color || "#fff" }}
          >
            No media available
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default Moltres;
