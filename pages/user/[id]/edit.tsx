import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "@/components/header";
import { User } from "@/utils/types";
import { refreshToken } from "@/utils/refresh";

const EditProfile: React.FC = () => {
  const router = useRouter();
  const { id } = router.query; // Correctly fetch user ID from the query
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setIsAuthenticated(false);
      router.push("/signin");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const res = await fetch(`/api/users/profile?id=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data.profile);
        } else {
          console.error("Failed to fetch user details:", data.message);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    setIsAuthenticated(true);
    if (id) {
      fetchUserDetails();
    }
  }, [id, router]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
      if (user) {
        setUser({ ...user, avatar: event.target.files[0].name });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    try {
      if (image) {
        const formData = new FormData();
        formData.append("file", image);

        const uploadResponse = await fetch(`/api/users/uploadAvatar`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: formData,
        });

        if (!uploadResponse.ok) {
          alert("Failed to upload profile picture.");
          return;
        }
      }

      const response = await fetch(`/api/users/profile?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
        }),
      });

      if (response.ok) {
        alert("Profile updated successfully!");
        router.push(`/user/${id}`);
      } else if (response.status === 401 || response.status === 403) {
        alert("You need to sign in to save the changes.");
      } else if (response.status === 400) {
        alert("Please fill in all required fields.");
      } else if (response.status === 402) {
        refreshToken();
      } else {
        console.error("Error updating profile");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while saving changes.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div>
      <Header isAuthenticated={isAuthenticated} />
      <main>
        <h1 className="text-center text-4xl font-bold my-4">Edit Profile</h1>
        {user && (
          <form
            className="max-w-xl mx-auto p-6 shadow-md rounded-lg bg-white dark:bg-gray-800"
            onSubmit={handleSubmit}
          >
            {/* Username (Read-only) */}
            <div className="mb-4">
              <label
                className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={user.username}
                readOnly
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label
                className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email || ""}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            {/* First Name */}
            <div className="mb-4">
              <label
                className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                htmlFor="firstName"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={user.firstName || ""}
                onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            {/* Last Name */}
            <div className="mb-4">
              <label
                className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                htmlFor="lastName"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={user.lastName || ""}
                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            {/* Phone Number */}
            <div className="mb-4">
              <label
                className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                htmlFor="phoneNumber"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={user.phoneNumber || ""}
                onChange={(e) =>
                  setUser({ ...user, phoneNumber: e.target.value })
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            {/* Profile Picture */}
            <div className="mb-4">
              <label
                className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                htmlFor="profilePicture"
              >
                Profile Picture
              </label>
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                accept="image/*"
                onChange={handleImageChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

export default EditProfile;
