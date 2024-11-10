"use client";

import { useState } from "react";

export default function NewBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/new-blog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("Blog subido con éxito");
      setTitle("");
      setContent("");
    } else {
      setMessage(`Error: ${data.message}`);
    }
  };

  return (
    <div>
      <h1>Crear Nuevo Blog</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contenido:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            required
          />
        </div>
        <button type="submit">Subir Blog</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
