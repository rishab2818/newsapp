// Full Correct App.js - Related Posts Restored & Answer Modal Sized Correctly
import React, { useState, useEffect } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Navbar from "./Sidebar"; // Rename Sidebar.js to Navbar.js if needed
import CategoryFilter from "./CategoryFilter";
import ClaimCoins from "./ClaimCoins";
import AddPostModal from "./AddPostModal";
import AddUpscModal from "./AddUpscModal";
import AnswerModal from "./AnswerModal";
import {
  fetchPosts,
  fetchAnswers,
  submitAnswer,
  likePost,
  likeAnswer,
} from "./api";
import sanitizeHtml from "sanitize-html";
///bookmark
function App() {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPost, setSelectedPost] = useState(null);
  const [toggle, setToggle] = useState("news");
  const [postAnswers, setPostAnswers] = useState([]);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const answersPerPage = 2;
  const [filterType, setFilterType] = useState("all");
  const [expandedAnswers, setExpandedAnswers] = useState([]);

  const toggleExpand = (id) => {
    setExpandedAnswers((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    fetchPosts(toggle).then(setPosts);
  }, [toggle]);
  useEffect(() => {
    if (selectedPost) fetchAnswers(selectedPost._id).then(setPostAnswers);
  }, [selectedPost]);

  const handleSubmitAnswer = async (content) => {
    if (!content.trim()) return;
    await submitAnswer(selectedPost._id, content);
    fetchAnswers(selectedPost._id).then(setPostAnswers);
    setShowAnswerModal(false);
  };

  const handleLikePost = async (id) => {
    await likePost(id);
    fetchPosts(toggle).then(setPosts);
  };
  const handleLikeAnswer = async (id) => {
    await likeAnswer(id);

    // Update the liked answer locally without re-fetching all
    setPostAnswers((prevAnswers) =>
      prevAnswers.map((ans) =>
        ans._id === id ? { ...ans, likes: ans.likes + 1 } : ans
      )
    );
  };

  const filterPosts = () => {
    const now = new Date();
    return [...posts]
      .filter((post) => {
        const postDate = new Date(post.createdAt); // Ensure `createdAt` exists in your API
        console.log(postDate);
        if (filterType === "trending") {
          return post.likes > 0;
        }
        if (filterType === "week") {
          return (
            post.likes > 0 && (now - postDate) / (1000 * 60 * 60 * 24) <= 7
          );
        }
        if (filterType === "day") {
          return (
            post.likes > 0 && (now - postDate) / (1000 * 60 * 60 * 24) <= 1
          );
        }
        if (filterType === "month") {
          return (
            post.likes > 0 && (now - postDate) / (1000 * 60 * 60 * 24) <= 30
          );
        }
        if (filterType === "most-liked") {
          return true;
        }
        return true;
      })
      .sort((a, b) => (filterType === "most-liked" ? b.likes - a.likes : 0));
  };
  const filteredPosts = filterPosts().filter((post) =>
    selectedCategory === "All"
      ? true
      : post.categories.includes(selectedCategory)
  );

  const indexOfLastAnswer = currentPage * answersPerPage;
  const indexOfFirstAnswer = indexOfLastAnswer - answersPerPage;
  const currentAnswers = postAnswers.slice(
    indexOfFirstAnswer,
    indexOfLastAnswer
  );
  const totalPages = Math.ceil(postAnswers.length / answersPerPage);

  return (
    <Router>
      <Navbar
        handleHomeClick={() => setSelectedPost(null)}
        toggle={toggle}
        setToggle={setToggle}
      />

      <div className="container-fluid mt-5">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
                  <select
                    className="form-select w-auto"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">All Posts</option>
                    <option value="trending">Trending (Liked Posts)</option>
                    <option value="week">Top in 1 Week</option>
                    <option value="day">Top in 1 Day</option>
                    <option value="month">Top in 1 Month</option>
                    <option value="most-liked">Most Liked Overall</option>
                  </select>
                  <CategoryFilter
                    setSelectedCategory={setSelectedCategory}
                    selectedCategory={selectedCategory}
                    ctype={toggle}
                  />
                </div>
                <AddPostModal
                  fetchPosts={() => fetchPosts(toggle).then(setPosts)}
                />
                <AddUpscModal
                  fetchPosts={() => fetchPosts(toggle).then(setPosts)}
                />
                <AnswerModal
                  show={showAnswerModal}
                  onClose={() => setShowAnswerModal(false)}
                  onSubmit={handleSubmitAnswer}
                />
                {selectedPost ? (
                  <div className="row">
                    <div className="col-md-9">
                      <div className="card shadow-sm border-0 p-3">
                        <h6
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(selectedPost.title),
                          }}
                        />
                        <p className="text-muted">
                          Author: {selectedPost.author || "Anonymous"} | City:{" "}
                          {selectedPost.city || "Anonymous"}
                        </p>
                        <div
                          className="card-text"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(selectedPost.content),
                          }}
                        />
                        <div className="d-flex justify-content-between mt-2">
                          <button
                            className="btn btn-outline-primary fixed-button"
                            onClick={() => handleLikePost(selectedPost._id)}
                          >
                            👍 Like ({selectedPost.likes})
                          </button>

                          <button
                            className="btn btn-outline-primary fixed-button"
                            onClick={() => setShowAnswerModal(true)}
                          >
                            ✍️ Write Answer
                          </button>
                        </div>
                        <div className="mt-4 mb-4">
                          <h5>Suggested Answers</h5>
                          {currentAnswers.length > 0 ? (
                            currentAnswers.map((answer, index) => (
                              <div key={index} className="card mb-2">
                                <div className="card-body">
                                  <div
                                    className="answer-container"
                                    style={{
                                      maxHeight: expandedAnswers.includes(
                                        answer._id
                                      )
                                        ? "300px"
                                        : "150px",
                                      overflowY: expandedAnswers.includes(
                                        answer._id
                                      )
                                        ? "auto"
                                        : "hidden",
                                      transition: "max-height 0.3s ease-in-out",
                                    }}
                                  >
                                    <p
                                      dangerouslySetInnerHTML={{
                                        __html: sanitizeHtml(answer.content),
                                      }}
                                    />
                                  </div>

                                  {/* Buttons in a row with Like on the left and Read More on the right */}
                                  <div className="d-flex justify-content-between mt-2">
                                    <button
                                      className="btn btn-outline-primary like-button-sm"
                                      onClick={() =>
                                        handleLikeAnswer(answer._id)
                                      }
                                    >
                                      👍 Like ({answer.likes})
                                    </button>

                                    <button
                                      className="btn btn-link p-0"
                                      onClick={() => toggleExpand(answer._id)}
                                    >
                                      {expandedAnswers.includes(answer._id)
                                        ? "Read Less"
                                        : "Read More"}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p>
                              No answers yet. Be the first to provide your
                              answer!
                            </p>
                          )}

                          <div className="pagination mt-3">
                            {Array.from({ length: totalPages }, (_, i) => (
                              <button
                                key={i}
                                className={`btn ${
                                  i + 1 === currentPage
                                    ? "btn-primary"
                                    : "btn-outline-primary"
                                } mx-1`}
                                onClick={() => setCurrentPage(i + 1)}
                              >
                                {i + 1}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 ps-3 mt-4">
                      <h5>Related Posts</h5>
                      {filteredPosts
                        .filter((post) => post._id !== selectedPost._id)
                        .slice(0, 3)
                        .map((post) => (
                          <div
                            key={post._id}
                            className="card mb-3 shadow-sm border-0 p-3"
                          >
                            <h6
                              dangerouslySetInnerHTML={{
                                __html: sanitizeHtml(post.title),
                              }}
                            />
                            <p className="text-muted">
                              Author: {post.author || "Anonymous"}
                            </p>
                            <div className="content-wrapper">
                              <p
                                className="text-truncate smaller-text"
                                dangerouslySetInnerHTML={{
                                  __html: sanitizeHtml(
                                    post.content.substring(0, 100)
                                  ),
                                }}
                              />
                            </div>
                            <button
                              className="btn btn-link"
                              onClick={() => setSelectedPost(post)}
                            >
                              Read More
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="row">
                    {filteredPosts.map((post) => (
                      <div key={post._id} className="col-md-6 mb-4 d-flex">
                        <div
                          className="card shadow-sm border-0 flex-grow-1 d-flex flex-column"
                          onClick={() => setSelectedPost(post)}
                          style={{ cursor: "pointer", minHeight: "100%" }} // Ensures equal height
                        >
                          <div className="card-body d-flex flex-column">
                            {/* Multi-line Truncate Title with Hover Effect */}
                            <h6
                              className="card-title"
                              title={sanitizeHtml(post.title)} // Full title on hover
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 3, // Show up to 3 lines before truncating
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                              dangerouslySetInnerHTML={{
                                __html: sanitizeHtml(post.title),
                              }}
                            />

                            <p className="card-text text-muted">
                              Author: {post.author || "Anonymous"}
                            </p>

                            <p
                              className="card-text flex-grow-1 text-truncate"
                              dangerouslySetInnerHTML={{
                                __html: sanitizeHtml(
                                  post.content.substring(0, 100)
                                ),
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            }
          />
          <Route path="/claim-coins" element={<ClaimCoins />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
