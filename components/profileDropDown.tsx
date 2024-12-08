import React, { useState } from "react";
import { useRouter } from "next/router";

interface ProfileDropDownProps {
  token: string;
  userName: string;
  userPhoto: string;
  id: number;
}

const ProfileDropDown: React.FC<ProfileDropDownProps> = ({
  token,
  userName,
  userPhoto,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const onLogout = () => {
    localStorage.clear();
    router.push("/");
    router.reload();
  };

  const onViewHome = () => router.push(`/user/${id}`);
  const onEditProfile = () => router.push(`/user/${id}/edit`);
  const onManage = () => router.push(`/user/${id}/manage?manage=code`);

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        className="flex items-center space-x-2 focus:outline-none"
        onClick={toggleDropdown}
        onDoubleClick={onViewHome}
      >
        <img
          src={userPhoto || "/default-avatar.png"}
          alt="User Avatar"
          className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-gray-600"
        />
        <span className="text-gray-700 dark:text-gray-300 font-medium">
          {userName}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <ul className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 text-black dark:text-gray-200">
          <li className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 text-sm">
            <p className="font-medium">{userName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">ID: {id}</p>
          </li>
          <li
            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            onClick={onViewHome}
          >
            View Profile
          </li>
          <li
            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            onClick={onEditProfile}
          >
            Edit Profile
          </li>
          <li
            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            onClick={onManage}
          >
            Manage My Content
          </li>
          <li
            className="px-4 py-2 hover:bg-red-100 dark:hover:bg-red-600 cursor-pointer text-red-500 dark:text-red-400"
            onClick={onLogout}
          >
            Logout
          </li>
        </ul>
      )}
    </div>
  );
};

export default ProfileDropDown;
