import React, { useRef } from "react";
import { motion } from "framer-motion";

const Snivy = ({ user }) => {
  const imageRefs = useRef([]);

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.7 } },
    hover: {
      scale: 1.1,
      boxShadow: "0 0 20px rgba(0, 255, 0, 0.6)",
      transition: { duration: 0.3 },
    }, // Green hover effect
  };

  const gridVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, staggerChildren: 0.3 } },
  };

  const backgroundShine = {
    animate: {
      backgroundPosition: ["0% 0%", "200% 200%", "0% 0%"],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  return (
    <motion.div
      className="flex flex-col justify-center items-center min-h-screen padding20 relative overflow-hidden"
      style={{
        backgroundColor: user?.portfolio?.theme?.backgroundColor || "#0f0f0f",
        fontFamily: user?.portfolio?.theme?.font || "Creepster, cursive",
      }}
    >
      {/* Reflective background effect */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{
          background: "linear-gradient(135deg, #0f0 25%, rgba(0, 255, 0, 0.1) 50%, #0f0 75%)",
          backgroundSize: "800% 800%",
        }}
        variants={backgroundShine}
        animate="animate"
      />

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-7xl relative"
        initial="hidden"
        animate="visible"
        variants={gridVariants}
      >
        {user?.portfolio?.images && user?.portfolio?.images.length > 0 ? (
          user?.portfolio?.images.map((image, index) => (
            <motion.div
              key={index}
              className="relative w-full h-64 overflow-hidden shadow-lg"
              variants={imageVariants}
              whileHover={imageVariants.hover}
            >
              <motion.img
                ref={(el) => (imageRefs.current[index] = el)}
                src={image}
                alt={`Portfolio ${index}`}
                className="w-full h-full md:object-contain object-cover "
                whileHover={{ scale: 1.1 }}
              />
            </motion.div>
          ))
        ) : (
          <motion.p
            className="text-center text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5 } }}
            style={{
              color: user?.portfolio?.theme?.color || "#00ff00", // Green text color
            }}
          >
            No images available
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Snivy;
