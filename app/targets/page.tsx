"use client";
import { useEffect, useState } from "react";
import { getTargets, addTarget, updateTarget, deleteTarget, CATEGORY_LABELS, type TargetAccount } from "@/lib/store";

export default function TargetsPage() {
  const [targets, setTargets] = useState<TargetAccount[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newHandle, setNewHandle] = useState("");
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<TargetAccount["category"]>("local-seo");
  const [newNotes, setNewNotes] = useState("");

  useEffect(() => { setTargets(getTargets()); }, []);

  const handleAdd = () => {
    if (!newHandle) return;
    addTarget({ handle: newHandle.startsWith("@") ? newHandle : `@${newHandle}`, name: newName, category: newCategory, followed: false, followedBack: false, notes: newNotes });
    setTargets(getTargets());
    setNewHandle(""); setNewName(""); setNewNotes(""); setShowAdd(false);
  };

  const toggleFollowed = (id: string, current: boolean) => {
    setTargets(updateTarget(id, { followed: !current, followedAt: !current ? new Date().toISOString() : undefined }));
  };

  const toggleFollowedBack = (id: string, current: boolean) => {
    setTargets(updateTarget(id, { followedBack: !current, followedBackAt: !current ? new Date().toISOString() : undefined }));
  };

  const handleDelete = (id: string) => { setTargets(deleteTarget(id)); };

  const grouped = Object.keys(CATEGORY_LABELS).map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    accounts: targets.filter((t) => t.category === cat),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Target Accounts</h1>
          <p className="text-gray-400 text-sm">Accounts to engage with for audience growth</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-[#00ADEE] text-white px-3 py-1.5 rounded text-sm hover:bg-[#0090c5] transition">
          + Add Account
        </button>
      </div>

      {showAdd && (
        <div className="bg-[#16213e] rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="@handle" value={newHandle} onChange={(e) => setNewHandle(e.target.value)} className="bg-[#1a1a2e] border border-[#0f3460] rounded px-3 py-2 text-sm" />
            <input placeholder="Display name" value={newName} onChange={(e) => setNewName(e.target.value)} className="bg-[#1a1a2e] border border-[#0f3460] rounded px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select value={newCategory} onChange={(e) => setNewCategory(e.target.value as TargetAccount["category"])} className="bg-[#1a1a2e] border border-[#0f3460] rounded px-3 py-2 text-sm">
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <input placeholder="Notes" value={newNotes} onChange={(e) => setNewNotes(e.target.value)} className="bg-[#1a1a2e] border border-[#0f3460] rounded px-3 py-2 text-sm" />
          </div>
          <button onClick={handleAdd} className="bg-[#00ADEE] text-white px-4 py-2 rounded text-sm hover:bg-[#0090c5]">Add</button>
        </div>
      )}

      {grouped.map((g) => (
        <div key={g.category}>
          <h2 className="font-semibold text-lg mb-2">{g.label} ({g.accounts.length})</h2>
          {g.accounts.length === 0 ? (
            <p className="text-gray-500 text-sm">No accounts in this category</p>
          ) : (
            <div className="space-y-2">
              {g.accounts.map((t) => (
                <div key={t.id} className="bg-[#16213e] rounded-lg p-3 flex items-center gap-3">
                  <button onClick={() => toggleFollowed(t.id, t.followed)} title="Toggle followed" className="text-lg">{t.followed ? "✅" : "⬜"}</button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#00ADEE] text-sm">{t.handle}</span>
                      {t.name && <span className="text-gray-400 text-xs">({t.name})</span>}
                      {t.followedBack && <span className="text-xs bg-green-900 text-green-300 px-1.5 rounded">✓ followed back</span>}
                    </div>
                    {t.notes && <p className="text-gray-500 text-xs mt-0.5">{t.notes}</p>}
                  </div>
                  <button onClick={() => toggleFollowedBack(t.id, t.followedBack)} className={`text-xs px-2 py-1 rounded ${t.followedBack ? "bg-green-900 text-green-300" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>
                    {t.followedBack ? "Followed back ✓" : "Mark follow-back"}
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="text-gray-600 hover:text-red-400 text-sm">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
