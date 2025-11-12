import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.push("/dashboard"); // redirect logged-in users
      }
    };
    checkUser();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 text-white px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Welcome to AI Journal ✨
      </h1>
      <p className="text-center mb-8 max-w-md">
        Write, track, and reflect on your daily thoughts. Let AI help you analyze
        your mood and summarize your entries.
      </p>

      <button
        onClick={() => router.push("/auth")}
        className="bg-white text-blue-500 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
      >
        Get Started
      </button>
    </div>
  );
}
