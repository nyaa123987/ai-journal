import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

export default function EditEntry() {
  const router = useRouter();
  const { id } = router.query; // get entry id from query
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchEntry = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("journal_entries")
        .select("content")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching entry:", error);
      } else {
        setContent(data.content);
      }
      setLoading(false);
    };

    fetchEntry();
  }, [id, router]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("journal_entries")
      .update({ content })
      .eq("id", id);

    setSaving(false);

    if (error) {
      console.error("Error saving entry:", error);
      alert("Failed to save entry. Please try again.");
    } else {
      router.push("/dashboard");
    }
  };

  if (loading) {
    return <p className="p-6 text-gray-500">Loading entry...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex flex-col items-center justify-start p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Journal Entry ✏️</h1>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full max-w-2xl h-64 p-4 rounded-lg shadow-lg border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <div className="flex space-x-4 mt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition shadow-md disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition shadow-md"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
