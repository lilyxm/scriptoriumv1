import React from "react";

import AdminComments from "@/components/admin/AdminComments";
import Header from '@/components/header';

const AdminBlogs = () => {



    return (
        <div>
            <Header isAuthenticated={true} />
            <div className="container mx-auto p-4">
                <AdminComments />
            </div>
        </div>
    );
};

export default AdminBlogs;
