import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import { getJournalById, editJournal } from "../actions/journal.action";
import "./EditJournal.css";

const EditJournal = () => {
  const { id } = useParams(); // Get journal ID from the URL
  const [journal, setJournal] = useState({ title: "", content: "" });
  const [isSidebarVisible, setSidebarVisible] = useState(false); // Sidebar visibility state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const response = await getJournalById(id); // Fetch journal by ID
        if (response.success) {
          setJournal({
            title: response.data.journal_title,
            content: response.data.journal_content,
          });
        } else {
          console.error("Failed to load journal:", response.data);
        }
      } catch (error) {
        console.error("Error fetching journal:", error);
      }
    };

    fetchJournal();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJournal((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await updateJournal(id, journal); // Update journal by ID
      if (response.success) {
        alert("Journal updated successfully!");
        navigate("/main"); // Redirect to the main page after success
      } else {
        console.error("Failed to update journal:", response.data);
      }
    } catch (error) {
      console.error("Error updating journal:", error);
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <div>
      {/* Header */}
      <div className="header">
        <div className="menu" onClick={toggleSidebar}>
          ☰
        </div>
        <div>Edit Journal</div>
      </div>

      {/* Sidebar */}
      <Sidebar
        isVisible={isSidebarVisible}
        toggleSidebar={toggleSidebar}
        navigate={navigate}
      />

      {/* Main Content */}
      <div className="edit-journal-container">
        <h2>Edit Journal</h2>
        <form>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={journal.title}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              rows="10"
              value={journal.content}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={handleSave}>
              Save
            </button>
            <button type="button" onClick={() => navigate("/main")}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJournal;
