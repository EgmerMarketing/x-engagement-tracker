"use client";
import { useEffect, useState } from "react";
import { getWeeklyStats, getLog, getTargets, type EngagementEntry, type TargetAccount } from "@/lib/store";

export default function Dashboard() {
  const [stats, setStats] = useState<ReturnType<typeof getWeeklyStats> | null>(null);
  const [recentLog, setRecentLog] = useState<EngagementEntry[]>([]);
  const [targets, setTargets] = useState<TargetAccount[]>([]);

  useEffect(() => {
    setStats(getWeeklyStats());
    setRecentLog(getLog().slice(0, 5));
    setTargets(getTargets());
  }, []);

  if (!stats) return <div className="text-center py-12 text-gray-400">Loading...</div>;

  const followRate = stats.totalFollowed > 0 ? Math.round((stats.followBacks / stats.totalFollowed) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-gray-400 text-sm">@egmermarketing weekly engagement summary</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Engagements This Week" value={stats.engagementsThisWeek} />
        <StatCard label="Accounts Engaged" value={stats.uniqueAccountsEngaged} />
        <StatCard label="Follow-backs" value={stats.followBacks} />
        <StatCard label="Follow-back Rate" value={`${followRate}%`} />
      </div>

      {/* Action Breakdown */}
      <div className="bg-[#16213e] rounded-lg p-4">
        <h2 className="font-semibold mb-3">Action Breakdown (7 days)</h2>
        <div className="grid grid-cols-5 gap-2 text-center text-sm">
          <div><div className="text-2xl font-bold text-[#00ADEE]">{stats.byAction.likes}</div><div className="text-gray-400">Likes</div></div>
          <div><div className="text-2xl font-bold text-green-400">{stats.byAction.replies}</div><div className="text-gray-400">Replies</div></div>
          <div><div className="text-2xl font-bold text-yellow-400">{stats.byAction.follows}</div><div className="text-gray-400">Follows</div></div>
          <div><div className="text-2xl font-bold text-purple-400">{stats.byAction.retweets}</div><div className="text-gray-400">RTs</div></div>
          <div><div className="text-2xl font-bold text-pink-400">{stats.byAction.quoteTweets}</div><div className="text-gray-400">QTs</div></div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#16213e] rounded-lg p-4">
        <h2 className="font-semibold mb-3">Recent Activity</h2>
        {recentLog.length === 0 ? (
          <p className="text-gray-400 text-sm">No activity logged yet. <a href="/log" className="text-[#00ADEE] underline">Add your first engagement →</a></p>
        ) : (
          <div className="space-y-2">
            {recentLog.map((e) => (
              <div key={e.id} className="flex items-center gap-2 text-sm bg-[#1a1a2e] rounded p-2">
                <ActionBadge action={e.action} />
                <span className="text-[#00ADEE] font-mono">{e.handle}</span>
                <span className="text-gray-400 truncate flex-1">{e.notes}</span>
                <span className="text-gray-500 text-xs">{new Date(e.date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Target Accounts Status */}
      <div className="bg-[#16213e] rounded-lg p-4">
        <h2 className="font-semibold mb-3">Target Accounts ({targets.filter(t => t.followed).length}/{targets.length} followed)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {targets.map((t) => (
            <div key={t.id} className="flex items-center gap-2 text-sm bg-[#1a1a2e] rounded p-2">
              <span className={t.followed ? "text-green-400" : "text-gray-500"}>{t.followed ? "✅" : "⬜"}</span>
              <span className="font-mono text-[#00ADEE]">{t.handle}</span>
              {t.followedBack && <span className="text-xs bg-green-900 text-green-300 px-1 rounded">followed back</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-[#16213e] rounded-lg p-4 text-center">
      <div className="text-3xl font-bold text-[#00ADEE]">{value}</div>
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </div>
  );
}

function ActionBadge({ action }: { action: string }) {
  const colors: Record<string, string> = {
    like: "bg-blue-900 text-blue-300",
    reply: "bg-green-900 text-green-300",
    follow: "bg-yellow-900 text-yellow-300",
    retweet: "bg-purple-900 text-purple-300",
    "quote-tweet": "bg-pink-900 text-pink-300",
  };
  return <span className={`text-xs px-1.5 py-0.5 rounded ${colors[action] || "bg-gray-700"}`}>{action}</span>;
}
