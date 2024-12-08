import React from "react";

import AdminBlogPosts from "@/components/admin/AdminBlogPosts";
import Header from '@/components/header';

const AdminBlogs = () => {
    return (
        <div>
            <Header isAuthenticated={true} />
            <div className="container mx-auto p-4">
                <AdminBlogPosts />
            </div>
        </div>
    );
};

export default AdminBlogs;
