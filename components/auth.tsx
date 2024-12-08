import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: number;
  role: string;
}

const AuthComponent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("/api/user/getIDandRole", {
          headers: {
            Authorization: `Bearer`,
          },
          data: {
            token: `${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>User ID: {user.id}</p>
      <p>User Role: {user.role}</p>
    </div>
  );
};

export default AuthComponent;
