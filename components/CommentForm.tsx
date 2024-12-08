import React, { useRef, useEffect } from "react";

interface CommentFormProps {
    newComment: string;
    setNewComment: (comment: string) => void;
    handleCommentSubmit: (e: React.FormEvent) => void;
    setShowForm: (show: boolean) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
    newComment,
    setNewComment,
    handleCommentSubmit,
    setShowForm,
}) => {
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (formRef.current && !formRef.current.contains(event.target as Node)) {
                setShowForm(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setShowForm]);

    return (
        <form
            ref={formRef}
            onSubmit={handleCommentSubmit}
            className="mt-4 bg-white dark:bg-gray-800 shadow-md rounded-lg p-4"
        >
            <textarea
                className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                rows={4}
                placeholder="Write your comment here..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="flex justify-end mt-4">
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition"
                >
                    Submit
                </button>
            </div>
        </form>
    );
};

export default CommentForm;
