import React from "react";
import { motion } from "framer-motion";

const Kafefolio = ({ user }) => {
  const mediaVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#432818] to-[#a86a3d]">
      {user?.portfolio?.media?.length === 1 ? (
        // Single Media: Full screen height
        <motion.div
          className="w-full h-screen overflow-hidden"
          initial="hidden"
          animate="visible"
          variants={mediaVariants}
        >
          {user?.portfolio?.media[0]?.endsWith(".mp4") ? (
            <motion.video
              src={user?.portfolio?.media[0]}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
            />
          ) : (
            <motion.img
              src={user?.portfolio?.media[0]}
              alt="Portfolio"
              className="w-full h-full object-cover"
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
                {media.endsWith(".mp4") ? (
                  <motion.video
                    src={media}
                    className="w-full h-full md:object-cover object-contain"
                    autoPlay
                    loop
                    muted
                  />
                ) : (
                  <motion.img
                    src={media}
                    alt={`Portfolio ${index}`}
                    className="w-full h-full md:object-cover object-contain"
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
              style={{ color: user?.portfolio?.theme?.color }}
            >
              No media available
            </motion.p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Kafefolio;
