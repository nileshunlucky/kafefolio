import React, { useState } from "react";
import { motion } from "framer-motion";

const Frozen = ({ user }) => {
  const [frozenImages, setFrozenImages] = useState({}); // Track frozen state of images

  const toggleFreeze = (index) => {
    setFrozenImages((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle freeze state for the tapped image
    }));
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.7 } },
    hover: { scale: 1.05, boxShadow: "0 0 20px rgba(173, 216, 230, 0.8)" },
  };

  const freezeVariants = {
    frozen: { filter: "blur(3px) grayscale(0.7) brightness(0.6)", scale: 0.95 },
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
      {/* Snowfall Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="snow"></div>
        <div className="snow snow2"></div>
      </div>

      <motion.div
        className="grid gap-5 w-full max-w-7xl z-10"
        initial="hidden"
        animate="visible"
        variants={gridVariants}
      >
        {user?.portfolio?.images && user?.portfolio?.images.length > 0 ? (
          user?.portfolio?.images.map((image, index) => {
            if (index % 3 === 0) {
              return (
                <motion.div
                  key={index}
                  className="w-full md:h-96 overflow-hidden shadow-lg relative rounded-lg"
                  variants={imageVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={!frozenImages[index] && imageVariants.hover}
                  onTap={() => toggleFreeze(index)}
                >
                  <motion.img
                    src={image}
                    alt={`Portfolio ${index}`}
                    className="w-full h-full object-cover"
                    variants={freezeVariants}
                    animate={frozenImages[index] ? "frozen" : "normal"}
                  />
                  {frozenImages[index] && (
                    <motion.div
                      className="absolute inset-0 bg-blue-300/40 backdrop-blur-sm flex justify-center items-center "
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}
                </motion.div>
              );
            }

            if (index % 3 === 1) {
              const smallImages = user?.portfolio?.images.slice(index, index + 2);
              return (
                <div key={`grid-${index}`} className="grid grid-cols-2 gap-3">
                  {smallImages.map((smallImage, subIndex) => (
                    <motion.div
                      key={`${index}-${subIndex}`}
                      className="md:h-96 w-full overflow-hidden shadow-lg rounded-lg relative"
                      variants={imageVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover={!frozenImages[index + subIndex] && imageVariants.hover}
                      onTap={() => toggleFreeze(index + subIndex)}
                    >
                      <motion.img
                        src={smallImage}
                        alt={`Portfolio ${index + subIndex}`}
                        className="w-full h-full object-cover"
                        variants={freezeVariants}
                        animate={frozenImages[index + subIndex] ? "frozen" : "normal"}
                      />
                      {frozenImages[index + subIndex] && (
                        <motion.div
                          className="absolute inset-0 bg-blue-300/40 backdrop-blur-sm flex justify-center items-center rounded-lg"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              );
            }

            return null; // Skip unnecessary rendering
          })
        ) : (
          <motion.p
            className="text-center text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5 } }}
          >
            No images available
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default Frozen;
