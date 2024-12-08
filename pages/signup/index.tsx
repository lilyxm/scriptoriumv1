import React, { useState } from "react";
import { useRouter } from "next/router";

const SignUp: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, role, adminSecret }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Logged in:", data);
        localStorage.setItem("authToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        router.push("/signin");
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to sign in");
      }
    } catch (error) {
      setError("Failed to sign in");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className=" p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full p-2 border border-gray-300 rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-2 border border-gray-300 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Select Role:
            </label>
            <select
              id="role"
              className="w-full p-2 border border-gray-300 rounded"
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {role === "ADMIN" && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="adminSecret">
                Admin Secret
              </label>
              <input
                type="text"
                id="adminSecret"
                value={adminSecret}
                className="w-full p-2 border border-gray-300 rounded"
                onChange={(e) => setAdminSecret(e.target.value)}
                required
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
