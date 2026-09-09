import { useState } from "react";
import { Home, Settings, User, Send, Database, Copy, Check } from "lucide-react";
import logo from "./assets/nlq-logo.svg";

function App() {
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeView, setActiveView] = useState("home");
  const [showProfile, setShowProfile] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [schema, setSchema] = useState(null);
  const [schemaLoading, setSchemaLoading] = useState(false);
  const [tableData, setTableData] = useState({});

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const formatResult = (result) => {
    try {
      let cleaned = result
        .replace(/Decimal\('([\d.]+)'\)/g, "$1")
        .replace(/[\[\]()]/g, "")
        .replace(/'/g, "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      return cleaned.join(", ");
    } catch {
      return result;
    }
  };

  const parseColumns = (columnsStr) => {
    try {
      const regex = /\('([^']+)',\s*'([^']+)',\s*'(YES|NO)',\s*'([^']*)'/g;
      const rows = [];
      let match;
      while ((match = regex.exec(columnsStr)) !== null) {
        rows.push({
          name: match[1],
          type: match[2],
          nullable: match[3],
          key: match[4],
        });
      }
      return rows;
    } catch {
      return [];
    }
  };

  const handleAsk = async (q) => {
    const finalQuestion = q || question;
    if (!finalQuestion.trim()) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://nlq-natural-language-query.onrender.com/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: finalQuestion }),
      });
      const data = await response.json();

      if (data.status === "success") {
        setHistory([data, ...history]);
        setQuestion("");
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Could not connect to server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const fetchTableData = async (tableName) => {
    try {
      const response = await fetch(`https://nlq-natural-language-query.onrender.com/table-data/${tableName}`);
      const data = await response.json();
      if (data.status === "success") {
        setTableData((prev) => ({ ...prev, [tableName]: data.rows }));
      }
    } catch (err) {
      console.error("Failed to fetch table data");
    }
  };

  const fetchSchema = async () => {
    setSchemaLoading(true);
    try {
      const response = await fetch("https://nlq-natural-language-query.onrender.com/schema");
      const data = await response.json();
      if (data.status === "success") {
        setSchema(data.tables);
        data.tables.forEach((t) => fetchTableData(t.table));
      }
    } catch (err) {
      console.error("Failed to fetch schema");
    } finally {
      setSchemaLoading(false);
    }
  };

  const navItems = [
    { id: "home", icon: Home },
    { id: "database", icon: Database },
    { id: "settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e14] flex">
      {/* Sidebar */}
      <div className="w-20 bg-[#0f141c] border-r border-white/5 flex flex-col items-center py-6 justify-between">
        <div className="flex flex-col items-center gap-8">
          <img src={logo} alt="NLQ" className="w-10 h-10 mb-2 pb-2 border-b border-white/10" />

          <div className="flex flex-col gap-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    if (item.id === "database" && !schema) fetchSchema();
                  }}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                    isActive ? "bg-blue-500 text-white" : "bg-white/5 hover:bg-white/10 text-white"
                  }`}
                >
                  <Icon size={22} strokeWidth={2} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 hover:bg-slate-600 transition-colors"
          >
            <User size={18} />
          </button>
          {showProfile && (
            <div className="absolute bottom-0 left-14 bg-[#141a24] border border-white/10 rounded-xl p-3 w-48 shadow-lg">
              <p className="text-white text-sm font-medium">Guest User</p>
              <p className="text-slate-500 text-xs mt-0.5">nlq_user@local</p>
              <div className="border-t border-white/10 mt-2 pt-2">
                <p className="text-slate-400 text-xs">Connected DB: nlq_demo</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-6 py-16 overflow-y-auto">
        <div className="w-full max-w-2xl">
          {activeView === "home" && (
            <>
              <div className="flex flex-col items-center text-center mb-8">
                <img src={logo} alt="NLQ" className="w-16 h-16 mb-4" />
                <p className="text-slate-400 text-sm mb-1">Hi there</p>
                <h1 className="text-white text-3xl font-semibold">How can I help today?</h1>
                <p className="text-slate-500 text-sm mt-2">Ask your database questions in plain English</p>
              </div>

              <div className="bg-[#141a24] border border-white/10 rounded-2xl p-4">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about your data..."
                  rows={2}
                  className="w-full resize-none border-none outline-none bg-transparent text-white placeholder-slate-500 text-base"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => handleAsk()}
                    disabled={loading || !question.trim()}
                    className="w-10 h-10 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>

              {error && (
                <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              {history.length === 0 && !error && (
                <p className="text-center text-sm text-slate-500 mt-10">
                  Your questions and answers will appear here
                </p>
              )}

              {history.length > 0 && (
                <div className="mt-6">
                  <div className="bg-[#141a24] border border-white/10 rounded-xl p-4">
                    <p className="text-sm font-medium text-white mb-2">{history[0].question}</p>
                    <div className="bg-black/30 rounded-lg p-3 mb-3 relative">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-medium text-slate-500">Generated SQL</p>
                        <button
                          onClick={() => handleCopy(history[0].generated_sql, "home")}
                          className="text-slate-500 hover:text-white transition-colors"
                        >
                          {copiedIndex === "home" ? (
                            <Check size={14} className="text-green-400" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                      <code className="text-xs text-slate-400 font-mono break-all leading-relaxed">
                        {history[0].generated_sql}
                      </code>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-medium text-slate-500">Result</span>
                      <span className="text-sm text-white font-medium">{formatResult(history[0].result)}</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {activeView === "database" && (
            <>
              <h1 className="text-white text-2xl font-semibold mb-6">Database tables</h1>

              {schemaLoading ? (
                <p className="text-center text-sm text-slate-500 mt-16">Loading tables...</p>
              ) : schema ? (
                <div className="space-y-4">
                  {schema.map((t, i) => {
                    const columns = parseColumns(t.columns);
                    return (
                      <div key={i} className="bg-[#141a24] border border-white/10 rounded-xl p-4">
                        <p className="text-white text-sm font-semibold mb-3">{t.table}</p>
                        <div className="rounded-lg overflow-hidden border border-white/10">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="bg-black/30 text-slate-400">
                                <th className="text-left px-3 py-2 font-medium">Column</th>
                                <th className="text-left px-3 py-2 font-medium">Type</th>
                                <th className="text-left px-3 py-2 font-medium">Nullable</th>
                                <th className="text-left px-3 py-2 font-medium">Key</th>
                              </tr>
                            </thead>
                            <tbody>
                              {columns.map((c, j) => (
                                <tr key={j} className="border-t border-white/5">
                                  <td className="px-3 py-2 text-white font-mono">{c.name}</td>
                                  <td className="px-3 py-2 text-slate-400 font-mono">{c.type}</td>
                                  <td className="px-3 py-2 text-slate-400">{c.nullable}</td>
                                  <td className="px-3 py-2 text-slate-400">{c.key || "—"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {tableData[t.table] && (
                          <div className="mt-3">
                            <p className="text-xs font-medium text-slate-500 mb-2">Sample data</p>
                            <pre className="text-xs text-slate-400 font-mono whitespace-pre-wrap bg-black/30 rounded-lg p-3 overflow-x-auto">
                              {tableData[t.table]}
                            </pre>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-sm text-slate-500 mt-16">Could not load tables</p>
              )}
            </>
          )}

          {activeView === "settings" && (
            <>
              <h1 className="text-white text-2xl font-semibold mb-6">Settings</h1>

              <div className="bg-[#141a24] border border-white/10 rounded-xl p-4 mb-3">
                <p className="text-slate-500 text-xs mb-1">Backend URL</p>
                <p className="text-white text-sm font-mono">http://127.0.0.1:8000</p>
              </div>

              <div className="bg-[#141a24] border border-white/10 rounded-xl p-4 mb-3">
                <p className="text-slate-500 text-xs mb-1">Connected database</p>
                <p className="text-white text-sm font-mono">nlq_demo (MySQL)</p>
              </div>

              <div className="bg-[#141a24] border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-white text-sm">Clear query history</p>
                  <p className="text-slate-500 text-xs mt-0.5">Removes all saved questions</p>
                </div>
                <button
                  onClick={() => setHistory([])}
                  className="text-red-400 hover:text-red-300 text-sm transition-colors"
                >
                  Clear
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;