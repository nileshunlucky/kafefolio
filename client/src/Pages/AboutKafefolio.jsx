import React from 'react';
import { motion } from 'framer-motion';

const AboutKafefolio = () => {
    return (
        <motion.div
            className="flex justify-center items-center min-h-screen padding20 text-[#ffe6a7]"
            initial={{ backgroundPosition: "0% 50%" }}
            animate={{ backgroundPosition: "100% 50%" }}
            transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
            style={{
                background: "linear-gradient(-45deg, #1A0D08, #432818, #99582a, #1A0D08)",
                backgroundSize: "300% 300%",
            }}
        >
            {/* close */}
            <p onClick={() => window.history.back()} className='text-[#ffe6a7] cursor-pointer absolute top-5 left-5 text-lg underline'>Close</p>
            <div className="flex flex-col gap-10 Montserrat margint">
                <div className="flex flex-col gap-3">
                    <h1 className="text-3xl font-medium">About <span className='Pacifico font-extralight'>Kafefolio</span></h1>
                    <p className="text-lg leading-relaxed">
                        <span className='Pacifico font-extralight'>Kafefolio</span> is a cutting-edge portfolio SaaS platform designed to help creators, influencers,
                        and professionals showcase their work effortlessly. Our mission is to provide a seamless,
                        elegant, and highly customizable experience for building stunning digital portfolios.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <h2 className="text-2xl font-semibold">Why Choose <span className='Pacifico font-extralight'>Kafefolio</span>?</h2>
                    <ul className='text-lg flex flex-col gap-2'>
                        <li>☕ Fully customizable templates to match your personal brand</li>
                        <li>☕ Seamless integration with social media and external links</li>
                        <li>☕ Responsive design for an optimal experience on any device</li>
                        <li>☕ Easy-to-use interface—no coding skills required</li>
                        <li>☕ Secure and fast hosting for a smooth user experience</li>
                    </ul>
                </div>

                <div className="flex flex-col gap-3">
                    <h2 className="text-2xl font-semibold">Our Vision</h2>
                    <p className="text-lg mt-4">
                        We believe that everyone deserves a premium online presence, whether you're a freelancer,
                        entrepreneur, or creative artist. <span className='Pacifico font-extralight'>Kafefolio</span> empowers users to tell their story in the most
                        visually stunning and professional way possible.
                    </p>
                    <p className='text-right Pacifico font-extralight text-xl'> - Kafefolio</p>
                </div>
            </div>
        </motion.div>
    );
};

export default AboutKafefolio;
