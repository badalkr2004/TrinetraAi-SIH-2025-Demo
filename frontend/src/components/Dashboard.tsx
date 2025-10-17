// src/components/Dashboard.tsx
import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  apiService,
  type TechnologyAnalysis,
  type DashboardStats,
} from "../services/api";

const Dashboard: React.FC = () => {
  const [analysis, setAnalysis] = useState<TechnologyAnalysis | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const stats = await apiService.getDashboardStats();
      setDashboardStats(stats);
    } catch {
      setError("Failed to load dashboard stats");
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.analyzeTechnology(searchTerm.trim());
      setAnalysis(result);
    } catch {
      setError("Failed to analyze technology. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getTRLColor = (trl: number) => {
    if (trl <= 3) return "#ef4444"; // red-500
    if (trl <= 6) return "#f59e0b"; // amber-500
    return "#22c55e"; // green-500
  };

  const COLORS = ["#60a5fa", "#34d399", "#fbbf24", "#fb923c", "#a78bfa"];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-2xl">
              🚀
            </span>
            <h1 className="text-3xl font-semibold tracking-tight">
              Trinetra AI Dashboard
            </h1>
          </div>
          <p className="mt-2 text-slate-400">
            Advanced Technology Intelligence & Forecasting Platform
          </p>
        </div>

        {/* Search */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <div className="flex flex-col items-stretch gap-3 sm:flex-row">
            <div className="relative flex-1">
              <input
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                placeholder="Enter Technology Name (e.g., Quantum Computing, AI, 5G)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <SearchIcon className="h-5 w-5 text-slate-500" />
              </div>
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Analyzing...
                </>
              ) : (
                <>
                  <SearchIcon className="h-5 w-5" />
                  Analyze
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {/* Dashboard Stats */}
        {dashboardStats && (
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Technologies Analyzed"
              value={dashboardStats.total_technologies.toLocaleString()}
              icon={<AssessmentIcon className="h-10 w-10 text-indigo-400" />}
            />
            <StatCard
              title="Patents Analyzed"
              value={dashboardStats.total_patents.toLocaleString()}
              icon={<TrendingUpIcon className="h-10 w-10 text-emerald-400" />}
            />
            <StatCard
              title="Research Papers"
              value={dashboardStats.total_papers.toLocaleString()}
              icon={<DocumentIcon className="h-10 w-10 text-sky-400" />}
            />
            <StatCard
              title="Active Alerts"
              value={String(dashboardStats.active_alerts)}
              icon={<BellIcon className="h-10 w-10 text-amber-400" />}
              valueClass="text-amber-300"
            />
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <>
            {/* Technology Overview */}
            <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h2 className="mb-4 text-xl font-semibold">
                {analysis.technology_name} - Intelligence Overview
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* TRL */}
                <div className="rounded-xl border border-white/10 bg-black/20 p-5">
                  <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-slate-400">
                    Technology Readiness Level
                  </h3>

                  <div className="flex items-center gap-4">
                    <TRLDonut
                      value={analysis.analysis.current_trl}
                      color={getTRLColor(analysis.analysis.current_trl)}
                    />
                    <div className="space-y-1 text-sm">
                      <p className="text-slate-300">
                        Current: TRL{" "}
                        <span className="font-semibold text-slate-100">
                          {analysis.analysis.current_trl}
                        </span>
                        /9
                      </p>
                      <p className="text-slate-300">
                        Predicted 2025: TRL{" "}
                        <span className="font-semibold text-slate-100">
                          {analysis.analysis.predicted_trl_2025}
                        </span>
                        /9
                      </p>
                    </div>
                  </div>
                </div>

                {/* Market Intelligence */}
                <div className="rounded-xl border border-white/10 bg-black/20 p-5">
                  <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-slate-400">
                    Market Intelligence
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <InfoItem
                      label="Market Size"
                      value={`$${analysis.analysis.market_size_billions}B`}
                      badge="💰"
                    />
                    <InfoItem
                      label="Growth Rate"
                      value={`${analysis.analysis.growth_rate_percent}%`}
                      badge="📈"
                    />
                    <InfoItem
                      label="Hype Cycle"
                      value={analysis.analysis.hype_cycle_position}
                      badge="📊"
                    />
                    <InfoItem
                      label="S-Curve Phase"
                      value={analysis.s_curve.phase}
                      badge="🔄"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-slate-400">
                  TRL Progression Forecast
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        {
                          year: 2023,
                          trl: analysis.analysis.current_trl,
                        },
                        {
                          year: 2024,
                          trl: analysis.analysis.current_trl + 0.5,
                        },
                        {
                          year: 2025,
                          trl: analysis.analysis.predicted_trl_2025,
                        },
                      ]}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis
                        dataKey="year"
                        tick={{ fill: "#94a3b8" }}
                        stroke="#334155"
                      />
                      <YAxis
                        domain={[0, 9]}
                        tick={{ fill: "#94a3b8" }}
                        stroke="#334155"
                      />
                      <Tooltip
                        contentStyle={{
                          background: "rgba(2,6,23,0.9)",
                          border: "1px solid rgba(148,163,184,0.2)",
                          borderRadius: 12,
                          color: "#e2e8f0",
                        }}
                        labelStyle={{ color: "#94a3b8" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="trl"
                        stroke="#a78bfa"
                        strokeWidth={3}
                        dot={{ r: 3, stroke: "#a78bfa", fill: "#a78bfa" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-slate-400">
                  Market Size Projection
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          year: 2023,
                          market: analysis.analysis.market_size_billions,
                        },
                        {
                          year: 2024,
                          market: analysis.analysis.market_size_billions * 1.2,
                        },
                        {
                          year: 2025,
                          market: analysis.analysis.market_size_billions * 1.5,
                        },
                      ]}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis
                        dataKey="year"
                        tick={{ fill: "#94a3b8" }}
                        stroke="#334155"
                      />
                      <YAxis tick={{ fill: "#94a3b8" }} stroke="#334155" />
                      <Tooltip
                        contentStyle={{
                          background: "rgba(2,6,23,0.9)",
                          border: "1px solid rgba(148,163,184,0.2)",
                          borderRadius: 12,
                          color: "#e2e8f0",
                        }}
                        labelStyle={{ color: "#94a3b8" }}
                      />
                      <Bar
                        dataKey="market"
                        fill="#34d399"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Key Players & Insights */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-slate-400">
                  Key Players
                </h3>
                <ul className="space-y-2">
                  {analysis.analysis.key_players.map((player, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 rounded-lg border border-white/5 bg-black/20 px-3 py-2"
                    >
                      <span className="h-2 w-2 rounded-full bg-indigo-400" />
                      <span className="text-slate-200">{player}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-slate-400">
                  Strategic Insights
                </h3>
                <ul className="space-y-2">
                  {analysis.analysis.strategic_insights.map((insight, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 rounded-lg border border-white/5 bg-black/20 px-3 py-2"
                    >
                      <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                      <span className="text-slate-200">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}

        {/* Trending Technologies */}
        {dashboardStats && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-slate-400">
              Trending Technologies
            </h3>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardStats.trending_technologies}
                    dataKey="growth"
                    nameKey="name"
                    outerRadius={110}
                    label={({ name, growth }: any) => `${name}: ${growth}%`}
                  >
                    {dashboardStats.trending_technologies.map((_entry, i) => (
                      <Cell
                        key={`cell-${i}`}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "rgba(2,210,203,0.9)",
                      border: "1px solid rgba(148,163,184,0.2)",
                      borderRadius: 12,
                      color: "#e2e8f0",
                    }}
                    labelStyle={{ color: "#94a3b8" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

/* ============== UI Subcomponents ============== */

function StatCard({
  title,
  value,
  icon,
  valueClass,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {title}
        </p>
        <p
          className={`mt-1 text-3xl font-semibold text-white ${
            valueClass ?? ""
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
  badge,
}: {
  label: string;
  value: string | number;
  badge?: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3">
      <div className="flex items-center gap-2">
        {badge && <span className="text-lg">{badge}</span>}
        <span className="text-sm text-slate-400">{label}</span>
      </div>
      <span className="font-medium text-slate-100">{value}</span>
    </div>
  );
}

function TRLDonut({ value, color }: { value: number; color: string }) {
  const size = 88;
  const r = 34;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(9, value));
  const pct = (clamped / 9) * 100;
  const dash = c - (pct / 100) * c;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90 overflow-visible">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="transparent"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={10}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="transparent"
          stroke={color}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={dash}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-xl font-semibold text-white">{clamped}</div>
        <div className="text-[10px] uppercase tracking-wide text-slate-400">
          TRL / 9
        </div>
      </div>
    </div>
  );
}

/* ============== Minimal Inline Icons (no extra deps) ============== */

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function AssessmentIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 3h18v18H3z" opacity=".15" />
      <path d="M7 17V9M12 17V7M17 17v-5" />
    </svg>
  );
}

function TrendingUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 17l6-6 4 4 7-7" />
      <path d="M14 5h7v7" />
    </svg>
  );
}

function DocumentIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h6M9 9h3" />
    </svg>
  );
}

function BellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </svg>
  );
}
