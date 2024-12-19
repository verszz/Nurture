import React, { useState, useEffect } from "react";
import { getAllJournal, deleteJournal } from "../actions/journal.action";
import { useNavigate } from 'react-router-dom';
import { logout } from '../actions/user.action';
import Sidebar from '../Sidebar/Sidebar';
import "./ShowAllJournal.css";

const ShowAllJournal = () => {
  const [journals, setJournals] = useState([]);
  const [filteredJournals, setFilteredJournals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJournal, setSelectedJournal] = useState(null);
  const storedUsername = localStorage.getItem('username');
  const navigate = useNavigate(); 
  const [isSearchBarVisible, setSearchBarVisible] = useState(false);
  const [isSidebarVisible, setSidebarVisible] = useState(false);

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

  useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          isSearchBarVisible &&
          !event.target.closest(".search-bar-header") &&
          !event.target.closest(".search-icon")
        ) {
          setSearchBarVisible(false);
        }
      };
    
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isSearchBarVisible]);
    
  
    const getInitials = (name) => {
      if (!name) return 'NA';
      const initials = name
        .split(' ')
        .map((word) => word[0]?.toUpperCase())
        .join('');
      return initials;
    };
  
    const toggleSidebar = () => {
      setSidebarVisible(!isSidebarVisible);
    };
  
    const handleLogout = () => {
      logout();
      alert('Berhasil logout!');
      navigate('/');
    };

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
    <div>
      <div className="header">
      <div className="menu" onClick={toggleSidebar}>
        ☰
      </div>
      <div className="showJournal-title">Journals</div>
      {isSearchBarVisible ? (
        <input
          type="text"
          className="search-bar-header"
          placeholder="Search Journals..."
          value={searchTerm}
          onChange={handleSearch}
        />
      ) : (
        <div className="search-icon" onClick={() => setSearchBarVisible(true)}>
          🔍
        </div>
      )}
      <div className="profile">{getInitials(storedUsername)}</div>
    </div>
      <Sidebar
        isVisible={isSidebarVisible}
        toggleSidebar={toggleSidebar}
        navigate={navigate}
        handleLogout={handleLogout}
      />
    <div className="journal-JournalView">
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
    </div>
  );
};

export default ShowAllJournal;