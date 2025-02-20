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
        const response = await fetch(`https://kafefolio-server.onrender.com/api/user/${username}`);
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        setUser(data);

        // Track initial page view
        await trackEvent("page_view", {
          username: data?.username,
          template: data?.portfolio?.template,
          page: "portfolio",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, [username]);

  const trackEvent = async (eventType, details) => {
    try {
      if (!user || !user._id) {
        console.error("User ID is missing. Cannot track event.");
        return;
      }

      const response = await fetch("https://kafefolio-server.onrender.com/api/analytics/track", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
  };

  useEffect(() => {
    // Track a general page view event when user data is loaded
    if (user && !isEventTracked.current) {
      trackEvent("page_view", { page: "/home" });
      isEventTracked.current = true;
    }
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  // Render the template dynamically and track template-specific analytics
  const renderTemplate = () => {
    const template = user.portfolio.template;

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
      <div className="max-w-7xl mx-auto shadow-lg bg-white rounded-lg p-6">
        {renderTemplate()}
      </div>
      {/* Pass user to Outlet via context */}
      <Outlet context={{ user }} />
    </div>
  );
};

export default Portfolio;