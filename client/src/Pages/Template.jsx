import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Template = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    portfolio: {
      media: [],
      template: "",
      theme: {
        color: "",
        backgroundColor: "",
        font: "",
      },
    },
  });
  const [selectedPlan, setSelectedPlan] = useState("Free");
  const [loading, setLoading] = useState(true);

  // Define themes for each template
  const templateThemes = {
    Modern: {
      color: "#ffffff",
      backgroundColor: "#000000",
      font: "Arial, sans-serif",
    },
    Classic: {
      color: "#000000",
      backgroundColor: "#f4f4f4",
      font: "Poppins, serif",
    },
    Minimalist: {
      color: "#000000",
      backgroundColor: "#ffffff",
      font: "Montserrat, sans-serif",
    },
    Kafefolio: {
      color: "#432818",
      backgroundColor: "#99582a",
      font: "JosefinSans, sans-serif",
    },
    Vampire: {
      color: "#eb0000",
      backgroundColor: "#000000",
      font: "HorstBlack, cursive",
    },
    Frozen: {
      color: "#ffffff",
      backgroundColor: "#5ce1e6",
      font: "Montserrat, cursive",
    },
    Snivy: {
      color: "#008000",
      backgroundColor: "#70e000",
      font: "Pacifico, cursive",
    },
    Cloyster: {
      color: "#3c096c",
      backgroundColor: "#c77dff",
      font: "AbrilFatface, cursive",
    },
    Moltres: {
      color: "#d00000",
      backgroundColor: "#e85d04",
      font: "Montserrat, sans-serif",
    },
  };

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
        setFormData({
          portfolio: {
            media: data.portfolio?.media || [],
            template: data.portfolio?.template || "",
            theme: data.portfolio?.theme || {
              color: "",
              backgroundColor: "",
              font: "",
            },
          },
        });

        setLoading(false);
      } catch (error) {
        console.error("Profile Fetch Error:", error);
        toast.error(error.message);
      }
    };
    fetchUserProfile();
  }, []);

  const handleTemplateChange = async (templateName) => {
    const newTheme = templateThemes[templateName]; // Get the theme for the selected template

    try {
      setFormData({
        portfolio: {
          ...formData.portfolio,
          media: formData.portfolio.media,
          template: templateName,
          theme: newTheme,
        },
      });

      const res = await fetch("https://kafefolio-server.onrender.com/api/user/update", {
        method: "PUT",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          portfolio: {
            media: formData.portfolio.media,
            template: templateName,
            theme: newTheme,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      toast.success(`Template updated to ${templateName}`);

      setUser((prev) => ({
        ...prev,
        portfolio: {
          ...prev.portfolio,
          media: formData.portfolio.media,
          template: templateName,
          theme: newTheme,
        },
      }));
    } catch (error) {
      console.error("Update Error:", error);
      toast.error(error.message);
    }
  };

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

  return (
    <div
      className="flex justify-center items-center md:h-auto min-h-screen scroll-smooth overflow-hidden">
      <Toaster />
      <div className="md:w-[60%] w-[90%] text-[#432818] flex flex-col gap-5 marginb padding20 bg-[#e1bb80] rounded-2xl">
        <h1 className="text-2xl font-medium text-center">Template</h1>
        {/* Plan Selection */}
        <div className="flex justify-between items-center text-center border-b-2">
          <button
            onClick={() => setSelectedPlan("Free")}
            className={`w-full padding20 cursor-pointer ${selectedPlan === "Free"
              ? "bg-[#432818] text-[#ffe6a7]"
              : "hover:bg-[#432818] hover:text-[#ffe6a7]"
              }`}
          >
            Free
          </button>
          <button
            onClick={() => setSelectedPlan("Pro")}
            className={`w-full padding20 cursor-pointer ${selectedPlan === "Pro"
              ? "bg-[#432818] text-[#ffe6a7]"
              : "hover:bg-[#432818] hover:text-[#ffe6a7]"
              }`}
          >
            Pro
          </button>
        </div>

        {/* Templates */}
        <div className="bg-[#ffe6a7] text-[#432818] flex justify-center items-center rounded-2xl md:padding20 padding10">
          <div className="grid grid-cols-3 gap-3 w-full items-center justify-between">
            {/* Modern */}
            <button
              onClick={() => handleTemplateChange("Modern")}
              className={`${selectedPlan === "Free" ? "flex" : "hidden"
                } flex-col justify-center items-center gap-2 md:w-[130px] cursor-pointer`}
            >
              <img
                className="rounded-xl"
                src="https://mfe-appearance.production.linktr.ee/images/60192.ad080d42c6ec95490ea3.webp"
                alt="Modern Template"
              />
              <p className="text-sm font-medium">Modern</p>
            </button>
            {/* Classic */}
            <button
              onClick={() => handleTemplateChange("Classic")}
              className={`${selectedPlan === "Free" ? "flex" : "hidden"
                } flex-col justify-center items-center gap-2 md:w-[130px] cursor-pointer`}
            >
              <img
                className="rounded-xl"
                src="https://mfe-appearance.production.linktr.ee/images/43728.b7e9b688808c1f26aa6b.webp"
                alt="Classic Template"
              />
              <p className="text-sm font-medium">Classic</p>
            </button>
            {/* Minimalist */}
            <button
              onClick={() => handleTemplateChange("Minimalist")}
              className={`${selectedPlan === "Free" ? "flex" : "hidden"
                } flex-col justify-center items-center gap-2 md:w-[130px] cursor-pointer`}>
              <img
                className="rounded-xl"
                src="https://mfe-appearance.production.linktr.ee/images/89994.3869b8f0402ecced0dfc.webp"
                alt="Minimalist Template"
              />
              <p className="text-sm font-medium">Minimalist</p>
            </button>
            {/* Kafefolio Edition */}
            <button
              onClick={() => user?.isPro ? handleTemplateChange("Kafefolio") : navigate("/admin/upgrade")}
              className={`${selectedPlan === "Pro" ? "flex" : "hidden"
                } flex-col justify-center items-center gap-2 md:w-[130px] cursor-pointer`}>
              <img
                className="rounded-xl"
                src="/Kafefolio Edition.png"
                alt="Kafefolio Template"
              />
              <p className="text-sm font-medium"><span className='text-[#99582a] Pacifico'>Kafefolio</span></p>
            </button>
            {/* Vampire */}
            <button
              onClick={() => user?.isPro ? handleTemplateChange("Vampire") : navigate("/admin/upgrade")}
              className={`${selectedPlan === "Pro" ? "flex" : "hidden"
                } flex-col justify-center items-center gap-2 md:w-[130px] cursor-pointer`}>
              <img
                className="rounded-xl"
                src="/Vampire.png"
                alt="Vampire Template"
              />
              <p className="font-medium HorstBlack text-xl">Vampire</p>
            </button>
            {/* Frozen #5ce1e6 */}
            <button
              onClick={() => user?.isPro ? handleTemplateChange("Frozen") : navigate("/admin/upgrade")}
              className={`${selectedPlan === "Pro" ? "flex" : "hidden"
                } flex-col justify-center items-center gap-2 md:w-[130px] cursor-pointer`}>
              <img
                className="rounded-xl"
                src="/Froze.png"
                alt="Frozen Template"
              />
              <p className="font-medium   Montserrat">Frozen</p>
            </button>
            {/* Snivy */}
            <button
              onClick={() => user?.isPro ? handleTemplateChange("Snivy") : navigate("/admin/upgrade")}
              className={`${selectedPlan === "Pro" ? "flex" : "hidden"
                } flex-col justify-center items-center gap-2 md:w-[130px] cursor-pointer`}>
              <img
                className="rounded-xl"
                src="/Snivy.png"
                alt="Snivy Template"
              />
              <p className="font-medium   Montserrat">Snivy</p>
            </button>
            {/* Cloyster */}
            <button
              onClick={() => user?.isPro ? handleTemplateChange("Cloyster") : navigate("/admin/upgrade")}
              className={`${selectedPlan === "Pro" ? "flex" : "hidden"
                } flex-col justify-center items-center gap-2 md:w-[130px] cursor-pointer`}>
              <img
                className="rounded-xl"
                src="/Cloyster.png"
                alt="Cloyster Template"
              />
              <p className="font-medium   Montserrat">Cloyster</p>
            </button>
            {/* Moltres */}
            <button
              onClick={() => user?.isPro ? handleTemplateChange("Moltres") : navigate("/admin/upgrade")}
              className={`${selectedPlan === "Pro" ? "flex" : "hidden"
                } flex-col justify-center items-center gap-2 md:w-[130px] cursor-pointer`}>
              <img
                className="rounded-xl"
                src="/Moltres.png"
                alt="Moltres Template"
              />
              <p className="font-medium Montserrat">Moltres</p>
            </button>
          </div>
        </div>
      </div>

      {/* Preview */}
      <Link to={`/${user?.username}`}>
        <button className="bg-[#432818] text-[#ffe6a7] fixed text-center md:left-[50%] left-[33%] bottom-20 paddingy rounded-full cursor-pointer">
          Preview
        </button>
      </Link>
    </div>
  );
};

export default Template;