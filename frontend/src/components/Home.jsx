import axios from "axios";
import React, { useEffect, useState } from "react";
import NoteModel from "./NoteModel";
import { useLocation } from "react-router-dom";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const location = useLocation();

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please login.");
        return;
      }
      const searchParams = new URLSearchParams(location.search);
      const search = searchParams.get("search") || "";
      const { data } = await axios.get("/api/notes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const filteredNotes = search
        ? data.filter(
            (note) =>
              note.title.toLowerCase().includes(search.toLowerCase()) ||
              note.description.toLowerCase().includes(search.toLowerCase())
          )
        : data;
      setNotes(filteredNotes);
      //setNotes(data);
    } catch (error) {
      setError("Failed to fetch notes. Please try again.");
    }
  };

  const handleEdit = (note) => {
    setEditNote(note);
    setIsModelOpen(true);
  };

  useEffect(() => {
    fetchNotes();
  }, [location.search]);

  const handleSaveNote = (newNote) => {
    if (editNote) {
      setNotes((prevNotes) =>
        prevNotes.map((n) => (n._id === newNote._id ? newNote : n))
      );
    } else {
      setNotes((prevNotes) => [...prevNotes, newNote]);
    }

    setEditNote(null);
    setIsModelOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please login.");
        return;
      }
      await axios.delete(`/api/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotes((prevNotes) => prevNotes.filter((n) => n._id !== id));
    } catch (error) {
      setError("Failed to delete note. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-white">
      {error && (
        <p className="bg-red-100 text-red-500 mb-4 text-center rounded-md p-2">
          {error}
        </p>
      )}

      {/* Modal */}
      <NoteModel
        isOpen={isModelOpen}
        onClose={() => {
          setIsModelOpen(false);
          setEditNote(null);
        }}
        note={editNote}
        onSave={handleSaveNote}
      />

      {/* Floating Add Button */}
      <button
        onClick={() => setIsModelOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-500 text-white rounded-full w-14 h-14 flex items-center justify-center text-3xl shadow-lg hover:bg-blue-600"
      >
        <span className="flex items-center justify-center h-full w-full pb-1">
          +
        </span>
      </button>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <div
            key={note._id}
            className="bg-white border border-blue-200 p-4 rounded-lg shadow-md mb-4 hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold text-blue-700">
              {note.title}
            </h3>
            <p className="text-gray-700 mb-4">{note.description}</p>
            <p className="text-sm text-gray-500 mb-4">
              {new Date(note.updatedAt).toLocaleString()}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(note)}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(note._id)}
                className="bg-white border border-blue-500 text-blue-500 py-2 px-4 rounded-md hover:bg-blue-500 hover:text-white transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
