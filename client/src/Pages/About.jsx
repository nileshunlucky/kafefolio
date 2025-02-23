import React, { useEffect, useRef, useState } from "react";

const About = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const isEventTracked = useRef(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://kafefolio-server.onrender.com/api/user/profile", {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch profile");

        setUser(data);
        setLoading(false); // Stop loading when data is available
      } catch (error) {
        console.error("Profile Fetch Error:", error);
        alert(error.message);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Analytics function
  async function trackEvent(eventType, details) {
    try {
      if (!user || !user._id) return;

      const response = await fetch("https://kafefolio-server.onrender.com/api/analytics/track", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user._id,
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
    if (user && !isEventTracked.current) {
      trackEvent("page_view", { page: "/about" });
      isEventTracked.current = true;
    }
  }, [user?._id]);

  return (
    <div
      className="flex justify-center items-center min-h-screen"
      style={{
        backgroundColor: user?.portfolio?.theme?.backgroundColor || "#f8f9fa",
        color: user?.portfolio?.theme?.color || "#333",
      }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-10 md:gap-20 w-full max-w-6xl p-8">
        {/* Image Section with Skeleton Loader */}
        {/* Image Section */}
        <div className="md:w-1/2 flex justify-center items-center relative padding20">
          {user?.about?.image ? (
            <img
              src={user?.about?.image}
              alt="Profile"
              className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-64 h-64 md:w-80 md:h-80 bg-zinc-200 animate-pulse rounded-lg shadow-lg"></div>
          )}
        </div>


        {/* Content Section */}
        <div className="md:w-1/2 w-3/4 flex flex-col gap-5 text-center md:text-left">
          <h1
            className="text-4xl md:text-6xl font-medium tracking-wide flex flex-col gap-2"
            style={{
              fontFamily: user?.portfolio?.theme?.font || "Arial",
              color: user?.portfolio?.theme?.color || "#333",
            }}
          >
            {loading ? (
              <div className="h-10 bg-gray-300 animate-pulse rounded-md w-3/4 mx-auto md:mx-0"></div>
            ) : (
              user?.about?.title || "Your Title Here"
            )}
            <div
              className="md:text-xl text-sm font-medium text-right"
              style={{
                fontFamily: user?.portfolio?.theme?.font || "Arial",
                color: user?.portfolio?.theme?.color || "#666",
              }}
            >
              {loading ? (
                <div className="h-6 bg-gray-300 animate-pulse rounded-md w-1/2 mx-auto md:mx-0"></div>
              ) : (
                `- ${user?.category || "Your Category Here"}`
              )}
            </div>
          </h1>

          <div
            className="text-lg md:text-xl leading-relaxed font-light"
            style={{
              fontFamily: user?.portfolio?.theme?.font || "Arial",
              color: user?.portfolio?.theme?.color || "#555",
            }}
          >
            {loading ? (
              <div className="flex flex-col gap-2">
                <div className="h-5 bg-gray-300 animate-pulse rounded-md w-full"></div>
                <div className="h-5 bg-gray-300 animate-pulse rounded-md w-3/4 mt-2"></div>
              </div>
            ) : (
              user?.about?.description ||
              "A brief description about yourself. This is where you can tell the world about your passions, your story, and what makes you unique."
            )}
          </div>

          {loading ? (
            <div className="h-10 bg-gray-300 animate-pulse rounded-md w-40 mx-auto md:mx-0"></div>
          ) : (
            user?.about?.resume && (
              <a target="_blank" rel="noopener noreferrer" href={user?.about?.resume}>
                <button
                  className="p-3 rounded-xl font-medium text-lg shadow-md cursor-pointer w-40"
                  style={{
                    backgroundColor: user?.portfolio?.theme?.color || "#000",
                    color: user?.portfolio?.theme?.backgroundColor || "#fff",
                    fontFamily: user?.portfolio?.theme?.font || "Arial",
                  }}
                >
                  Know More
                </button>
              </a>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default About;