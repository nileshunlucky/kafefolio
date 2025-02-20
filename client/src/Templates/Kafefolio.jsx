import React from "react";
import { motion } from "framer-motion";

const Kafefolio = ({ user }) => {
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#432818] to-[#a86a3d]">
      {user?.portfolio?.images?.length === 1 ? (
        // Single Image: Full screen height
        <motion.div
          className="w-full h-screen overflow-hidden"
          initial="hidden"
          animate="visible"
          variants={imageVariants}
        >
          <motion.img
            src={user?.portfolio?.images[0]}
            alt="Portfolio"
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
          />
        </motion.div>
      ) : (
        // Multiple Images: Grid layout
        <motion.div
          className="grid md:grid-cols-3 grid-cols-1 gap-3 max-w-7xl padding10"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
          }}
        >
          {user?.portfolio?.images && user?.portfolio?.images.length > 0 ? (
            user?.portfolio?.images.map((image, index) => (
              <motion.div
                key={index}
                className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-500"
                variants={imageVariants}
              >
                <motion.img
                  src={image}
                  alt={`Portfolio ${index}`}
                  className="w-full h-full md:object-cover object-contain"
                  whileHover={{ scale: 1.1 }}
                />
              </motion.div>
            ))
          ) : (
            <motion.p
              className="text-center col-span-full text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.5 } }}
              style={{ color: user?.portfolio?.theme?.color }}
            >
              No images available
            </motion.p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Kafefolio;