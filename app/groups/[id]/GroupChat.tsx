"use client";

import { useEffect, useState } from "react";

export default function GroupChat({ groupId }: { groupId: number }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  async function loadMessages() {
    const res = await fetch(`/api/groups/${groupId}/messages`);
    const data = await res.json();
    setMessages(data);
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    await fetch(`/api/groups/${groupId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text }),
    });

    setText("");
    loadMessages();
  }

  useEffect(() => {
    loadMessages();
  }, []);

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Group chat</h2>

      <div className="border rounded-xl p-4 h-64 overflow-y-auto bg-gray-50 space-y-2">
        {messages.map((m) => (
          <div key={m.id}>
            <span className="font-medium">{m.user.name}: </span>
            <span>{m.content}</span>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2 mt-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2"
          placeholder="Write a message…"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 rounded-lg"
        >
          Send
        </button>
      </form>
    </div>
  );
}
