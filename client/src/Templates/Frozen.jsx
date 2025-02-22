import React, { useState } from "react";
import { motion } from "framer-motion";

const Frozen = ({ user }) => {
  const [frozenImages, setFrozenImages] = useState({});

  const toggleFreeze = (index) => {
    setFrozenImages((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.7 } },
    hover: { scale: 1.05, boxShadow: "0 0 20px rgba(173, 216, 230, 0.8)" },
  };

  const freezeVariants = {
    frozen: { filter: "blur(3px) brightness(0.5)" },
    normal: { filter: "none", scale: 1 },
  };

  const gridVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, staggerChildren: 0.3 } },
  };

  return (
    <div
      className="relative flex flex-col justify-center items-center min-h-screen padding20 overflow-hidden"
      style={{
        backgroundColor: user?.portfolio?.theme?.backgroundColor || "#001f33",
        color: user?.portfolio?.theme?.color || "#add8e6",
        fontFamily: user?.portfolio?.theme?.font || "Snowburst One, cursive",
      }}
    >
      {/* Cool Freezing Background Animation */}
      <motion.div
        className="absolute inset-0 bg-blue-900"
        initial={{ opacity: 0.2 }}
        animate={{
          opacity: [0.2, 0.4, 0.3, 0.5],
          filter: ["blur(4px)", "blur(6px)", "blur(3px)"],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-7xl z-10"
        initial="hidden"
        animate="visible"
        variants={gridVariants}
      >
        {user?.portfolio?.media?.length > 0 ? (
          user?.portfolio?.media.map((media, index) => (
            <motion.div
              key={index}
              className="w-full md:h-96 overflow-hidden shadow-lg relative rounded-lg"
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              whileHover={!frozenImages[index] && imageVariants.hover}
              onTap={() => toggleFreeze(index)}
            >
              {/\.(mp4|mov|avi|webm)$/i.test(media) ? (
                <motion.video
                  src={media}
                  muted
                  autoPlay
                  loop
                  className="w-full h-full object-cover"
                />
              ) : (
                <motion.img
                  src={media}
                  alt={`Portfolio ${index}`}
                  className="w-full h-full object-cover"
                  variants={freezeVariants}
                  animate={frozenImages[index] ? "frozen" : "normal"}
                />
              )}

              {frozenImages[index] && (
                <motion.div
                  className="absolute inset-0 bg-blue-300/40 backdrop-blur-sm flex justify-center items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </motion.div>
          ))
        ) : (
          <motion.p
            className="text-center text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5 } }}
          >
            No media available
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default Frozen;
