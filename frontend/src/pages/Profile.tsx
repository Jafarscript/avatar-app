import React, { useEffect, useState } from "react";
import { type ProfileForm, type User } from "../type";
import axios from "axios";
import { useNavigate } from "react-router";

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState<ProfileForm>({ displayName: "", bio: "" });
  const [error, setError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${API}/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setUserData(response.data);
        setProfileForm({ displayName: response.data.displayName, bio: response.data.bio });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setError("");
    setProfileSuccess(false);
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const updateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileLoading(true);
    axios
      .patch(`${API}/profile`, profileForm, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setUserData(response.data);
        setProfileSuccess(true);
        setProfileLoading(false);
      })
      .catch((error) => {
        setError(error.response?.data?.message || "Update failed");
        setProfileLoading(false);
      });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      // Show preview before uploading
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!avatarFile) return setError("Please select an image first");
    setAvatarLoading(true);
    const formData = new FormData();
    formData.append("avatar", avatarFile);
    axios
      .patch(`${API}/profile/avatar`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        if (userData) setUserData({ ...userData, avatar: response.data.avatar });
        setAvatarFile(null);
        setAvatarPreview("");
        setAvatarLoading(false);
      })
      .catch((error) => {
        setError(error.response?.data?.message || "Upload failed");
        setAvatarLoading(false);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e0e10] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-[#c8f5a0] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen bg-[#0e0e10]">

      {/* Navbar */}
      <nav className="bg-[#17171a] border-b border-[#2a2a2f] px-4 lg:px-8 h-14 flex items-center justify-between">
        <div style={{ fontFamily: "'Syne', sans-serif" }} className="flex items-center gap-2 text-[#c8f5a0] text-lg font-bold tracking-tight">
          <span className="w-2 h-2 rounded-full bg-[#c8f5a0] inline-block"></span>
          ProfileSpace
        </div>
        <button
          onClick={handleLogout}
          className="border border-[#2e2e36] text-[#8a8a96] hover:border-red-500 hover:text-red-400 text-sm px-4 py-1.5 rounded-lg cursor-pointer transition-all bg-transparent"
        >
          Sign out
        </button>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">

        {/* Profile card */}
        <div className="bg-[#17171a] border border-[#2a2a2f] rounded-2xl p-6 flex items-center gap-5">
          <div className="relative shrink-0">
            <img
              src={
                avatarPreview ||
                (userData?.avatar ? `${API}/${userData.avatar}` : `https://ui-avatars.com/api/?name=${userData?.displayName}&background=c8f5a0&color=0e0e10&size=80`)
              }
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover border-2 border-[#2a2a2f]"
            />
            {avatarPreview && (
              <span className="absolute -bottom-1 -right-1 bg-[#c8f5a0] text-[#0e0e10] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                Preview
              </span>
            )}
          </div>
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif" }} className="text-xl font-semibold text-[#f0f0f2]">
              {userData?.displayName}
            </h1>
            <p className="text-sm text-[#6b6b75]">@{userData?.userName}</p>
            {userData?.bio && <p className="text-sm text-[#8a8a96] mt-1">{userData.bio}</p>}
          </div>
        </div>

        {/* Update profile form */}
        <div className="bg-[#17171a] border border-[#2a2a2f] rounded-2xl p-6">
          <h2 style={{ fontFamily: "'Syne', sans-serif" }} className="text-base font-semibold text-[#f0f0f2] mb-5">
            Edit profile
          </h2>
          <form onSubmit={updateSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[11px] font-medium text-[#8a8a96] uppercase tracking-widest mb-1.5">
                Display name
              </label>
              <input
                onChange={handleChange}
                type="text"
                name="displayName"
                value={profileForm.displayName}
                className="w-full bg-[#1e1e22] border border-[#2e2e36] rounded-xl px-4 py-3 text-sm text-[#f0f0f2] outline-none focus:border-[#c8f5a0] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#8a8a96] uppercase tracking-widest mb-1.5">
                Bio
              </label>
              <textarea
                onChange={handleChange}
                name="bio"
                value={profileForm.bio}
                rows={3}
                placeholder="Tell people a bit about yourself..."
                className="w-full bg-[#1e1e22] border border-[#2e2e36] rounded-xl px-4 py-3 text-sm text-[#f0f0f2] placeholder-[#44444e] outline-none focus:border-[#c8f5a0] transition-colors resize-none"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm flex items-center gap-1.5">
                <span>⚠</span> {error}
              </p>
            )}
            {profileSuccess && (
              <p className="text-[#c8f5a0] text-sm flex items-center gap-1.5">
                <span>✓</span> Profile updated
              </p>
            )}

            <button
              type="submit"
              disabled={profileLoading}
              style={{ fontFamily: "'Syne', sans-serif" }}
              className="self-end bg-[#c8f5a0] hover:bg-[#b5ef88] disabled:opacity-50 disabled:cursor-not-allowed text-[#0e0e10] font-medium text-sm rounded-xl px-6 py-2.5 cursor-pointer transition-colors"
            >
              {profileLoading ? "Saving..." : "Save changes"}
            </button>
          </form>
        </div>

        {/* Avatar upload */}
        <div className="bg-[#17171a] border border-[#2a2a2f] rounded-2xl p-6">
          <h2 style={{ fontFamily: "'Syne', sans-serif" }} className="text-base font-semibold text-[#f0f0f2] mb-1">
            Profile photo
          </h2>
          <p className="text-xs text-[#6b6b75] mb-5">JPG, PNG or WebP. Max 2MB.</p>

          <form onSubmit={handleAvatarSubmit} className="flex flex-col gap-4">
            <label className="flex items-center gap-3 bg-[#1e1e22] border border-dashed border-[#2e2e36] hover:border-[#c8f5a0] rounded-xl px-4 py-4 cursor-pointer transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="#6b6b75" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <span className="text-sm text-[#6b6b75]">
                {avatarFile ? avatarFile.name : "Choose a photo to upload"}
              </span>
              <input
                onChange={handleFile}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                name="avatar"
                className="hidden"
              />
            </label>

            <button
              type="submit"
              disabled={!avatarFile || avatarLoading}
              style={{ fontFamily: "'Syne', sans-serif" }}
              className="self-start bg-[#c8f5a0] hover:bg-[#b5ef88] disabled:opacity-40 disabled:cursor-not-allowed text-[#0e0e10] font-medium text-sm rounded-xl px-6 py-2.5 cursor-pointer transition-colors"
            >
              {avatarLoading ? "Uploading..." : "Upload photo"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Profile;