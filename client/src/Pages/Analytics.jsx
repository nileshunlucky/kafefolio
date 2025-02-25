import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const Analytics = () => {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

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
        setUser(data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load user profile.");
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (user?._id) {
      const fetchAnalytics = async () => {
        try {
          const response = await fetch(`https://kafefolio-server.onrender.com/api/analytics/user/${user._id}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch analytics data");
          }
          const data = await response.json();
          setAnalytics(data);
        } catch (err) {
          console.error("Error fetching analytics:", err);
          setError("Failed to load analytics data.");
        } finally {
          setLoading(false);
        }
      };

      fetchAnalytics();
    }
  }, [user?._id]);

  if (loading) {
    return (
      <div className="flex flex-col gap-2 justify-center items-center h-screen ">
        {/* Coffee Cup */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }}
          className="relative"
        >
          <img
            src="https://i.pinimg.com/originals/33/a5/d5/33a5d563b09c60db33a18a6be523c8a6.gif"
            alt="Loading coffee"
            className="w-24 h-24"
          />
        </motion.div>

        {/* Loading Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }}
          className="mt-3 text-[#432818] text-lg font-medium Montserrat"
        >
          Brewing your experience...
        </motion.p>
      </div>
    );
  }

  const aggregatedData = Array.isArray(analytics)
    ? analytics.reduce((acc, event) => {
      if (event.details && event.details.page) { // Ensure details and page exist
        const found = acc.find((item) => item.page === event.details.page); // Group by 'page'
        if (found) {
          found.views += 1; // Increment count for the same page
        } else {
          acc.push({ page: event.details.page, views: 1 }); // Add new page with count 1
        }
      }
      return acc;
    }, [])
    : [];


  const socialClicksData = Array.isArray(analytics)
    ? analytics.reduce((acc, event) => {
      if (event.eventType === "social_click" && event.platform) {
        const found = acc.find((item) => item.platform === event.platform);
        if (found) {
          found.clicks += 1; // Increment clicks for the same platform
        } else {
          acc.push({ platform: event.platform, clicks: 1 }); // Add new platform with initial clicks
        }
      }
      return acc;
    }, [])
    : [];


  return (
    <div className="flex justify-center items-center min-h-screen padding20 marginb">
      {user?.isPro ? (
        <div className="w-full max-w-4xl mx-auto">
          {analytics.length === 0 ? (
            <p className="text-center">No analytics data available</p>
          ) : (
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-5">
                <h2 className="text-center text-xl Montserrat font-semibold">Social Media</h2>
                {
                  socialClicksData.length === 0 ? (
                    <p className="text-center">No social media analytics data available</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={socialClicksData}>
                        <XAxis dataKey="platform" />
                        <YAxis />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#ffffff", borderRadius: "10px" }}
                        />
                        <Bar dataKey="clicks" fill="#432818" />
                      </BarChart>
                    </ResponsiveContainer>
                  )
                }
              </div>
              <hr />
              <div className="flex flex-col gap-5">
                <h2 className="text-center text-xl Montserrat font-semibold">Page's</h2>
                {
                  aggregatedData.length === 0 ? (
                    <p className="text-center">No page analytics data available</p>
                  ) : (<ResponsiveContainer width="100%" height={300}>
                    <BarChart data={aggregatedData}>
                      <XAxis dataKey="page" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#ffffff", borderRadius: "10px" }}

                      />
                      <Bar dataKey="views" fill="#432818" />
                    </BarChart>
                  </ResponsiveContainer>)
                }
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5 bg-[#E1BB80] padding20 rounded-2xl">
          <h2 className="text-center text-2xl font-medium">Upgrade to Pro Plan</h2>
          <p className="text-center mt-4">
            Access advanced analytics by upgrading to the Pro plan. Unlock premium features today!
          </p>
          <button
            onClick={() => (window.location.href = "/admin/upgrade")}
            className="bg-[#432818] text-[#ffe6a7] rounded-full padding10 w-full"
          >
            Upgrade Now
          </button>
        </div>
      )}
    </div>
  );
};

export default Analytics;
