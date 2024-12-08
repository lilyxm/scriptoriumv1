import React, { useState, useEffect } from "react";
import { BlogPost, CodeTemplate, User } from "../../utils/types";
import Header from "@/components/header";
import CodeTemplateList from "@/components/codetemplate";
import { useRouter } from "next/router";
import BlogPostList from "@/components/blogpost";

const UserProfilePage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [user, setUser] = useState<User | null>(null);
  const [topCodeTemplates, setTopCodeTemplates] = useState<CodeTemplate[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [topBlogPosts, setTopBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);

    if (id) {
      const fetchUserDetails = async () => {
        try {
          const res = await fetch(`/api/users/profile?id=${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (res.ok && data) {
            setUser(data.profile);
          } else {
            console.error("Failed to fetch user details");
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };

      const fetchTopCodeTemplates = async () => {
        try {
          const res = await fetch(
            `/api/code/templates?authorId=${id}&pageSize=4`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const data = await res.json();
          if (res.ok && data) {
            setTopCodeTemplates(data.codeTemplates);
          } else {
            console.error("Failed to fetch top code templates");
          }
        } catch (error) {
          console.error("Error fetching top code templates:", error);
        }
      };

      const fetchTopBlogPosts = async () => {
        try {
          const res = await fetch(`/api/users/getOwnBlogs?limit=3`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (res.ok && data) {
            setTopBlogPosts(data);
          } else {
            alert(`Failed to fetch top blog posts: ${data.message}`);
          }
        } catch (error) {
          alert(`Error fetching top blog posts: ${error}`);
        }
      };

      fetchUserDetails();
      fetchTopCodeTemplates();
      fetchTopBlogPosts();
    }
  }, [id]);

  return (
    <div>
      <Header isAuthenticated={isAuthenticated} />
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* User Info Section */}
          <div className="text-center border-b md:border-b-0 md:border-r border-gray-300 dark:border-gray-600 pb-6 md:pb-0">
            {user && (
              <>
                <img
                  src={user.avatar || "/user-avatar.png"}
                  alt={`${user.username}'s avatar`}
                  className="w-32 h-32 md:w-48 md:h-48 rounded-full mx-auto"
                />
                <h2 className="text-xl font-semibold mt-4 dark:text-gray-200">
                  {user.username}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                <p className="text-gray-600 dark:text-gray-400">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {user.phoneNumber}
                </p>
                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-400"
                  onClick={() => (window.location.href = `/user/${id}/edit`)}
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>

          {/* My Code Templates */}
          <div className="col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-semibold dark:text-gray-200">
                  My Code Templates
                </h2>
                <div className="mt-4">
                  <CodeTemplateList
                    codeTemplates={topCodeTemplates}
                    isManage={false}
                  />
                  {topCodeTemplates.length > 0 && (
                    <div className="mt-4 text-right">
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-400"
                        onClick={() =>
                          (window.location.href = `/user/${id}/manage?manage=code`)
                        }
                      >
                        See More
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* My Blog Posts */}
              <div>
                <h2 className="text-2xl font-semibold dark:text-gray-200">
                  My Blog Posts
                </h2>
                <div className="mt-4">
                  <BlogPostList blogs={topBlogPosts || []} isManage={false} />
                  {topBlogPosts.length > 0 && (
                    <div className="mt-4 text-right">
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-400"
                        onClick={() =>
                          (window.location.href = `/user/${id}/manage?manage=blog`)
                        }
                      >
                        See More
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
