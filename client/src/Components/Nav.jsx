import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";


const Nav = ({ user }) => {
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    // Toggle body overflow when the menu is opened or closed
    if (showMenu) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Cleanup function to remove class on unmount
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showMenu]);

  const trackSocialClick = async (platform) => {
    try {
      await fetch("https://kafefolio-server.onrender.com/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    <nav
      className={`flex justify-between items-center padding20`}
      style={{ backgroundColor: user?.portfolio.theme.color, color: user?.portfolio.theme.backgroundColor, fontFamily: user?.portfolio.theme.font }}>
      <Link to={`/${user.username}`}>
        <h1
          className={`font-medium text-2xl whitespace-nowrap`}
          style={{ fontFamily: user?.portfolio.theme.font }}
        >
          {user.name}
        </h1>
      </Link>

      {/* Desktop Menu */}
      <ul
        className={`hidden md:flex items-center gap-5 text-lg`}
      // text-lg tracking-wide
      >
        <Link style={{ fontFamily: user?.portfolio.theme.font }} to={`/${user.username}`}>Home</Link>
        <Link style={{ fontFamily: user?.portfolio.theme.font }} to={`/${user.username}/about`}>About</Link>
        <Link style={{ fontFamily: user?.portfolio.theme.font }} to={`/${user.username}/links`}>Links</Link>
        {/* <Link style={{ fontFamily: user?.portfolio.theme.font }} to={`/${user.username}/service`}>Service</Link> */}
        <Link style={{ fontFamily: user?.portfolio.theme.font }} to={`/${user.username}/contact`}>Contact</Link>
      </ul>

      {/* Hamburger Icon (Mobile) */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="md:hidden text-2xl cursor-pointer"
      >
        <i className="fa-solid fa-bars-staggered" />
      </button>

      {/* Mobile Menu */}
      {showMenu && (
        <div
          className={`fixed top-0 left-0 w-full h-full text-white bg-opacity-90 flex md:hidden flex-col gap-5 z-50`}
          style={{
            backgroundColor: user?.portfolio.theme.backgroundColor,
            color: user?.portfolio.theme.color,
            fontFamily: user?.portfolio.theme.font
          }}>
          {/* Close Button */}
          <div
            className="flex items-center gap-5 padding20 border-b-2 cursor-pointer"
            onClick={() => setShowMenu(false)}
          >
            <i className="fa-solid fa-chevron-left" />
            <p className="text-xl" style={{ fontFamily: user?.portfolio.theme.font }}>Close</p>
          </div>

          {/* Mobile Links */}
          <ul className="flex flex-col gap-5 padding20 h-[75%] justify-center items-center text-2xl">
            <Link onClick={() => setShowMenu(false)} to={`/${user.username}`}
              style={{ fontFamily: user?.portfolio.theme.font }}>
              Home
            </Link>
            <Link
              onClick={() => setShowMenu(false)}
              to={`/${user.username}/about`}
              style={{ fontFamily: user?.portfolio.theme.font }}>
              About
            </Link>
            <Link
              onClick={() => setShowMenu(false)}
              to={`/${user.username}/links`}
              style={{ fontFamily: user?.portfolio.theme.font }}>
              Links
            </Link>
            {/* <Link
              onClick={() => setShowMenu(false)}
              to={`/${user.username}/service`}
              style={{ fontFamily: user?.portfolio.theme.font }}>
              Service
            </Link> */}
            <Link
              onClick={() => setShowMenu(false)}
              to={`/${user.username}/contact`}
              style={{ fontFamily: user?.portfolio.theme.font }}>
              Contact
            </Link>
          </ul>
          {/* Social Media */}
          <div className="flex flex-col justify-center items-center gap-3 padding20">
            {
              user?.social && (user?.social.facebook || user?.social.instagram || user?.social.threads || user?.social.X || user?.social.linkedIn || user?.social.snapchat || user?.social.youtube) && <p className="font-medium text-left w-full text-xl"
                style={{ fontFamily: user?.portfolio.theme.font }}>Follow Me</p>
            }

            <div className="flex justify-center gap-5 text-3xl">
              {
                user?.social?.facebook && <a href={user?.social?.facebook} target="_blank" rel="noopener noreferrer"><i onClick={() => trackSocialClick("Facebook")} className="fa-brands fa-facebook" /></a>
              }
              {
                user?.social?.instagram && <a href={user?.social?.instagram} target="_blank" rel="noopener noreferrer"><i onClick={() => trackSocialClick("Instagram")}className="fa-brands fa-instagram" /></a>
              }
              {
                user?.social?.threads && <a href={user?.social?.threads} target="_blank" rel="noopener noreferrer"><i onClick={() => trackSocialClick("Threads")}className="fa-brands fa-threads" /></a>
              }
              {
                user?.social?.X && <a href={user?.social?.X} target="_blank" rel="noopener noreferrer">
                  <i onClick={() => trackSocialClick("X")} className="fa-brands fa-x-twitter" /></a>
              }
              {
                user?.social?.linkedIn && <a href={user?.social?.linkedIn} target="_blank" rel="noopener noreferrer"><i onClick={() => trackSocialClick("LinkedIn")} className="fa-brands fa-linkedin" /></a>
              }
              {
                user?.social?.snapchat && <a href={user?.social?.snapchat} target="_blank" rel="noopener noreferrer"><i onClick={() => trackSocialClick("Snapchat")} className="fa-brands fa-snapchat" /></a>
              }
              {
                user?.social?.youtube && <a href={user?.social?.youtube} target="_blank" rel="noopener noreferrer"><i onClick={() => trackSocialClick("Youtube")} className="fa-brands fa-youtube" /></a>
              }
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;