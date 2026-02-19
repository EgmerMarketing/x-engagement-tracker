"use client";
import { useEffect, useState } from "react";
import { getLog, addLogEntry, deleteLogEntry, type EngagementEntry } from "@/lib/store";

export default function LogPage() {
  const [log, setLog] = useState<EngagementEntry[]>([]);
  const [handle, setHandle] = useState("");
  const [action, setAction] = useState<EngagementEntry["action"]>("like");
  const [tweetUrl, setTweetUrl] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => { setLog(getLog()); }, []);

  const handleAdd = () => {
    if (!handle) return;
    addLogEntry({
      date: new Date().toISOString(),
      handle: handle.startsWith("@") ? handle : `@${handle}`,
      action,
      tweetUrl: tweetUrl || undefined,
      notes,
    });
    setLog(getLog());
    setHandle(""); setTweetUrl(""); setNotes("");
  };

  const handleDelete = (id: string) => { setLog(deleteLogEntry(id)); };

  const actionColors: Record<string, string> = {
    like: "bg-blue-900 text-blue-300",
    reply: "bg-green-900 text-green-300",
    follow: "bg-yellow-900 text-yellow-300",
    retweet: "bg-purple-900 text-purple-300",
    "quote-tweet": "bg-pink-900 text-pink-300",
  };

  // Group by date
  const grouped: Record<string, EngagementEntry[]> = {};
  log.forEach((e) => {
    const day = new Date(e.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(e);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Engagement Log</h1>
        <p className="text-gray-400 text-sm">Track every outbound engagement action</p>
      </div>

      {/* Add Entry */}
      <div className="bg-[#16213e] rounded-lg p-4 space-y-3">
        <h2 className="font-semibold text-sm">Log New Engagement</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <input placeholder="@handle" value={handle} onChange={(e) => setHandle(e.target.value)} className="bg-[#1a1a2e] border border-[#0f3460] rounded px-3 py-2 text-sm" />
          <select value={action} onChange={(e) => setAction(e.target.value as EngagementEntry["action"])} className="bg-[#1a1a2e] border border-[#0f3460] rounded px-3 py-2 text-sm">
            <option value="like">❤️ Like</option>
            <option value="reply">💬 Reply</option>
            <option value="follow">➕ Follow</option>
            <option value="retweet">🔁 Retweet</option>
            <option value="quote-tweet">💭 Quote Tweet</option>
          </select>
          <input placeholder="Tweet URL (optional)" value={tweetUrl} onChange={(e) => setTweetUrl(e.target.value)} className="bg-[#1a1a2e] border border-[#0f3460] rounded px-3 py-2 text-sm" />
          <input placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="bg-[#1a1a2e] border border-[#0f3460] rounded px-3 py-2 text-sm" />
        </div>
        <button onClick={handleAdd} className="bg-[#00ADEE] text-white px-4 py-2 rounded text-sm hover:bg-[#0090c5]">Log Engagement</button>
      </div>

      {/* Log Entries */}
      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-2">📝</p>
          <p>No engagements logged yet.</p>
          <p className="text-sm mt-1">Start by engaging with target accounts and logging it above!</p>
        </div>
      ) : (
        Object.entries(grouped).map(([day, entries]) => (
          <div key={day}>
            <h3 className="text-sm font-semibold text-gray-400 mb-2">{day} ({entries.length} actions)</h3>
            <div className="space-y-2">
              {entries.map((e) => (
                <div key={e.id} className="bg-[#16213e] rounded p-3 flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded ${actionColors[e.action] || "bg-gray-700"}`}>{e.action}</span>
                  <span className="font-mono text-[#00ADEE] text-sm">{e.handle}</span>
                  <span className="text-gray-400 text-sm truncate flex-1">{e.notes}</span>
                  {e.tweetUrl && (
                    <a href={e.tweetUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#00ADEE] hover:underline">link</a>
                  )}
                  <button onClick={() => handleDelete(e.id)} className="text-gray-600 hover:text-red-400 text-xs">✕</button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
