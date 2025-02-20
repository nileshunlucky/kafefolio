import React, { useEffect, useRef, useState } from "react";

const About = () => {
  const [user, setUser] = useState(null);
  const isEventTracked = useRef(false); // To ensure events are tracked only once

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch("/api/user/profile", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch profile");

        setUser(data);
      } catch (error) {
        console.error("Profile Fetch Error:", error);
        alert(error.message); // Replace with a toast library for better UX
      }
    };
    fetchUserProfile();
  }, []);

  // Analytics function
  async function trackEvent(eventType, details) {
    try {
      if (!user || !user._id) {
        console.error("User ID is missing. Cannot track event.");
        return;
      }

      const response = await fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      trackEvent("page_view", { page: "/about" });
      isEventTracked.current = true; // Mark the event as tracked
    }
  }, [user?._id]); // Only track changes based on user ID

  return (
    <div
      className="flex justify-center items-center min-h-screen"
      style={{
        backgroundColor: user?.portfolio?.theme?.backgroundColor,
        color: user?.portfolio?.theme?.color,
      }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-10 md:gap-20 w-full max-w-6xl p-8">
        {/* Image Section */}
        <div className="md:w-1/2 flex justify-center items-center relative padding20">
          <img
            className="relative z-10 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 object-contain"
            src={user?.about?.image}
            alt="Profile"
          />
        </div>

        {/* Content Section */}
        <div className="md:w-1/2 w-3/4 flex flex-col gap-5 text-center md:text-left marginb">
          <h1
            className="text-4xl md:text-6xl font-medium tracking-wide mb-5"
            style={{
              fontFamily: user?.portfolio?.theme?.font,
              color: user?.portfolio?.theme?.color,
            }}
          >
            {user?.about?.title || "Your Title Here"}
            <p
              className="md:text-xl text-sm font-medium text-right"
              style={{
                fontFamily: user?.portfolio?.theme?.font,
                color: user?.portfolio?.theme?.color,
              }}
            >
              - {user?.category || "Your Category Here"}
            </p>
          </h1>
          <p
            className="text-lg md:text-xl leading-relaxed font-light"
            style={{
              fontFamily: user?.portfolio?.theme?.font,
              color: user?.portfolio?.theme?.color,
            }}
          >
            {user?.about?.description ||
              "A brief description about yourself. This is where you can tell the world about your passions, your story, and what makes you unique."}
          </p>
          {user?.about?.resume && (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={user?.about?.resume}
              className="inline-block"
            >
              <button
                className="padding10 rounded-xl font-medium text-lg shadow-md cursor-pointer w-full"
                style={{
                  backgroundColor: user?.portfolio?.theme?.color,
                  color: user?.portfolio?.theme?.backgroundColor,
                  fontFamily: user?.portfolio?.theme?.font,
                }}
              >
                Know More
              </button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default About;