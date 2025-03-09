import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

function AddUpscModal() {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState(""); // Specific Topic Field
  const [mergedTopics, setMergedTopics] = useState(""); // Additional General Topics Field
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);

  const upscSubjects = [
    "History",
    "Polity",
    "Geography",
    "Economy",
    "Science & Tech",
    "Ethics",
    "Essay",
    "International Relations",
  ];

  const generateQuestion = async () => {
    if (!subject) {
      alert("Please select a subject first.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "https://test0xfafa5555.onrender.com/generate-question",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subject, topic, mergedTopics }), // Sending all inputs
        }
      );

      const data = await response.json();
      setTitle(data.question || "No question generated.");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate question.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content.trim()) {
      alert(
        "Please generate a question and write an answer before submitting."
      );
      return;
    }

    try {
      await axios.post("https://test0xfafa5555.onrender.com:5000/post", {
        title,
        content,
        categories: [subject],
        author: author.trim() === "" ? "Anonymous" : author,
        city: city.trim() === "" ? "Anonymous" : city,
        ctype: "upsc",
      });

      setTitle("");
      setContent("");
      setSubject("");
      setTopic("");
      setMergedTopics(""); // Reset merged topics
      setAuthor("");
      setCity("");
      document.getElementById("upscModalClose").click();
    } catch (error) {
      console.error("Error submitting UPSC post:", error);
    }
  };

  return (
    <div className="modal fade" id="upscModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">UPSC Answer Writing</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              id="upscModalClose"
            ></button>
          </div>
          <div className="modal-body d-flex flex-column">
            <label className="mb-1">Select UPSC Subject:</label>
            <select
              className="form-select mb-2"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="">Choose a Subject</option>
              {upscSubjects.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>

            <label className="mb-1">Specify Topic (Optional):</label>
            <input
              className="form-control mb-2"
              type="text"
              placeholder="Enter a specific topic for question (optional)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />

            <label className="mb-1">
              Merge Other General Topics (Optional):
            </label>
            <input
              className="form-control mb-2"
              type="text"
              placeholder="Enter related general topics to merge (optional)"
              value={mergedTopics}
              onChange={(e) => setMergedTopics(e.target.value)}
            />

            <button
              className="btn btn-primary mb-2"
              onClick={generateQuestion}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Question"}
            </button>

            <textarea
              className="form-control mb-2"
              placeholder="Generated Question"
              value={title}
              readOnly
              rows={Math.min(10, Math.max(2, Math.ceil(title.length / 50)))}
            />

            <div
              className="quill-container flex-grow-1"
              style={{ height: "300px", overflowY: "auto" }}
            >
              <ReactQuill
                value={content}
                onChange={setContent}
                placeholder="Write your answer here..."
                style={{
                  minHeight: "200px",
                  borderRadius: "4px",
                  padding: "10px",
                  border: "none",
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
              Submit Answer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddUpscModal;
