import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const PostEditor = ({ onSubmit, post, isEditMode }) => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [page, setPage] = useState("");

  // If in edit mode, populate the form with the existing post data
  useEffect(() => {
    if (isEditMode && post) {
      setTitle(post.title);
      setContent(post.content);
      setPage(post.page);
    }
  }, [isEditMode, post]);

  const handleSubmit = () => {
    if (title && content && page) {
      onSubmit({ title, content, page, id: post?.id }); // Pass post ID if editing
    } else {
      alert("All fields are required!");
    }
  };

  return (
    <div>
      <h2>{isEditMode ? "Edit Post" : "Create a New Post"}</h2>
      <input
        type="text"
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ display: "block", marginBottom: "10px", width: "100%" }}
      />
      <select
        value={page}
        onChange={(e) => setPage(e.target.value)}
        style={{ display: "block", marginBottom: "10px", width: "100%" }}
      >
        <option value="">Select Page</option>
        <option value="recipe">Recipe</option>
        <option value="blog">Blog</option>
        <option value="products-review">Products Review</option>
      </select>
      <ReactQuill value={content} onChange={setContent} />
      <button onClick={handleSubmit} style={{ marginTop: "10px" }}>
        {isEditMode ? "Update Post" : "Submit Post"}
      </button>
    </div>
  );
};

export default PostEditor;
