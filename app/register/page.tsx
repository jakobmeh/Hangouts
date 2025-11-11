'use client'

import { useState } from 'react'

export default function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleRegister = async () => {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }), // pošljemo tudi name
    })
    const data = await res.json()
    setMessage(data.message)
  }

  return (
    <div className="flex flex-col gap-4 max-w-sm mx-auto p-4">
      <input
        type="text"
        placeholder="Ime"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border px-3 py-2 rounded"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border px-3 py-2 rounded"
      />
      <input
        type="password"
        placeholder="Geslo"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border px-3 py-2 rounded"
      />
      <button
        onClick={handleRegister}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Registriraj
      </button>
      {message && <p className="text-red-500 mt-2">{message}</p>}
    </div>
  )
}
