import React, { useEffect, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'

const Account = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", username: "" });
  const [username, setUsername] = useState(false);
  const [deleteAccount, setDeleteAccount] = useState(false);

  useEffect(() => {
    const shouldHideOverflow = username || deleteAccount

    if (shouldHideOverflow) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Cleanup function to ensure class is removed on unmount
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [username, deleteAccount]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch("https://kafefolio-server.onrender.com/api/user/profile", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch profile");
        }

        setUser(data);
        setFormData({
          name: data.name,
          email: data.email,
          username: data.username || "",
        });
      } catch (error) {
        console.error("Profile Fetch Error:", error);
        toast.error(error.message);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://kafefolio-server.onrender.com/api/user/update", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      toast.success("Profile updated!");
      setUser((prev) => ({ ...prev, name: formData.name }));
      setUsername(false); // Close the modal after updating the username
    } catch (error) {
      console.error("Update Error:", error);
      toast.error(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch("https://kafefolio-server.onrender.com/api/user/delete", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");

      toast.success("Account deleted!");
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(error.message);
    }
  };

  const hundleChangeUsername = async () => {
    if (!user?.isPro) {
      navigate("/admin/upgrade");
      return;
    }

    try {
      let res = await fetch("https://kafefolio-server.onrender.com/api/user/update", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: formData.username }),
      });

      let data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      toast.success("Username updated!");
      setUsername(false);
      setUser((prev) => ({
        ...prev,
        username: formData.username,
      }))
    } catch (error) {
      toast.error(error.message);
      console.error(error.message);
    }
  }

  const handleSignOut = async () => {
    try {
      const res = await fetch("https://kafefolio-server.onrender.com/api/user/logout", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Logout failed");

      toast.success("Logged out!");
      navigate("/");
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className='flex justify-center items-center'>
      <Toaster />
      <div className="md:w-[60%] flex flex-col gap-12 md:marginy marginb padding20">
        {/* My Information */}
        <div className="flex flex-col gap-3">
          <h1 className="text-xl font-semibold">My Information</h1>

          {user ? (
            <form onSubmit={handleSubmit} className="bg-[#e1bb80] rounded-2xl padding20 flex flex-col gap-3">
              <div>
                <label className="block text-sm text-[#432818]">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || user.name}
                  onChange={handleChange}
                  placeholder='Enter your name'
                  className="w-full rounded-md focus:outline-none"
                  required
                />
                <hr />
              </div>

              <div>
                <label className="block text-sm text-[#432818]">Email</label>
                <input
                  type="text"
                  name="email"
                  value={user.email}
                  disabled
                  className="w-full rounded-md focus:outline-none cursor-not-allowed"
                />
                <hr />
                <p className="text-sm">Your email can't be changed.</p>
              </div>

              <button
                type="submit"
                className="w-full bg-[#432818] text-[#ffe6a7] padding10 rounded-2xl cursor-pointer"
              >
                Save Details
              </button>
            </form>
          ) : (
            <p className="text-center">Loading profile...</p>
          )}
        </div>

        {/* Account management */}
        <div className="flex flex-col gap-5">
          <h1 className="text-xl font-semibold">Account management</h1>
          <p className='text-[#432818] font-medium'><span className='Pacifico'>Kafefolio</span> you own</p>

          <div className="bg-[#e1bb80] padding20 rounded-2xl flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <div className="flex justify-between items-center gap-3 overflow-hidden">
                <img className='md:w-24 w-20 md:h-24 h-20 object-cover rounded-full' src={user?.profilePic} alt="pic" />
                <p className='truncate'>@{user?.username}</p>
                {
                  user?.isPro && (
                    <img className='w-6' src="/blueTick.png" alt="verify" />
                  )
                }
              </div>
              <i onClick={() => setUsername(!username)} className="fa-solid fa-ellipsis text-xl cursor-pointer" />
            </div>
            <hr />
            <div className="flex items-center gap-3">
              <p>Plan - {user?.isPro ? "Pro" : "Free"}</p>
            </div>
            <hr />
            <div className="flex flex-col gap-3">
              <p><span className='Pacifico'>Kafefolio</span> for {user?.name} ☕</p>
              <Link to="/admin/upgrade">
                <button className='bg-[#432818] text-[#ffe6a7] padding10 rounded-2xl cursor-pointer w-full'>
                  Upgrade to Pro
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Username Change */}
        {username && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50">
            <form className="bg-[#ffe6a7] flex flex-col gap-5 padding20 rounded-xl shadow-lg w-[80%] md:w-[40%]">
              <h2 className="text-xl font-medium text-center">Change username</h2>
              <div className="flex items-center bg-[#e1bb80] padding10 rounded-2xl">
                <p>kafefolio.com/</p>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full focus:outline-none lowercase"
                  placeholder="username"
                />
              </div>
              <button
                type="button"
                onClick={hundleChangeUsername}
                className="w-full bg-[#432818] text-[#ffe6a7] padding10 rounded-full cursor-pointer"
              >
                Save Username
              </button>
              <button
                type='button'
                onClick={() => setUsername(!username)}
                className="mt-3 w-full border-2 border-[#432818] hover:bg-[#432818] hover:text-[#ffe6a7] padding10 rounded-full cursor-pointer"
              >
                Cancel
              </button>
            </form>
          </div>
        )}
        {/* Support & Contact */}
        <div className="flex flex-col gap-3 bg-[#e1bb80] padding20 rounded-2xl">
          <h1 className="text-xl font-semibold">Support & Contact</h1>
          <p className='text-[#432818] font-medium'>Get help with your Kafefolio account.</p>
          <div className="flex items-center gap-3 justify-between">
            <button onClick={() => window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=kafefolio@gmail.com`, "_blank")} className='bg-[#432818] text-[#ffe6a7] padding10 rounded-2xl cursor-pointer w-full whitespace-nowrap'>Email</button>
            <button onClick={()=> window.open("https://wa.me/9082973931", "_blank")} className='bg-[#432818] text-[#ffe6a7] padding10 rounded-2xl cursor-pointer w-full whitespace-nowrap'>WhatsApp</button>
          </div>
        </div>

        {/* SignOut Account */}
        <div className="bg-[#e1bb80] padding20 rounded-2xl flex flex-col gap-3 text-[#432818]">
          <h1 className="text-xl font-semibold">Sign Out</h1>
          <p className='text-[#432818] font-medium'>Sign out of your Kafefolio account.</p>
          <button onClick={handleSignOut} className='bg-[#432818] text-[#ffe6a7] padding10 rounded-2xl cursor-pointer w-full'> Sign Out</button>
        </div>

        {/* Delete Account */}
        <div className="bg-[#e1bb80] padding20 rounded-2xl flex flex-col gap-3 text-[#432818]">
          <h1 className="text-xl font-semibold">Delete Account</h1>
          <p className='text-[#432818] font-medium'>Permanently delete your account and all your Kafefolio profiles.</p>
          <button onClick={() => setDeleteAccount(true)} className='bg-[#432818] text-[#ffe6a7] padding10 rounded-2xl cursor-pointer w-full'>Delete Account</button>

          {deleteAccount && (
            <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-[#ffe6a7] flex flex-col gap-5 padding20 rounded-xl shadow-lg w-[80%] md:w-[40%]">
                <h2 className="text-xl font-medium text-center">Are you sure?</h2>
                <p className="text-center">This action cannot be undone. This will permanently delete your account and all your Kafefolio profiles.</p>
                <button onClick={handleDelete} className="w-full bg-[#432818] text-[#ffe6a7] padding10 rounded-full cursor-pointer">Delete Account</button>
                <button onClick={() => setDeleteAccount(false)} className="mt-3 w-full border-2 border-[#432818] hover:bg-[#432818] hover:text-[#ffe6a7] padding10 rounded-full cursor-pointer">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
