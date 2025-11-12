import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";

type JournalEntry = {
  id: string;
  content: string;
  created_at: string;
};

export default function Dashboard() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEntries = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching entries:", error);
      else setEntries(data || []);

      setLoading(false);
    };

    fetchEntries();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("journal_entries").delete().eq("id", id);
    if (error) console.error("Delete failed:", error);
    else setEntries(entries.filter((entry) => entry.id !== id));
  };

  const handleEdit = (entry: JournalEntry) => {
    router.push(`/edit-entry?id=${entry.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex flex-col">
      {/* Navbar */}
      <header className="flex justify-between items-center p-6">
        <h1 className="text-2xl font-bold text-gray-700">📓 My Journal</h1>
        <div className="space-x-4">
          <button
            onClick={() => router.push("/new-entry")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition shadow-md"
          >
            ➕ New Entry
          </button>
          <button
            onClick={handleLogout}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition shadow-md"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Entries list */}
      <main className="flex flex-col items-center flex-grow p-6">
        <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-6">
          {loading ? (
            <p className="text-gray-500">Loading your entries...</p>
          ) : entries.length === 0 ? (
            <p className="text-gray-500">No entries yet. Start writing! ✨</p>
          ) : (
            <ul className="space-y-4">
              {entries.map((entry) => (
                <li
                  key={entry.id}
                  className="border rounded-lg p-4 bg-gray-50 shadow-sm relative"
                >
                  <p className="text-gray-800 whitespace-pre-line">{entry.content}</p>
                  <span className="block text-sm text-gray-500 mt-2">
                    {new Date(entry.created_at).toLocaleString()}
                  </span>

                  {/* Edit/Delete buttons */}
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={() => handleEdit(entry)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
