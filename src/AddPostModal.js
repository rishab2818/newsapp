import React, { useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill"; // Importing Quill editor
import "react-quill/dist/quill.snow.css"; // Importing Quill's CSS for rich text

function AddPostModal({ fetchPosts }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // This will store the rich-text content
  const [categories, setCategories] = useState([]);
  const [author, setAuthor] = useState("");
  const [city, setCity] = useState("");

  // Handle content change
  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (categories.length < 1 || categories.length > 3) {
      alert("Please select between 1 and 3 categories.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/post", {
        title,
        content,
        categories,
        author: author.trim() === "" ? "Anonymous" : author,
        city: city.trim() === "" ? "Anonymous" : city,
        ctype: "news",
      });
      fetchPosts();
      setTitle("");
      setContent("");
      setCategories([]);
      setAuthor("");
      setCity("");
      document.getElementById("postModalClose").click();
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setCategories((prevCategories) =>
      prevCategories.includes(value)
        ? prevCategories.filter((cat) => cat !== value)
        : [...prevCategories, value]
    );
  };

  return (
    <div className="modal fade" id="postModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add News Post</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              id="postModalClose"
            ></button>
          </div>
          <div className="modal-body d-flex flex-column">
            <input
              className="form-control mb-2"
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {/* Rich Text Editor for Content */}
            <div
              className="quill-container flex-grow-1"
              style={{
                height: "300px",
                borderRadius: "4px",
                padding: "10px",
                border: "1px solid #ccc", // Ensure border to properly show editor
                backgroundColor: "#fff",
              }}
            >
              <ReactQuill
                value={content}
                onChange={handleContentChange}
                placeholder="Write your article content here..."
                className="custom-quill"
                modules={{
                  toolbar: [
                    [{ header: "1" }, { header: "2" }, { font: [] }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["bold", "italic", "underline"],
                    ["link", "image"],
                    [{ align: [] }],
                    ["blockquote", "code-block"],
                  ],
                }}
              />
            </div>
            <input
              className="form-control mb-2"
              type="text"
              placeholder="Author (optional)"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            <input
              className="form-control mb-2"
              type="text"
              placeholder="City (optional)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            {/* Category Selection */}
            <label className="mb-1">Select Categories:</label>
            <div className="d-flex flex-wrap">
              {["Tech", "Global", "National", "Lifestyle"].map((cat) => (
                <div key={cat} className="form-check me-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    value={cat}
                    checked={categories.includes(cat)}
                    onChange={handleCategoryChange}
                  />
                  <label className="form-check-label">{cat}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddPostModal;
