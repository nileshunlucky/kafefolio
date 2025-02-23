import React, { useEffect, useState, useRef } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

const Links = () => {
  const [user, setUser] = useState(null);
  const [share, setShare] = useState(false);
  const isEventTracked = useRef(false); // To ensure events are tracked only once

  useEffect(() => {
    // Toggle body overflow when the menu is opened or closed
    if (share) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Cleanup function to remove class on unmount
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [share]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('https://kafefolio-server.onrender.com/api/user/profile', {
          method: 'GET',
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch profile');

        setUser(data);
      } catch (error) {
        console.error('Profile Fetch Error:', error);
        toast.error(error.message);
      }
    };

    fetchUserProfile();
  }, []);

  async function trackEvent(eventType, details) {
    try {
      if (!user || !user._id) {
        console.error("User ID is missing. Cannot track event.");
        return;
      }

      const response = await fetch("https://kafefolio-server.onrender.com/api/analytics/track", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user._id, // Use user ID
          eventType,
          details,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        console.error("Failed to track event:", await response.json());
      }
    } catch (error) {
      console.error("Failed to track event:", error);
    }
  }

  useEffect(() => {
    // Track analytics event when the page is loaded
    if (user && !isEventTracked.current) {
      trackEvent("page_view", { page: "/links" });
      isEventTracked.current = true; // Mark the event as tracked
    }
  }, [user?._id]); // Only track changes based on user ID

  const trackSocialClick = async (platform) => {
    try {
      await fetch("https://kafefolio-server.onrender.com/api/analytics/track", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user?._id, // Track based on user ID
          eventType: "social_click",
          platform, // Example: "Instagram"
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Failed to track social click:", error);
    }
  };
  return (
    <div
      className="flex md:items-center justify-center min-h-screen noscrollbar scroll-smooth z-50"
      style={{
        backgroundColor: user?.portfolio?.theme?.backgroundColor,
        color: user?.portfolio?.theme?.color
      }}
    >
      {
        user?.isPro && user?.linkMedia && (
          <>
            {
              user?.linkMedia.includes("video") ? (
                <video
                  src={user?.linkMedia}
                  muted
                  autoPlay
                  loop
                  className="w-full fixed top-0 left-0 h-screen object-cover"
                />
              ) : (
                <img
                  src={user?.linkMedia}
                  alt="Preview"
                  className="w-full fixed top-0 left-0 h-screen object-cover"
                />
              )
            }
          </>
        )
      }
      <Toaster />
      <div className="md:w-1/2 w-[90%] flex flex-col gap-5 marginy z-10">
        {/* Share */}
        <div className="flex justify-end cursor-pointer">
          <i onClick={() => setShare(!share)} className="fa-solid fa-ellipsis  paddingo rounded-full "
            style={{
              color: user?.portfolio?.theme?.backgroundColor,
              backgroundColor: user?.portfolio?.theme?.color
            }} />

          {
            share && (
              <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50">
                <div className="flex flex-col gap-5 padding20 rounded-xl shadow-lg w-[80%] md:w-[40%]"
                  style={{ backgroundColor: user?.portfolio?.theme?.color, color: user?.portfolio?.theme?.backgroundColor }}>
                  {/* Header */}
                  <div className="flex justify-center items-center relative">
                    <div className=""></div>
                    <h1 className="text-xl font-medium text-center whitespace-nowrap" style={{ fontFamily: user?.portfolio?.theme?.font }}>Share Kafefolio</h1>
                    <i onClick={() => setShare(!share)} className="fa-solid fa-x text-sm padding10 absolute right-0" />
                  </div>

                  {/* Profile */}
                  <div className="flex flex-col gap-3 justify-center items-center">
                    <img className='w-24 h-24 object-cover rounded-full' src={user?.profilePic} alt="pic" />
                    <p style={{ fontFamily: user?.portfolio?.theme?.font }}>@{user?.username}</p>
                  </div>

                  {/* Social Media */}
                  <div className="">
                    <div className="flex gap-5 items-center overflow-x-scroll overflow-y-hidden noscrollbar scroll-smooth padding10">
                      {/* Copy Link */}
                      <div onClick={() => navigator.clipboard.writeText(window.location.href)} className="flex flex-col items-center justify-center gap-2">
                        <div className="">
                          <i className="fa-solid fa-link bg-black text-white paddingo rounded-full" />
                        </div>
                        <div className="">
                          <p style={{ fontFamily: user?.portfolio?.theme?.font }} className="text-sm font-medium whitespace-nowrap">Copy link</p>
                        </div>
                      </div>

                      {/* Whatsapp */}
                      <div onClick={() => window.open(`https://wa.me/?text=${window.location.href}`)} className="flex flex-col items-center justify-center gap-2">
                        <div className="">
                          <i className="fa-brands fa-whatsapp bg-green-500 text-white text-2xl padding10 rounded-full" />
                        </div>
                        <div className="">
                          <p style={{ fontFamily: user?.portfolio?.theme?.font }} className="text-sm font-medium">WhatsApp</p>
                        </div>
                      </div>

                      {/* Facebook */}
                      <div onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`)} className="flex flex-col items-center justify-center gap-2">
                        <div className="">
                          <i className="fa-brands fa-facebook bg-blue-500 text-white text-2xl padding10 rounded-full" />
                        </div>
                        <div className="">
                          <p style={{ fontFamily: user?.portfolio?.theme?.font }} className="text-sm font-medium">Facebook</p>
                        </div>
                      </div>

                      {/* Instagram */}
                      <div onClick={() => window.open(`https://www.instagram.com/sharer/sharer.php?u=${window.location.href}`)} className="flex flex-col items-center justify-center gap-2">
                        <div className="">
                          <i className="fa-brands fa-instagram bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-500
                           text-white text-2xl padding10 rounded-full" />
                        </div>
                        <div className="">
                          <p style={{ fontFamily: user?.portfolio?.theme?.font }} className="text-sm font-medium">Instagram</p>
                        </div>
                      </div>

                      {/* X */}
                      <div onClick={() => window.open(`https://www.x.com/share?url=${window.location.href}`)} className="flex flex-col items-center justify-center gap-2">
                        <div className="">
                          <i className="fa-brands fa-x-twitter bg-black text-white text-2xl padding10 rounded-full" />
                        </div>
                        <div className="">
                          <p style={{ fontFamily: user?.portfolio?.theme?.font }} className="text-sm font-medium">X</p>
                        </div>
                      </div>

                      {/* Threads */}
                      <div onClick={() => window.open(`https://www.threads.net/share?text=${window.location.href}`)} className="flex flex-col items-center justify-center gap-2">
                        <div className="">
                          <i className="fa-brands fa-threads bg-black text-white text-2xl padding10 rounded-full" />
                        </div>
                        <div className="">
                          <p style={{ fontFamily: user?.portfolio?.theme?.font }} className="text-sm font-medium">Threads</p>
                        </div>
                      </div>

                      {/* Linkedin */}
                      <div onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`)} className="flex flex-col items-center justify-center gap-2">
                        <div className="">
                          <i className="fa-brands fa-linkedin bg-blue-700 text-white text-2xl padding10 rounded-full" />
                        </div>
                        <div className="">
                          <p style={{ fontFamily: user?.portfolio?.theme?.font }} className="text-sm font-medium">Linkedin</p>
                        </div>
                      </div>

                      {/* Snapchat */}
                      <div onClick={() => window.open(`https://www.snapchat.com/share?url=${window.location.href}`)} className="flex flex-col items-center justify-center gap-2">
                        <div className="">
                          <i className="fa-brands fa-snapchat bg-[#FFFF00] text-white text-2xl padding10 rounded-full" />
                        </div>
                        <div className="">
                          <p style={{ fontFamily: user?.portfolio?.theme?.font }} className="text-sm font-medium">Snapchat</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}
        </div>
        {/* Profile */}
        <div className="flex flex-col justify-center text-center items-center gap-3">
          <img
            src={user?.profilePic}
            alt={user?.username || 'User profile'}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div className="flex items-center gap-1">
            <h1 className="text-xl font-medium" style={{ fontFamily: user?.portfolio?.theme?.font }}>@{user?.username}</h1>
            {
              user?.isPro && (
                <img className='w-6' src="/blueTick.png" alt="verify" />
              )
            }
          </div>
          <p style={{ fontFamily: user?.portfolio?.theme?.font }}>{user?.bio}</p>
        </div>
        {/* Links */}
        <div className="flex flex-col gap-3">
          {user?.links?.length > 0 ? (
            user.links.map((link, index) => (
              <a key={index} href={link.url} target="_blank" rel="noopener noreferrer">
                <div className="flex justify-between gap-3 border-2 padding10 rounded-full"
                  style={{ hover: { backgroundColor: user?.portfolio?.theme?.color } }}>
                  <h1 className="text-lg font-medium text-center w-full"
                    style={{ fontFamily: user?.portfolio?.theme?.font }}>{link.text}</h1>
                </div>
              </a>
            ))
          ) : (
            <p className="text-center text-gray-500"
              style={{ fontFamily: user?.portfolio?.theme?.font }}>No links available</p>
          )}
        </div>
        {/* Social Media */}
        {
          <div className="flex justify-center items-center gap-5 text-3xl">
            {/* Facebook */}
            {user?.social?.facebook && (
              <a onClick={() => trackSocialClick('Facebook')} href={user?.social?.facebook} target='_blank' rel="noopener noreferrer"><div className="">
                <i className="fa-brands fa-facebook" />
              </div></a>
            )}
            {/* Instagram */}
            {user?.social?.instagram && (
              <a onClick={() => trackSocialClick('Instagram')} href={user?.social?.instagram} target='_blank' rel="noopener noreferrer"><div className="">
                <i className="fa-brands fa-instagram" />
              </div></a>
            )}
            {/* Threads */}
            {user?.social?.threads && (
              <a onClick={() => trackSocialClick('Threads')} href={user?.social?.threads} target='_blank' rel="noopener noreferrer"><div className="">
                <i className="fa-brands fa-threads" />
              </div></a>
            )}
            {/* X */}
            {user?.social?.X && (
              <a onClick={() => trackSocialClick('X')} href={user?.social?.X} target='_blank' rel="noopener noreferrer"><div className="">
                <i className="fa-brands fa-x-twitter" />
              </div></a>
            )}
            {/* Snapchat */}
            {user?.social?.snapchat && (
              <a onClick={() => trackSocialClick('Snapchat')} href={user?.social?.snapchat} target='_blank' rel="noopener noreferrer"><div className="">
                <i className="fa-brands fa-snapchat" />
              </div></a>
            )}
            {/* Youtube */}
            {user?.social?.youtube && (
              <a onClick={() => trackSocialClick('Youtube')} href={user?.social?.youtube} target='_blank' rel="noopener noreferrer"><div className="">
                <i className="fa-brands fa-youtube" />
              </div></a>
            )}
            {/* Linkedin */}
            {user?.social?.linkedIn && (
              <a onClick={() => trackSocialClick('LinkedIn')} href={user?.social?.linkedIn} target='_blank' rel="noopener noreferrer"><div className="">
                <i className="fa-brands fa-linkedin" />
              </div></a>
            )}
            {/* Pinterest */}
            {user?.social?.pinterest && (
              <a onClick={() => trackSocialClick('Pinterest')} href={user?.social?.pinterest} target='_blank' rel="noopener noreferrer"><div className="">
                <i className="fa-brands fa-pinterest" />
              </div></a>
            )}
            {/* Tiktok */}
            {user?.social?.tiktok && (
              <a onClick={() => trackSocialClick('Tiktok')} href={user?.social?.tiktok} target='_blank' rel="noopener noreferrer"><div className="">
                <i className="fa-brands fa-tiktok" />
              </div></a>
            )}
            {/* Onlyfans */}
            {user?.social?.onlyfans && (
              <a onClick={() => trackSocialClick('Onlyfans')} href={user?.social?.onlyfans} target='_blank' rel="noopener noreferrer"><div className="">
                <img onClick={() => trackSocialClick("OnlyFans")} className="w-10 h-10" src="https://images.seeklogo.com/logo-png/52/2/onlyfans-logo-png_seeklogo-527484.png" alt="onlyfans" />
              </div></a>
            )}
          </div>
        }
      </div>

      {/* Join Kafefolio */}
      {!user?.isPro && (
        <div className="fixed bottom-10">
          <button onClick={() => window.open('https://kafefolio.vercel.app', '_blank')} className='flex items-center gap-2 font-medium w-full cursor-pointer whitespace-nowrap padding10 rounded-full'
            style={{
              fontFamily: user?.portfolio?.theme?.font,
              backgroundColor: user?.portfolio?.theme?.color,
              color: user?.portfolio?.theme?.backgroundColor
            }}>
            <img className='w-10' src={'/kafefolio.png' || hidden} alt="logo" />
            Kafefolio.vercel.app/you</button>
        </div>
      )}
    </div>
  );
};

export default Links;
