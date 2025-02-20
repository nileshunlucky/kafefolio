import React, { useState, useEffect, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";

const Contact = () => {
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
      trackEvent("page_view", { page: "/contact" });
      isEventTracked.current = true; // Mark the event as tracked
    }
  }, [user?._id]); // Only track changes based on user ID

  return (
    <div
      className="flex justify-center items-center min-h-screen "
      style={{ color: user?.portfolio.theme.color, fontFamily: user?.portfolio.theme.font, backgroundColor: user?.portfolio.theme.backgroundColor }}
    >
      <Toaster />
      <div
        className="shadow-2xl rounded-xl text-center w-4/5 md:w-1/3 flex flex-col  paddingt"
        style={{
          backgroundColor: user?.portfolio.theme.backgroundColor,
          color: user?.portfolio.theme.color,
        }}
      >
        <h1 className="text-2xl font-medium mb-4" style={{ color: user?.portfolio.theme.color, fontFamily: user?.portfolio.theme.font }}>
          Get In Touch
        </h1>
        <p className="mb-6 padding20" style={{ color: user?.portfolio.theme.color, fontFamily: user?.portfolio.theme.font }}>
          Click the button below to email me directly. I'd love to hear from you!
        </p>
        <button
          onClick={() => window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${user?.email}`, "_blank")}
          className="w-full padding10 rounded-b-xl font-medium text-lg hover:scale-105 hover:rounded-xl transform transition duration-500 cursor-pointer"
          style={{ backgroundColor: user?.portfolio.theme.color, color: user?.portfolio.theme.backgroundColor, fontFamily: user?.portfolio.theme.font }}
        >
          Email Me
        </button>
      </div>
    </div>
  );
};

export default Contact;
