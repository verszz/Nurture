import React, { useState, useEffect } from "react";
import { getAllJournal, deleteJournal } from "../actions/journal.action";
import "./ShowAllJournal.css";

const ShowAllJournal = () => {
  const [journals, setJournals] = useState([]);
  const [filteredJournals, setFilteredJournals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJournal, setSelectedJournal] = useState(null);

  // Retrieve username from localStorage
  const username = localStorage.getItem("username");

  // Fetch all journals on component mount
  useEffect(() => {
    const loadJournals = async () => {
      if (username) {
        const response = await getAllJournal(username);
        if (response.success) {
          setJournals(response.data);
          setFilteredJournals(response.data);
        } else {
          console.error("Failed to load journals:", response.data);
        }
      } else {
        console.error("Username not found in localStorage");
      }
    };
    loadJournals();
  }, [username]);

  // Search handler
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = journals.filter(
      (journal) =>
        journal.journal_title.toLowerCase().includes(term) ||
        journal.journal_content.toLowerCase().includes(term)
    );

    setFilteredJournals(filtered);
  };

  // Delete a journal
  const handleDelete = async (id) => {
    try {
      const success = await deleteJournal(id);
      if (success) {
        setJournals(journals.filter((journal) => journal.id !== id));
        setFilteredJournals(filteredJournals.filter((journal) => journal.id !== id));
      }
    } catch (error) {
      console.error("Error deleting journal:", error);
    }
  };

  // Open modal to view journal content
  const handleViewJournal = (journal) => {
    setSelectedJournal(journal);
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedJournal(null);
  };

  return (
    <div className="journal-JournalView">
      {/* Search Input */}
      <div className="search-container-JournalView">
        <input
          type="text"
          placeholder="Search journals..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input-JournalView"
        />
      </div>

      {filteredJournals.length > 0 ? (
        <div className="journal-grid-JournalView">
          {filteredJournals.map((journal) => (
            <div className="journal-card-JournalView" key={journal.id}>
              <h3>{journal.journal_title}</h3>
              <p>
                {journal.journal_content
                  ? journal.journal_content.slice(0, 100)
                  : "No content available"}
                ...
              </p>
              <button
                className="view-button-JournalView"
                onClick={() => handleViewJournal(journal)}
              >
                View
              </button>
              <button
                className="delete-button-JournalView"
                onClick={() => handleDelete(journal.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-journals-JournalView">
          {searchTerm ? "No journals match your search." : "No journals available."}
        </p>
      )}

      {/* Modal for viewing journal content */}
            {/* Modal for viewing journal content */}
        <div className={`modal-JournalView ${selectedJournal ? "" : "hidden"}`}>
        <div className="modal-content-JournalView">
            <span className="close-button-JournalView" onClick={handleCloseModal}>
            &times;
            </span>
            {selectedJournal && (
            <>
                <h2>{selectedJournal.journal_title}</h2>
                <p>{selectedJournal.journal_content}</p>
                <p>
                <strong>Date:</strong> {selectedJournal.journal_date}
                </p>
            </>
      )}
      </div>
      </div>
    </div>
  );
};

export default ShowAllJournal;
