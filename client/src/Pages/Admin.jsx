import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

const Admin = () => {

  const [user, setUser] = useState(null);

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

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch profile");
        }

        setUser(data);
      } catch (error) {
        console.error("Profile Fetch Error:", error);
        toast.error(error.message);
      }
    };

    fetchUserProfile();
  }, []);


  return (
    <div className='flex bg-[#ffe6a7] text-[16px]'>
      {/* sidebar */}
      <div className="md:w-[18%] md:flex hidden flex-col justify-between h-screen sticky top-0">

        <div className="padding10">
          <ul className='flex flex-col'>
            {/* logo */}
            <Link className='padding10 flex items-center gap-2' to="/admin">
              <img className='w-10' src="kafefolio.png" alt="logo" />
              <p className='text-2xl Pacifico text-[#432818]'>Kafefolio</p>
            </Link>
            {/* dashboard */}
            <Link className='flex items-center gap-2 hover:bg-[#e1bb80] padding10 rounded-xl' to="/admin"><i className="fa-solid fa-briefcase" /><li>Portfolio</li></Link>
            {/* template */}
            <Link className='flex items-center gap-2 hover:bg-[#e1bb80] padding10 rounded-xl' to="/admin/template"><i className="fa-solid fa-layer-group"></i><li>Template</li></Link>
            {/* analytics */}
            <Link className='flex items-center gap-2 hover:bg-[#e1bb80] padding10 rounded-xl' to="/admin/analytics">
              <i className="fa-solid fa-chart-simple" /><li>Analytics</li>
            </Link>
            {/* setting */}
            {/* <Link className='flex items-center gap-2 hover:bg-[#e1bb80] padding10 rounded-xl' to="/admin/settings"><i className="fa-solid fa-gear" /><li>Setting</li></Link> */}
          </ul>
        </div>

        <div className="flex flex-col gap-5 padding10">
          <div className="flex flex-col gap-2 bg-[#e1bb80] rounded-2xl padding10">
            <h1 className='font-semibold text-lg text-[#432818]'>Try Pro for free 🤩</h1>
            <p className='text-[15px] text-[#432818]'>It's the most popular plan for content creators and businesses.</p>
            <Link to="/admin/upgrade"><button className='bg-[#432818] text-[#ffe6a7] w-full cursor-pointer padding10 rounded-2xl'>Claim Now</button></Link>
          </div>

          <Link to="/admin/account"><button className="flex items-center gap-2 hover:bg-[#e1bb80] rounded-full padding10 cursor-pointer">
            <img
              src={user?.profilePic || "https://cdn-icons-png.flaticon.com/512/13078/13078067.png"}
              alt="Profile"
              className="w-9 h-9 rounded-full"
            />
            <p className='text-[15px] truncate font-medium'>{user?.email}</p>
          </button></Link>
        </div>
      </div>

      {/* mobile sidebar */}
      <div className="fixed bottom-0 w-full bg-[#432818] text-[#ffe6a7] md:hidden flex gap-5 padding10 z-50">
        <ul className='flex justify-between items-center w-full gap-2'>
          {/* dashboard */}
          <Link className='flex flex-col items-center justify-center gap-1 rounded-xl' to="/admin"><i className="fa-solid fa-briefcase" /><li>Portfolio</li></Link>
          {/* template */}
          <Link className='flex flex-col items-center justify-center gap-1 rounded-xl' to="/admin/template"><i className="fa-solid fa-layer-group"></i><li>Template</li></Link>
          {/* analytics */}
          <Link className='flex flex-col items-center justify-center gap-1 rounded-xl' to="/admin/analytics">
            <i className="fa-solid fa-chart-simple" /><li>Analytics</li>
          </Link>
          {/* setting */}
          <Link className='flex flex-col items-center justify-center gap-1 rounded-xl' to="/admin/account"><i className="fa-solid fa-gear" /><li>More</li></Link>
        </ul>
      </div>

      {/* content */}
      <div className="md:w-[80%] w-full border-l border-[#99582a]">
        <Outlet />
      </div>
    </div>
  )
}

export default Admin
