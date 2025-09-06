import React, { useEffect, useState } from "react";
import axios from "axios";

const NoteModel = ({ isOpen, onClose, note, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle(note ? note.title : "");
    setDescription(note ? note.description : "");
    setError("");
  }, [note]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please login.");
        return;
      }
      const payload = { title, description };
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (note) {
        const { data } = await axios.put(
          `/api/notes/${note._id}`,
          payload,
          config
        );
        onSave(data);
      } else {
        const { data } = await axios.post("/api/notes", payload, config);
        onSave(data);
      }

      setTitle("");
      setDescription("");
      setError("");
      onClose();
    } catch (error) {
      setError("Failed to save note. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md border border-blue-200">
        <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
          {note ? "Edit Note" : "Create Note"}
        </h2>

        {error && (
          <p className="bg-red-100 text-red-500 mb-4 text-center rounded-md p-2">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Note Title"
              className="w-full px-3 py-2 border border-blue-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-white placeholder-gray-400"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <textarea
              placeholder="Note Description"
              className="w-full px-3 py-2 border border-blue-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-white placeholder-gray-400"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 w-full transition"
            >
              {note ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-white border border-blue-500 text-blue-500 py-2 rounded-md hover:bg-blue-500 hover:text-white w-full transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModel;
