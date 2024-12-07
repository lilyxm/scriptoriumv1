import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlogPost } from '../utils/types';

const LandingPage: React.FC = () => {
    const [topBlogs, setTopBlogs] = useState<BlogPost[]>([]);

    useEffect(() => {
        // Fetch top blog posts
        const fetchTopBlogs = async () => {
            try {
                const res = await fetch('/api/blogs?sortBy=value&limit=5');
                console.log('Response:', res);
                const data = await res.json();
                console.log('Data:', data);
                if (res.ok && data) {
                    setTopBlogs(data);
                    console.log('Top Blogs:', data);
                } else {
                    console.error('Failed to fetch top blogs');
                }
            } catch (error) {
                console.error('Error fetching top blogs:', error);
            }
        };
        fetchTopBlogs();
    }, []);

    return (
        <div className="container mx-auto p-4 text-center">
            <h1 className="text-4xl font-bold">Welcome to Scriptorium</h1>
            <p className="text-lg mt-2">Your one-stop platform for blogs and code templates</p>
            <div className="mt-8">
                <h2 className="text-2xl font-semibold">Top Blog Posts</h2>
                <ul className="mt-4">
                    {topBlogs.length > 0 ? (
                        topBlogs.map((blog) => (
                            <li key={blog.id} className="mb-4">
                                <span className="text-xl text-blue-600">{blog.title}</span>
                                <p className="text-gray-600">{blog.description}</p>
                                <div className="flex justify-center items-center mt-2">
                                    <span className="mr-4">Upvotes: {blog.upVotes}</span>
                                    <span>Downvotes: {blog.downVotes}</span>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>No top blog posts available.</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default LandingPage;