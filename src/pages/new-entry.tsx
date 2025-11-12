import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";

export default function NewEntry() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (!content.trim()) return;

    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("You must be logged in to save an entry.");
      router.push("/auth");
      return;
    }

    const { error } = await supabase.from("journal_entries").insert([
      {
        user_id: user.id,
        content: content,
      },
    ]);

    if (error) {
      alert("Error saving entry: " + error.message);
    } else {
      router.push("/"); // back to dashboard
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex flex-col">
      {/* Navbar */}
      <header className="flex justify-between items-center p-6">
        <h1 className="text-xl font-semibold text-gray-700">📝 New Entry</h1>
        <button
          onClick={() => router.push("/")}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition shadow-md"
        >
          Back
        </button>
      </header>

      {/* Editor */}
      <main className="flex flex-col items-center justify-center flex-grow p-6">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Write your thoughts ✨
          </h2>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-64 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
            placeholder="Start writing here..."
          />

          <button
            onClick={handleSave}
            disabled={loading}
            className="mt-6 w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition shadow-md disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Entry"}
          </button>
        </div>
      </main>
    </div>
  );
}
