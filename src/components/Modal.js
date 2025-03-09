import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Modal = ({ id, title, fields, content, setContent, handleSubmit }) => {
  return (
    <div className="modal fade" id={id} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              id={`${id}Close`}
            ></button>
          </div>
          <div className="modal-body d-flex flex-column">
            {fields.map(({ type, placeholder, value, onChange }, index) => (
              <input
                key={index}
                className="form-control mb-2"
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
              />
            ))}
            <ReactQuill
              value={content}
              onChange={setContent}
              placeholder="Write here..."
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
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
