import React from "react";
import { motion } from "framer-motion";

const Vampire = ({ user }) => {
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.7 } },
    hover: { scale: 1.05, boxShadow: "0 0 20px rgba(255, 0, 0, 0.6)" },
  };

  const gridVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, staggerChildren: 0.3 } },
  };

  return (
    <div
      className="flex flex-col justify-center items-center min-h-screen padding10"
      style={{
        backgroundColor: user?.portfolio?.theme?.backgroundColor || "#0f0f0f",
        color: user?.portfolio?.theme?.color || "#f00",
        fontFamily: user?.portfolio?.theme?.font || "Creepster, cursive",
      }}
    >

      <motion.div
        className="grid gap-5 w-full max-w-7xl"
        initial="hidden"
        animate="visible"
        variants={gridVariants}
      >
        {user?.portfolio?.images && user?.portfolio?.images.length > 0 ? (
          user?.portfolio?.images.map((image, index) => {
            // Large single image
            if (index % 3 === 0) {
              return (
                <motion.div
                  key={index}
                  className="w-full h-96 overflow-hidden shadow-lg"
                  variants={imageVariants}
                  whileHover={imageVariants.hover}
                >
                  <motion.img
                    src={image}
                    alt={`Portfolio ${index}`}
                    className="w-full h-full md:object-contain object-cover"
                    whileHover={{ scale: 1.1 }}
                  />
                </motion.div>
              );
            }

            // Grid of 2 smaller images
            if (index % 3 === 1) {
              const smallImages = user?.portfolio?.images.slice(index, index + 2);
              return (
                <div key={`grid-${index}`} className="grid grid-cols-2 gap-3">
                  {smallImages.map((smallImage, subIndex) => (
                    <motion.div
                      key={index + subIndex}
                      className="h-48 overflow-hidden shadow-lg"
                      variants={imageVariants}
                      whileHover={imageVariants.hover}
                    >
                      <motion.img
                        src={smallImage}
                        alt={`Portfolio ${index + subIndex}`}
                        className="w-full h-full md:object-contain object-cover"
                        whileHover={{ scale: 1.1 }}
                      />
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
            style={{ color: user?.portfolio?.theme?.color || "#fff" }}
          >
            No images available
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default Vampire;