import React, { useEffect, useState, useRef } from "react";
import { Outlet, useParams } from "react-router-dom";

// Import your templates
import Classic from "../Templates/Classic";
import Minimalist from "../Templates/Minimalist";
import Modern from "../Templates/Modern";
import Custom from "../Templates/Custom";
import Kafefolio from "../Templates/Kafefolio";
import Vampire from "../Templates/Vampire";
import Frozen from "../Templates/Frozen";
import Snivy from "../Templates/Snivy";
import Cloyster from "../Templates/Cloyster";
import Moltres from "../Templates/Moltres";

const Portfolio = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const isEventTracked = useRef(false); // To ensure events are tracked only once

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://kafefolio-server.onrender.com/api/user/${username}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [username]);

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
    // Ensure user and user._id are loaded before tracking the event
    if (user && user._id && !isEventTracked.current) {
      trackEvent("page_view", { page: "/home" });
      isEventTracked.current = true;
    }
  }, [user?._id]);

  if (!user) {
    return <div className="flex flex-col justify-center items-center gap-2 h-screen padding10">
      <div className="w-full h-1/3 bg-zinc-300 animate-pulse"></div>
      <div className="w-full h-1/3 bg-zinc-300 animate-pulse"></div>
      <div className="w-full h-1/3 bg-zinc-300 animate-pulse"></div>
    </div>
  }

  // Render the template dynamically
  const renderTemplate = () => {
    const template = user.portfolio?.template;

    switch (template) {
      case "Classic":
        return <Classic user={user} />;
      case "Modern":
        return <Modern user={user} />;
      case "Minimalist":
        return <Minimalist user={user} />;
      case "Custom":
        return <Custom user={user} />;
      case "Kafefolio":
        return <Kafefolio user={user} />;
      case "Vampire":
        return <Vampire user={user} />;
      case "Frozen":
        return <Frozen user={user} />;
      case "Snivy":
        return <Snivy user={user} />;
      case "Cloyster":
        return <Cloyster user={user} />;
      case "Moltres":
        return <Moltres user={user} />;
      default:
        return <div>Template not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto shadow-lg bg-white rounded-lg p-6">
        {renderTemplate()}
      </div>
      {/* Pass user to Outlet via context */}
      <Outlet context={{ user }} />
    </div>
  );
};

export default Portfolio;
