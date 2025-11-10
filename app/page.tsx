export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-500">
      <h1 className="text-4xl font-bold text-indigo-300">
        Tailwind is working!
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        If this text looks styled, you’re good to go.
      </p>
      <button className="mt-6 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition">
        Test Button
      </button>
    </main>
  );
}

