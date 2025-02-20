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
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl"
        initial="hidden"
        animate="visible"
        variants={gridVariants}
      >
        {user?.portfolio?.images?.length > 0 ? (
          user.portfolio.images.map((image, index) => (
            <motion.div
              key={index}
              className="relative w-full h-72 rounded-lg overflow-hidden shadow-lg cursor-pointer"
              variants={fireEffectVariants}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 20px rgba(255, 99, 71, 0.6)",
                background: "rgba(255, 69, 0, 0.3)",
              }}
              whileTap="click"
            >
              <motion.img
                src={image}
                alt={`Portfolio ${index}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))
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

export default Moltres;
