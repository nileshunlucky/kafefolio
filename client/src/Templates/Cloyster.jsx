import React, { useState } from "react";
import { motion } from "framer-motion";

const Cloyster = ({ user }) => {
  const [clickedIndex, setClickedIndex] = useState(null);

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.7 } },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  const shineEffect = (index) => {
    setClickedIndex(index);
    setTimeout(() => setClickedIndex(null), 1000);
  };

  return (
    <div className="shiny-bg min-h-screen flex flex-col items-center justify-center p-10">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-5xl w-full">
        {user?.portfolio?.images?.map((image, index) => (
          <motion.div
            key={index}
            className="relative w-full h-64 overflow-hidden shadow-lg cursor-pointer"
            initial="hidden"
            animate="visible"
            variants={imageVariants}
            whileHover={imageVariants.hover}
            onClick={() => shineEffect(index)}
          >
            <motion.img
              src={image}
              alt={`Portfolio ${index}`}
              className="w-full h-full object-cover"
            />
            {clickedIndex === index && (
              <motion.div
                className="absolute inset-0 shine-effect"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Cloyster;
