import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [nameBio, setNameBio] = useState(false);
  const [formData, setFormData] = useState({
    profilePic: '',
    name: '',
    bio: '',
    category: '',
    linkMedia: '',
    social: {
      facebook: '',
      X: '',
      instagram: '',
      threads: '',
      snapchat: '',
      youtube: '',
      linkedIn: '',
      pinterest: '',
      tiktok: '',
      onlyfans: '',
    },
    links: [
      {
        text: "",
        url: ""
      }],
    portfolio: {
      media: [],
      theme: {
        color: '',
        backgroundColor: '',
        font: ''
      }
    },
    about: {
      image: '',
      title: '',
      description: '',
      resume: ''
    }
  });
  const [addSocial, setAddSocial] = useState(false);
  const [addCategory, setAddCategory] = useState(false);
  const [addLinks, setAddLinks] = useState(false);
  const [previewMedia, setPreviewMedia] = useState(null);


  useEffect(() => {
    const shouldHideOverflow = nameBio || addCategory || addSocial || addLinks || previewMedia;

    if (shouldHideOverflow) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Cleanup function to ensure class is removed on unmount
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [nameBio, addCategory, addSocial, addLinks, previewMedia]);


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
        setFormData((prev) => ({
          ...prev,
          profilePic: data.profilePic,
          name: data.name,
          bio: data.bio,
          category: data.category,
          linkMedia: data.linkMedia,
          social: {
            facebook: data.social?.facebook,
            X: data.social?.X,
            instagram: data.social?.instagram,
            threads: data.social?.threads,
            snapchat: data.social?.snapchat,
            youtube: data.social?.youtube,
            linkedIn: data.social?.linkedIn,
            pinterest: data.social?.pinterest,
            tiktok: data.social?.tiktok,
            onlyfans: data.social?.onlyfans
          },
          links: [
            {
              text: data.links?.text,
              url: data.links?.url
            }
          ],
          portfolio: {
            media: data.portfolio?.images || prev.portfolio.media,
            templete: data.portfolio?.templete || prev.portfolio.templete,
            theme: {
              color: data.portfolio?.theme?.color || prev.portfolio.theme.color,
              backgroundColor: data.portfolio?.theme?.backgroundColor || prev.portfolio.theme.backgroundColor,
              font: data.portfolio?.theme?.font || prev.portfolio.theme.font,
            },
          },
          about: {
            image: data.about?.image,
            title: data.about?.title,
            description: data.about?.description,
            resume: data.about?.resume
          }
        }));
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

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      social: {
        ...prev.social,
        [name]: value || "",
      },
    }));
  };

  const handleAddImage = async (e) => {
    try {
      const files = Array.from(e.target.files); // Get all selected files

      if (!files.length) {
        toast.error("No files selected.");
        return;
      }

      // Get current uploaded images and set the limit based on user type
      const currentImages = user?.portfolio?.media || [];
      const maxImages = user?.isPro ? 15 : 5;

      if (currentImages.length >= maxImages) {
        toast.error(`You can only upload up to ${maxImages} images.`);
        return;
      }

      // Calculate remaining upload slots
      const availableSlots = maxImages - currentImages.length;

      if (files.length > availableSlots) {
        toast.warning(
          `You can only upload ${availableSlots} more image(s). Excess files will be ignored.`
        );
      }

      // Limit files to the available slots
      const filesToUpload = files.slice(0, availableSlots);
      const uploadedImages = []; // Store uploaded image URLs

      for (const file of filesToUpload) {
        const formData = new FormData();
        formData.append("image", file);

        // Upload each image
        const token = localStorage.getItem("token");
        const res = await axios.post('https://kafefolio-server.onrender.com/api/user/post', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Push the uploaded image URL to the array
        uploadedImages.push(res.data.url);
      }

      // Success feedback
      if (uploadedImages.length === 1) toast.success("Image uploaded!");
      else toast.success(`${uploadedImages.length} image's uploaded!`);

      // Update the user state with the new images
      setUser((prev) => ({
        ...prev,
        portfolio: {
          ...prev.portfolio,
          media: [...currentImages, ...uploadedImages], // Merge existing and new images
        },
      }));

    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Failed to upload image.");
    }
  };

  const handleDeleteMedia = async (index) => {
    try {
      // Get the image URL to delete
      const mediaToDelete = user?.portfolio?.media[index];

      // Call the backend to delete the image
      await axios.delete(`https://kafefolio-server.onrender.com/api/user/postDelete`, {
        data: { mediaUrl: mediaToDelete },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        }
      });

      // Success feedback
      toast.success("Media deleted!");

      // Update the user state with the new images array
      const updatedMedia = [...user?.portfolio.media];
      updatedMedia.splice(index, 1);

      setUser((prev) => ({
        ...prev,
        portfolio: {
          ...prev.portfolio,
          media: updatedMedia,
        },
      }));
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image.");
    }
  };

  const handleFileChange = async (e) => {
    try {

      const formData = new FormData();
      formData.append("image", e.target.files[0]);
      const token = localStorage.getItem("token");

      // Make the POST request to upload the image
      const res = await axios.post('https://kafefolio-server.onrender.com/api/user/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Axios automatically parses JSON responses, so use `res.data` directly
      const data = res.data;
      console.log(data);

      // Success feedback
      toast.success("Image uploaded!");

      // Update the user state with the new data
      setUser((prev) => ({
        ...prev,
        profilePic: data.url, // Assuming the response includes the updated profilePic URL
      }));

    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error.message);
    }
  };

  const handleLinkMedia = async (e) => {
    try {
      const file = e.target.files[0];

      if (!file) {
        toast.error("No file selected.");
        return;
      }

      const formData = new FormData();
      formData.append("image", file);

      // Upload each Media
      const token = localStorage.getItem("token");
      const res = await axios.post('https://kafefolio-server.onrender.com/api/user/media', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res);

      toast.success("Media uploaded!");

      // Update the user state with the new Media
      setUser((prev) => ({
        ...prev,
        linkMedia: res.data.url
      }));

    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Failed to upload image.");
    }
  }

  const handleAboutImageChange = async (e) => {
    try {
      const formData = new FormData();
      formData.append("image", e.target.files[0]);

      // Make the POST request to upload the image
      const res = await axios.post('https://kafefolio-server.onrender.com/api/user/about', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });

      // Axios automatically parses JSON responses, so use `res.data` directly
      const data = res.data;

      // Success feedback
      toast.success("Image uploaded!");

      // Update the user state with the new data
      setUser((prev) => ({
        ...prev,
        about: {
          ...prev.about,
          image: data.url,
        } // Assuming the response includes the updated profilePic URL
      }));

    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error.message);
    }
  };

  const handleAboutChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        [name]: value || "",
      },
    }))
  }

  const handleAboutSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://kafefolio-server.onrender.com/api/user/aboutme", {
        method: "PUT",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData.about),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      toast.success("About updated!");

      // Update the state with the new data after a successful update
      setUser((prev) => ({
        ...prev,
        about: data,
      }));
    } catch (error) {
      console.error("Update Error:", error);
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://kafefolio-server.onrender.com/api/user/update", {
        method: "PUT",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, links: user?.links }), // Use formData.links
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      toast.success("Profile updated!");

      // Update the state with the new data after a successful update
      setUser((prev) => ({
        ...prev,
        name: data.name,
        bio: data.bio,
        category: data.category,
        social: data.social || prev.social,
        links: data.links || prev.links,  // Set the updated links here
      }));

      setNameBio(false);
      setAddSocial(false);
      setAddCategory(false);
      setAddLinks(false);
    } catch (error) {
      console.error("Update Error:", error);
      toast.error(error.message);
    }
  };

  const handleAddLink = async (e) => {
    e.preventDefault();
    try {

      const res = await fetch("https://kafefolio-server.onrender.com/api/user/update", {
        method: "PUT",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, links: [...user?.links, formData.links[0]] }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      // Optionally update user state as well
      setUser((prev) => ({
        ...prev,
        links: [...user?.links, formData.links[0]],
      }));

      // Reset formData after submission
      setFormData((prev) => ({
        ...prev,
        links: [{ text: "", url: "" }], // Reset input fields
      }));

      toast.success("Link added!");

      setAddLinks(false);
    } catch (error) {
      console.error("Add Error:", error);
      toast.error(error.message);
    }
  }

  const handleDeleteLink = async (index) => {
    try {
      // Create a copy of the links array and remove the link at the specified index
      const updatedLinks = [...user?.links];
      updatedLinks.splice(index, 1);

      // Update the formData state with the modified links
      setFormData((prev) => ({
        ...prev,
        links: updatedLinks,
      }));

      const res = await fetch("https://kafefolio-server.onrender.com/api/user/update", {
        method: "PUT",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, links: updatedLinks }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      toast.success("Link deleted!");

      // Optionally update user state as well
      setUser((prev) => ({
        ...prev,
        links: updatedLinks,
      }));
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(error.message);
    }
  };

  const handleThemeChange = async (e) => {
    e.preventDefault();
    try {
      // Send the updated theme settings to the backend
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
            theme: formData.portfolio.theme
          }
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update theme");

      // Update the user state with the updated theme from the response
      setUser((prev) => ({
        ...prev,
        portfolio: {
          ...prev.portfolio,
          media: data.portfolio?.media || prev.portfolio?.media,
          theme: {
            color: data.portfolio?.theme?.color || prev.portfolio?.theme?.color,
            backgroundColor: data.portfolio?.theme?.backgroundColor || prev.portfolio?.theme?.backgroundColor,
            font: data.portfolio?.theme?.font || prev.portfolio?.theme?.font,
          },
        },
      }));

      toast.success("Theme updated successfully!");
    } catch (error) {
      console.error("Theme Change Error:", error);
      toast.error(error.message || "Something went wrong while updating the theme.");
    }
  };

  return (
    <div className='flex justify-center items-center md:h-auto min-h-screen scroll-smooth overflow-hidden'>
      <Toaster />
      <div className="md:w-[60%] w-[90%] flex flex-col gap-12 marginb paddingt">
        {/* Profile */}
        <div className="flex flex-col gap-3 bg-[#e1bb80] padding20 rounded-xl">
          <div className="flex justify-between gap-3 items-center">
            <div className="flex items-center gap-3">
              <label>
                <img className='md:w-24 w-20 md:h-24 h-20 rounded-full object-cover cursor-pointer' src={user?.profilePic} alt="pic" />
                <input accept="image/*" onChange={handleFileChange} type="file" className='hidden' />
              </label>

              <div className="flex flex-col gap-1 overflow-hidden">
                <h1 onClick={() => setNameBio(!nameBio)} className='text-xl font-medium hover:underline cursor-pointer flex items-center gap-1 whitespace-nowrap truncate'>
                  {user?.name}
                  {
                    user?.isPro && (
                      <img className='w-6 object-contain md:flex hidden' src="/blueTick.png" alt="pro" />
                    )
                  }
                </h1>
                <p onClick={() => setAddCategory(!addCategory)} className='text-sm hover:underline cursor-pointer'>{user?.category || "category"}</p>
                <p onClick={() => setNameBio(!nameBio)} className='text-sm hover:underline cursor-pointer'>{user?.bio || "Add your bio"}</p>
              </div>
            </div>

            <div className="">
              <i onClick={() => setNameBio(!nameBio)} className="fa-solid fa-ellipsis paddingo bg-[#432818] text-[#ffe6a7] rounded-full cursor-pointer" />

              {nameBio && (
                <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50">
                  <form onSubmit={handleSubmit} className="bg-[#ffe6a7] text-[#432818] flex flex-col gap-5 padding20 rounded-xl shadow-lg w-[80%] md:w-[40%]">
                    <h2 className="text-xl font-medium text-center">Display name and bio</h2>

                    <div className="flex items-center bg-[#e1bb80] padding10 rounded-2xl">
                      <input
                        type="text"
                        name="name"
                        placeholder='Name'
                        value={formData.name}
                        onChange={handleChange}
                        className='bg-[#e1bb80] focus:outline-none w-full'
                      />
                    </div>

                    <div className="flex items-center bg-[#e1bb80] padding10 rounded-2xl">
                      <textarea
                        type="text"
                        name="bio"
                        placeholder='Bio'
                        value={formData.bio}
                        onChange={handleChange}
                        maxLength={160}
                        className='bg-[#e1bb80] text-[#432818] focus:outline-none w-full noscrollbar'
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#432818] text-[#ffe6a7] padding10 rounded-full cursor-pointer"
                    >
                      Save
                    </button>

                    <button
                      type='button'
                      onClick={() => setNameBio(!nameBio)}
                      className="mt-3 w-full border-2 border-[#432818] hover:bg-[#432818] hover:text-[#ffe6a7] padding10 rounded-full cursor-pointer"
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              )}

              {
                addCategory && (
                  <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50">
                    <form onSubmit={handleSubmit} className="bg-[#ffe6a7] text-[#432818] flex flex-col gap-5 padding20 rounded-xl shadow-lg w-[80%] md:w-[40%]">
                      <h2 className="text-xl font-medium text-center">Add your category</h2>

                      <div className="flex items-center bg-[#e1bb80] padding10 rounded-2xl">
                        <select name="category" value={formData.category} onChange={handleChange} className="bg-[#e1bb80] focus:outline-none w-full" >
                          <option value="Actor">Actor</option>
                          <option value="Artist">Artist</option>
                          <option value="Entrepreneur">Entrepreneur</option>
                          <option value="Model">Model</option>
                          <option value="Fashion Model">Fashion Model</option>
                          <option value="Photography">Photography</option>
                          <option value="Designer">Designer</option>
                          <option value="Writer">Writer</option>
                          <option value="Editor">Editor</option>
                          <option value="Music">Music</option>
                          <option value="Dancer">Dancer</option>
                          <option value="Comedian">Comedian</option>
                          <option value="Singer">Singer</option>
                          <option value="Blogger">Blogger</option>
                          <option value="Video Creator">Video Creator</option>
                          <option value="Vlogger">Vlogger</option>
                          <option value="Gamer">Gamer</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#432818] text-[#ffe6a7] padding10 rounded-full cursor-pointer"
                      >
                        Save
                      </button>

                      <button
                        type='button'
                        onClick={() => setAddCategory(!addCategory)}
                        className="mt-3 w-full border-2 border-[#432818] hover:bg-[#432818] hover:text-[#ffe6a7] padding10 rounded-full cursor-pointer"
                      >
                        Cancel
                      </button>
                    </form>
                  </div>
                )}
            </div>
          </div>

          <button onClick={() => setAddSocial(!addSocial)} className='bg-[#432818] text-[#ffe6a7] paddingy w-full rounded-full cursor-pointer'>
            <i className="fa-solid fa-plus" /> Add
          </button>
          {/* Social Media and links */}
          {addSocial && (
            <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50">
              <form onSubmit={handleSubmit} className="bg-[#ffe6a7] text-[#432818] flex flex-col gap-5 padding20 rounded-xl 
              shadow-lg w-[80%] md:w-[40%]">
                <h2 className="text-xl font-medium text-center">Add your social media links</h2>
                <div className="flex flex-col gap-3 h-[300px] overflow-y-scroll noscrollbar scroll-smooth">
                  <div className="flex items-center bg-[#e1bb80] padding10 rounded-2xl">
                    {/* Facebook */}
                    <i className="fa-brands fa-facebook text-2xl padding10"></i>
                    <input
                      type="text"
                      name="facebook"
                      placeholder='Facebook'
                      value={formData.social.facebook}
                      onChange={handleSocialChange}
                      className='bg-[#e1bb80] focus:outline-none w-full'
                    />
                  </div>
                  <div className="flex items-center bg-[#e1bb80] padding10 rounded-2xl">
                    {/* instagram */}
                    <i className="fa-brands fa-instagram text-2xl padding10"></i>
                    <input
                      type="text"
                      name="instagram"
                      placeholder='Instagram'
                      value={formData.social.instagram}
                      onChange={handleSocialChange}
                      className='bg-[#e1bb80] focus:outline-none w-full'
                    />
                  </div>
                  <div className="flex items-center bg-[#e1bb80] padding10 rounded-2xl">
                    {/* Thread */}
                    <i className="fa-brands fa-threads text-2xl padding10"></i>
                    <input
                      type="text"
                      name="threads"
                      placeholder='Threads'
                      value={formData.social.threads}
                      onChange={handleSocialChange}
                      className='bg-[#e1bb80] focus:outline-none w-full'
                    />
                  </div>
                  <div className="flex items-center bg-[#e1bb80] padding10 rounded-2xl">
                    {/* X */}
                    <i className="fa-brands fa-x-twitter text-2xl padding10"></i>
                    <input
                      type="text"
                      name="X"
                      placeholder='X'
                      value={formData.social.X}
                      onChange={handleSocialChange}
                      className='bg-[#e1bb80] focus:outline-none w-full'
                    />
                  </div>
                  {/* Snapchat */}
                  <div className="flex items-center bg-[#e1bb80] padding10 rounded-2xl">
                    <i className="fa-brands fa-snapchat text-2xl padding10"></i>
                    <input
                      type="text"
                      name="snapchat"
                      placeholder='Snapchat'
                      value={formData.social.snapchat}
                      onChange={handleSocialChange}
                      className='bg-[#e1bb80] focus:outline-none w-full'
                    />
                  </div>
                  {/* Youtube */}
                  <div className="flex items-center bg-[#e1bb80] padding10 rounded-2xl">
                    <i className="fa-brands fa-youtube text-2xl padding10"></i>
                    <input
                      type="text"
                      name="youtube"
                      placeholder='Youtube'
                      value={formData.social.youtube}
                      onChange={handleSocialChange}
                      className='bg-[#e1bb80] focus:outline-none w-full'
                    />
                  </div>
                  {/* LinkedIn */}
                  <div className="flex items-center bg-[#e1bb80] padding10 rounded-2xl">
                    <i className="fa-brands fa-linkedin text-2xl padding10"></i>
                    <input
                      type="text"
                      name="linkedIn"
                      placeholder='LinkedIn'
                      value={formData.social.linkedIn}
                      onChange={handleSocialChange}
                      className='bg-[#e1bb80] focus:outline-none w-full'
                    />
                  </div>
                  {/* Pinterest */}
                  <div className="flex items-center bg-[#e1bb80] padding10 rounded-2xl">
                    <i className="fa-brands fa-pinterest text-2xl padding10"></i>
                    <input
                      type="text"
                      name="pinterest"
                      placeholder='Pinterest'
                      value={formData.social.pinterest}
                      onChange={handleSocialChange}
                      className='bg-[#e1bb80] focus:outline-none w-full'
                    />
                  </div>
                  {/* Tiktok */}
                  <div className="flex items-center bg-[#e1bb80] padding10 rounded-2xl">
                    <i className="fa-brands fa-tiktok text-2xl padding10"></i>
                    <input
                      type="text"
                      name="tiktok"
                      placeholder='Tiktok'
                      value={formData.social.tiktok}
                      onChange={handleSocialChange}
                      className='bg-[#e1bb80] focus:outline-none w-full'
                    />
                  </div>
                  {/* OnlyFans */}
                  <div className="flex items-center bg-[#00AEEF] padding10 rounded-2xl text-white">
                    <img className="w-10 h-10" src="https://images.seeklogo.com/logo-png/52/2/onlyfans-logo-png_seeklogo-527484.png" alt="onlyfans" />
                    <input
                      type="text"
                      name="onlyfans"
                      placeholder='OnlyFans'
                      value={formData.social.onlyfans}
                      onChange={handleSocialChange}
                      className='bg-[#00AEEF] focus:outline-none w-full'
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#432818] text-[#ffe6a7] padding10 rounded-full cursor-pointer"
                >
                  Save
                </button>

                <button
                  type='button'
                  onClick={() => setAddSocial(!addSocial)}
                  className="mt-3 w-full border-2 border-[#432818] hover:bg-[#432818] hover:text-[#ffe6a7] padding10 rounded-full cursor-pointer"
                >
                  Cancel
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Upload Media */}
        <div className="flex flex-col gap-5 bg-[#e1bb80] padding20 rounded-xl">
          {/* Media List */}
          <h2 className="text-xl font-medium text-[#432818] text-center">Uploaded Images & Videos</h2>
          <div className="grid md:grid-cols-3 grid-cols-2 gap-4 justify-items-center relative">
            {user?.portfolio.media?.length > 0 ? (
              user.portfolio.media.map((media, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-lg relative"
                >
                  {/* Media Preview (Image or Video) */}
                  <div className="w-36 h-52 relative">
                    {media.includes("video") ? (
                      <video
                        src={media}
                        className="object-cover w-full h-full cursor-pointer"
                        onClick={() => setPreviewMedia(media)} // Open preview modal
                        muted
                        autoPlay
                        loop
                      />
                    ) : (
                      <img
                        src={media}
                        alt={`Uploaded ${index}`}
                        className="object-cover w-full h-full cursor-pointer"
                        onClick={() => setPreviewMedia(media)} // Open preview modal
                      />
                    )}
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteMedia(index)}
                      className="text-[#ffe6a7] text-xl absolute top-3 right-3 cursor-pointer"
                    >
                      <i className="fa-solid fa-trash" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-sm text-[#432818]">
                No media uploaded yet.
              </p>
            )}
          </div>

          {/* Upload Section */}
          {user?.portfolio.media.length < (user?.isPro ? 15 : 5) ? (
            <label
              className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-[#432818] rounded-lg cursor-pointer bg-[#ffe6a7] hover:bg-[#ffd27f] transition-colors duration-300"
            >
              <i className="fa-solid fa-cloud-arrow-up text-3xl text-[#432818]" />
              <span className="text-sm font-medium text-[#432818]">
                Click to upload Images or Videos
              </span>
              <input
                onChange={handleAddImage}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                multiple
              />
            </label>
          ) : (
            <p className="text-sm font-medium text-[#432818] text-center">
              {user?.isPro ? (
                <button className="bg-[#432818] text-[#ffe6a7] w-full rounded-2xl padding20">
                  You have reached the limit of 15 images and videos.
                </button>
              ) : (
                <Link to="/admin/upgrade">
                  <button className="bg-[#432818] text-[#ffe6a7] cursor-pointer w-full rounded-2xl padding20">
                    Upgrade to Pro to upload more than 5 images and videos.
                  </button>
                </Link>
              )}
            </p>
          )}

          {/* Media Preview Modal */}
          {previewMedia && (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
              <div className="relative">
                {previewMedia.includes("video") ? (
                  <video
                    src={previewMedia}
                    muted
                    autoPlay
                    loop
                    className="max-w-[90vw] max-h-[90vh] rounded-md shadow-lg"
                  />
                ) : (
                  <img
                    src={previewMedia}
                    alt="Preview"
                    className="max-w-[90vw] max-h-[90vh] rounded-md shadow-lg"
                  />
                )}
                {/* Close Button */}
                <button
                  onClick={() => setPreviewMedia(null)} // Close modal
                  className="absolute top-3 right-3 text-[#ffe6a7] text-2xl font-bold cursor-pointer"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Links */}
        <div className="flex flex-col gap-3 bg-[#e1bb80] padding20 rounded-xl">
          <div className="flex flex-col gap-3">
            {
              user?.links?.map((link, index) => (
                <div key={index} className="flex items-center justify-between gap-3 border bg-[#e1bb80] text-[#432818] padding10 rounded-2xl overflow-hidden">
                  <div className="flex flex-col gap-2">
                    <h1 className="text-lg font-medium truncate">{link?.text}</h1>
                    <p className="md:flex hidden">{link?.url}</p>
                  </div>
                  {/* Delete */}
                  <i onClick={() => handleDeleteLink(index)} className="fa-solid fa-trash text-2xl padding10 cursor-pointer" />
                </div>
              ))
            }
          </div>

          {
            !user?.isPro && user?.links?.length >= 5 ? (
              <Link to="/admin/upgrade"><button className='bg-[#432818] text-[#ffe6a7] paddingy w-full rounded-full cursor-pointer flex items-center justify-center gap-2'>Upgrade to Pro</button></Link>
            ) : (
              <button onClick={() => setAddLinks(!addLinks)} className='bg-[#432818] text-[#ffe6a7] paddingy w-full rounded-full cursor-pointer flex items-center justify-center gap-2'><i className="fa-solid fa-link" />Add links</button>
            )
          }

          {
            user?.isPro && (
              <label className='w-full flex justify-center items-center'>
                {
                  user?.linkMedia ? (
                    <img className='md:w-24 w-20 md:h-24 h-20 rounded-full object-cover cursor-pointer'
                      src={user?.linkMedia} alt="pic" />
                  ) : (
                    <div className='w-full md:h-24 h-20 rounded-xl bg-[#432818] flex items-center justify-center cursor-pointer'>
                     <p className='text-[#ffe6a7] text-sm'>Upload Background Media</p>
                    </div>
                  )
                }
                <input accept="image/*,video/*" onChange={handleLinkMedia} type="file" className='hidden' />
              </label>
            )
          }


          {/* Add Links */}
          {
            addLinks && (
              <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50">
                <form onSubmit={handleAddLink} className="bg-[#ffe6a7] text-[#432818] flex flex-col gap-5 padding20 rounded-xl shadow-lg w-[80%] md:w-[40%]">
                  <h2 className="text-xl font-medium text-center">Add your links</h2>

                  <div className="flex items-center bg-[#e1bb80] padding10 rounded-2xl">
                    <input
                      type="text"
                      name="text"
                      placeholder="Link Text"
                      value={formData.links[0]?.text || ''}
                      onChange={(e) => {
                        const updatedLinks = [...formData.links];
                        updatedLinks[0].text = e.target.value;
                        setFormData({ ...formData, links: updatedLinks });
                      }}
                      className="bg-[#e1bb80] focus:outline-none w-full"
                      required
                    />
                  </div>

                  <div className="flex items-center bg-[#e1bb80] padding10 rounded-2xl">
                    <input
                      type="text"
                      name="url"
                      placeholder="Link URL"
                      value={formData.links[0]?.url || ''}
                      onChange={(e) => {
                        const updatedLinks = [...formData.links];
                        updatedLinks[0].url = e.target.value;
                        setFormData({ ...formData, links: updatedLinks });
                      }}
                      className="bg-[#e1bb80] focus:outline-none w-full"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#432818] text-[#ffe6a7] padding10 rounded-full cursor-pointer"
                  >
                    Save
                  </button>

                  <button
                    type='button'
                    onClick={() => setAddLinks(!addLinks)}
                    className="mt-3 w-full border-2 border-[#432818] hover:bg-[#432818] hover:text-[#ffe6a7] padding10 rounded-full cursor-pointer"
                  >
                    Cancel
                  </button>
                </form>
              </div>
            )}
        </div>

        {/* Theme */}
        {user?.isPro ? (
          <form onSubmit={handleThemeChange} className="flex flex-col text-center gap-3 bg-[#e1bb80] padding20 rounded-xl">
            <h1 className='text-2xl font-medium'>Theme</h1>
            <hr />
            <div className="flex  gap-3 justify-between items-center">
              {/* Color */}
              <div className="">
                <h1 className='whitespace-nowrap'>Color</h1>
                <input
                  type="color"
                  name="color"
                  placeholder="Primary Color"
                  value={formData.portfolio.theme.color}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      portfolio: {
                        ...prev.portfolio,
                        theme: {
                          ...prev.portfolio.theme,
                          color: e.target.value,
                        },
                      },
                    }))
                  }
                  className="input-class"
                />
              </div>
              {/* BackgroundColor */}
              <div className="">
                <h1 className='whitespace-nowrap'>Background Color</h1>
                <input
                  type="color"
                  name="backgroundColor"
                  placeholder="Background Color"
                  value={formData.portfolio.theme.backgroundColor}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      portfolio: {
                        ...prev.portfolio,
                        theme: {
                          ...prev.portfolio.theme,
                          backgroundColor: e.target.value,
                        },
                      },
                    }))
                  }
                  className="input-class"
                />
              </div>
              {/* Font */}
              <div className="">
                <h1 className='whitespace-nowrap'>Font</h1>
                <select value={formData.portfolio.theme.font} onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    portfolio: {
                      ...prev.portfolio,
                      theme: {
                        ...prev.portfolio.theme,
                        font: e.target.value,
                      },
                    },
                  }))
                } name="font" id="font" className='w-full border-2 paddind20 focus:outline-none'>
                  <option value="Poppins">Poppins</option>
                  <option value="Pacifico">Pacifico</option>
                  <option value="AbrilFatface">AbrilFatface</option>
                  <option value="JosefinSans">JosefinSans</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="HorstBlack">HorstBlack</option>
                </select>
              </div>
            </div>
            <button className='bg-[#432818] text-[#ffe6a7] padding10 rounded-full cursor-pointer'>Save</button>
          </form>
        ) : (
          <div className="flex flex-col text-center gap-3 bg-[#e1bb80] padding20 rounded-xl">
            <h1 className='text-2xl font-medium'>Theme</h1>
            <Link to="/admin/upgrade"><button className='bg-[#432818] text-[#ffe6a7] w-full padding10 rounded-full cursor-pointer'>Upgrade to Pro</button></Link>
          </div>
        )}

        {/* About */}
        <form onSubmit={handleAboutSubmit} className="flex flex-col gap-3 bg-[#e1bb80] padding20 rounded-xl">
          <h1 className='text-2xl font-medium text-center'>About</h1>
          <div className="flex md:flex-row flex-col justify-between items-center gap-5">
            <label>
              <img className='md:w-48 w-full rounded-2xl object-contain cursor-pointer' src={user?.about.image || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"} alt="Image" />
              <input accept="image/*" onChange={handleAboutImageChange} type="file" className="hidden" />
            </label>
            <div className="flex flex-col gap-3 w-full">
              <input onChange={handleAboutChange} value={formData.about.title || ""} className='bg-[#ffe6a7] focus:outline-none padding10 rounded-xl' placeholder='Title' name='title' type="text" />
              <textarea onChange={handleAboutChange} value={formData.about.description || ""} className='bg-[#ffe6a7] focus:outline-none padding10 rounded-xl' placeholder='Description' name="description"></textarea>
              <input onChange={handleAboutChange} value={formData.about.resume || ""} className='bg-[#ffe6a7] focus:outline-none padding10 rounded-xl' placeholder='URL (resume or other)' name='resume' type="text" />
            </div>

          </div>
          <button type='submit' className='bg-[#432818] text-[#ffe6a7] padding10 rounded-full cursor-pointer'>Save</button>
        </form>
      </div>

      {/* Preview */}
      {
        !previewMedia && (
          <Link to={`/${user?.username}`}>
            <button className='bg-[#432818] text-[#ffe6a7] fixed text-center md:left-[50%] left-[33%] bottom-20 paddingy rounded-full cursor-pointer z-50'>Preview</button>
          </Link>
        )
      }
    </div>
  );
};

export default Dashboard;