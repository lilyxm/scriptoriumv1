import React from "react";
import { useRouter } from "next/router";

interface CodeBlogCommentHdrProps {
  current: string;
}

const ManageHeader: React.FC<CodeBlogCommentHdrProps> = ({ current }) => {
  const router = useRouter();
  const { id } = router.query;
  const handleClick = (type: string) => {
    router.push({
      pathname: `/user/${id}/manage`,
      query: { manage: type },
    });
  };

  return (
    <div className="flex justify-center space-x-4 text-4xl">
      <button
        onClick={() => handleClick("code")}
        disabled={current === "code"}
        className={`text-xl ${current === "code" ? "underline" : ""}`}
      >
        Code
      </button>
      <button
        onClick={() => handleClick("blog")}
        disabled={current === "blog"}
        className={`text-xl ${current === "blog" ? "underline" : ""}`}
      >
        Blog
      </button>
    </div>
  );
};

export default ManageHeader;
