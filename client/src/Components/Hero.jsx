import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate(); 

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/login');
    };

    return (
        <div className='hero-bg md:h-screen text-[#ffe6a7] flex justify-center items-center'>
            <div className="md:flex items-center gap-5">
                <div className="md:w-[50%] flex flex-col md:gap-5 justify-center items-start h-screen">
                    <div className="padding20">
                        <h1 className='md:text-5xl text-4xl font-extrabold'>Everything you are. In one, simple Portfolio in bio.</h1>
                    </div>
                    <div className="padding20">
                        <p>Kafefolio for their portfolio in bio. One portfolio to help you share everything you create, curate and sell from your Instagram, TikTok, Twitter, YouTube and other social media profiles.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="flex md:flex-row flex-col items-center gap-5 padding20">
                        <div className="flex items-center w-[100%] bg-[#99582a] padding20 rounded-xl">
                            <h1>Kafefolio.vercel.app/</h1>
                            <input className='focus:outline-none w-[100%]' type="text" placeholder='yourname' required />
                        </div>

                        <button type='submit' className='bg-[#ffe6a7] text-[#432818] w-full cursor-pointer whitespace-nowrap padding20 rounded-xl'>Claim your Kafefolio</button>
                    </form>
                </div>

                <div className="md:w-[50%] md:flex hidden justify-center items-center">
                    <img className='md:h-screen w-screen object-contain' src="/kafeHero.png" alt="banner" />
                </div>
            </div>
        </div>
    )
}

export default Hero;