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
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Group chat</h2>

      <div className="border border-gray-200 rounded-xl p-4 h-64 overflow-y-auto bg-white space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 overflow-hidden">
              {m.user?.image ? (
                <img
                  src={m.user.image}
                  alt={m.user?.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                (m.user?.name || m.user?.email || "?")
                  .toString()
                  .trim()
                  .charAt(0)
                  .toUpperCase() || "?"
              )}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-900">
                {m.user?.name || m.user?.email || "Unknown user"}
              </div>
              <div className="text-sm text-gray-800 break-words">{m.content}</div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2 mt-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder:text-gray-600"
          placeholder="Write a message"
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
