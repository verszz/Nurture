import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import { getJournalById, editJournal } from "../actions/journal.action";
import "./EditJournal.css";

const EditJournal = () => {
  const { id } = useParams(); // Get journal ID from the URL
  const [journal, setJournal] = useState({ title: "", content: "" }); // Current journal state
  const [newTitle, setNewTitle] = useState(""); // New title state
  const [fetchedTitle, setFetchedTitle] = useState(""); // New state to store the fetched journal title
  const [isSidebarVisible, setSidebarVisible] = useState(false); // Sidebar visibility state
  const navigate = useNavigate();
  const username = localStorage.getItem("username"); // Get username from localStorage

  // Fetch the journal on component mount
  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const response = await getJournalById(id); // Fetch journal by ID
        if (response.success) {
          const { journal_title, journal_content } = response.data;
          setJournal({
            title: journal_title,
            content: journal_content, // Use camelCase
          });
          setNewTitle(journal_title); // Set the new title to the current title initially
          setFetchedTitle(journal_title); // Save the fetched title in the new variable
        } else {
          alert("Failed to load journal: " + response.data);
        }
      } catch (error) {
        console.error("Error fetching journal:", error);
        alert("An error occurred while fetching the journal.");
      }
    };

    fetchJournal();
  }, [id]);

  // Handle input changes for title and content
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "title") {
      setJournal((prev) => ({ ...prev, title: value }));
    } else if (name === "content") {
      setJournal((prev) => ({ ...prev, content: value }));
    } else if (name === "newTitle") {
      setNewTitle(value); // Update newTitle when input changes
    }
  };

  // Save the updated journal
  const handleSave = async () => {
    try {
      // Log the journal data for debugging purposes
      console.log("Journal data being sent:", journal);
      console.log("New title:", newTitle);
      console.log("Fetched title:", fetchedTitle); // Log the fetched title for debugging

      const response = await editJournal(
        username,
        fetchedTitle, // Use the fetched title as the current title
        journal.content, // Updated content
        newTitle // Use newTitle for the updated title
      );

      if (response.success) {
        alert("Journal updated successfully!");
        navigate("/Home"); // Redirect to the main page after success
      } else {
        alert(`Failed to update journal: ${response.data}\nContent: ${journal.content}`);
      }
    } catch (error) {
      console.error("Error updating journal:", error);
      // Show journal content in the error alert
      alert(`An error occurred while updating the journal.\nError: ${error.message}\nContent: ${journal.content}`);
    }
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="edit-journal-page">
      {/* Header */}
      <div className="edit-journal-header">
        <div className="edit-journal-menu" onClick={toggleSidebar}>
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
          <div className="edit-journal-form-group">
            <label htmlFor="title">Current Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={journal.title}
              onChange={handleInputChange}
              disabled // Disable this field to prevent editing the original title
            />
          </div>
          <div className="edit-journal-form-group">
            <label htmlFor="newTitle">New Title</label>
            <input
              type="text"
              id="newTitle"
              name="newTitle"
              value={newTitle} // Update new title here
              onChange={handleInputChange}
            />
          </div>
          <div className="edit-journal-form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              rows="10"
              value={journal.content} // Use camelCase
              onChange={handleInputChange}
            />
          </div>
          <div className="edit-journal-form-actions">
            <button type="button" onClick={handleSave}>
              Save
            </button>
            <button type="button" onClick={() => navigate("/home")}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJournal;
