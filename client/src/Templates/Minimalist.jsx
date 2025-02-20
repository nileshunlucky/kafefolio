import React from "react";
import { motion } from "framer-motion";

const Minimalist = ({ user }) => {
  const imageVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const images = user?.portfolio?.images || [];

  return (
    <div
      className="flex justify-center items-center min-h-screen "
      style={{
        backgroundColor: user?.portfolio?.theme?.backgroundColor,
        color: user?.portfolio?.theme?.color,
        fontFamily: user?.portfolio?.theme?.font,
      }}
    >
      {images.length === 1 ? (
        <motion.div
          className="w-full h-screen overflow-hidden shadow-lg"
          initial="hidden"
          animate="visible"
          variants={imageVariants}
        >
          <motion.img
            src={images[0]}
            alt="Portfolio Image"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            whileHover={{ scale: 1.1 }}
          />
        </motion.div>
      ) : images.length > 1 ? (
        <motion.div
          className="grid md:grid-cols-2 grid-cols-1 w-full"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
          }}
        >
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-500"
              variants={imageVariants}
            >
              <motion.img
                src={image}
                alt={`Portfolio ${index}`}
                className="w-full h-full md:object-cover object-contain hover:scale-105 transition-transform duration-500"
                whileHover={{ scale: 1.1 }}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.p
          className="text-center text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5 } }}
        >
          No images available
        </motion.p>
      )}
    </div>
  );
};

export default Minimalist;
