import { useEffect, useMemo, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiUploadCloud, FiPlay, FiTrash2, FiMoreVertical, FiImage, FiGrid, FiList, FiClock, FiPlus, FiFile } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { API_URL } from "../api";

const formatSize = (bytes) => bytes < 1024 * 1024 ? `${Math.max(1, bytes / 1024).toFixed(1)} KB` : `${(bytes / 1024 / 1024).toFixed(2)} MB`;
const formatDate = (date) => new Date(date).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

const MyPresentations = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");
  const [activeMenu, setActiveMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadPresentations = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/ppt`, { withCredentials: true });
      setDocuments(data.presentations);
    } catch (error) { toast.error(error.response?.data?.message || "Could not load presentations."); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadPresentations(); }, []);
  const filteredDocuments = useMemo(() => documents.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())), [documents, search]);
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/ppt/${id}`, { withCredentials: true });
      setDocuments((previous) => previous.filter((item) => item.id !== id));
      toast.success("Presentation removed successfully");
    } catch (error) { toast.error(error.response?.data?.message || "Could not delete presentation."); }
    finally { setActiveMenu(null); }
  };

  return <main className="min-h-screen bg-[var(--bg)] px-4 py-10 pt-[105px] sm:px-6">
    <div className="pointer-events-none fixed top-[100px] left-1/2 -z-0 size-[350px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[130px]" />
    <div className="relative z-10 mx-auto max-w-[1200px]">
      <Motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-bold tracking-[1px] text-[var(--primary)] uppercase">Your workspace</p><h1 className="mt-2 text-3xl font-bold tracking-[-1.5px] sm:text-4xl">My Presentations</h1><p className="mt-3 text-sm text-[var(--text-secondary)]">Your uploaded presentations, available only while you are logged in.</p></div>
        <button onClick={() => navigate("/upload")} className="flex w-fit cursor-pointer items-center gap-2 rounded-xl bg-linear-to-br from-[var(--primary)] to-[var(--primary-dark)] px-5 py-3 text-sm font-bold text-white"><FiPlus />Upload New</button>
      </Motion.div>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4"><Stat title="Total Files" value={documents.length} icon={<FiFile />} /><Stat title="Presentations" value={documents.length} icon={<FiImage />} /><Stat title="Storage used" value={formatSize(documents.reduce((sum, item) => sum + item.size, 0))} icon={<FiUploadCloud />} /><Stat title="Recently Added" value={documents[0] ? formatDate(documents[0].createdAt) : "—"} icon={<FiClock />} /></div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between"><div className="relative w-full sm:max-w-[400px]"><FiSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-[var(--text-muted)]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search presentations..." className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-3 pr-4 pl-11 text-sm outline-none focus:border-[var(--primary)]" /></div><div className="flex w-fit items-center rounded-xl border border-[var(--border)] bg-[var(--card)] p-1"><button onClick={() => setView("grid")} className={`flex size-9 cursor-pointer items-center justify-center rounded-lg ${view === "grid" ? "bg-[var(--primary-soft)] text-[var(--primary)]" : "text-[var(--text-muted)]"}`}><FiGrid /></button><button onClick={() => setView("list")} className={`flex size-9 cursor-pointer items-center justify-center rounded-lg ${view === "list" ? "bg-[var(--primary-soft)] text-[var(--primary)]" : "text-[var(--text-muted)]"}`}><FiList /></button></div></div>
      {loading ? <p className="py-16 text-center text-[var(--text-secondary)]">Loading your presentations...</p> : filteredDocuments.length ? <div className={view === "grid" ? "mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" : "mt-6 space-y-3"}>{filteredDocuments.map((item, index) => <Card key={item.id} document={item} index={index} view={view} activeMenu={activeMenu} setActiveMenu={setActiveMenu} onPresent={() => navigate(`/ppt/${item.id}`)} onDelete={() => handleDelete(item.id)} />)}</div> : <div className="mt-6 flex min-h-[350px] flex-col items-center justify-center rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-8 text-center"><FiUploadCloud className="text-4xl text-[var(--primary)]" /><h2 className="mt-5 text-xl font-bold">{search ? "No presentations found" : "No presentations yet"}</h2><p className="mt-2 text-sm text-[var(--text-secondary)]">{search ? "Try another search term." : "Upload your first PPT or PPTX to see it here."}</p><button onClick={() => search ? setSearch("") : navigate("/upload")} className="mt-5 rounded-xl bg-[var(--primary-soft)] px-5 py-3 text-sm font-bold text-[var(--primary)]">{search ? "Clear Search" : "Upload Presentation"}</button></div>}
    </div>
  </main>;
};
const Stat = ({ title, value, icon }) => <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow)]"><div className="flex items-center justify-between"><span className="flex size-9 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)]">{icon}</span><span className="text-lg font-bold">{value}</span></div><p className="mt-3 text-xs text-[var(--text-secondary)]">{title}</p></div>;
const Card = ({ document, index, view, activeMenu, setActiveMenu, onPresent, onDelete }) => <Motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .04 }} className={view === "grid" ? "group overflow-hidden rounded-[22px] border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow)]" : "flex items-center gap-4 rounded-[20px] border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow)]"}><div className={view === "grid" ? "relative flex h-[170px] items-center justify-center bg-linear-to-br from-indigo-500 to-violet-700" : "flex size-[75px] shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-700"}><FiImage className="text-5xl text-white/80" /><span className="absolute bottom-3 left-3 rounded bg-black/30 px-2 py-1 text-[10px] font-bold text-white">{document.type}</span></div><div className={view === "grid" ? "p-4" : "min-w-0 flex-1"}><div className="flex justify-between gap-3"><div className="min-w-0"><h3 className="truncate text-sm font-bold">{document.name}</h3><p className="mt-1 text-xs text-[var(--text-secondary)]">{formatDate(document.createdAt)} · {formatSize(document.size)}</p></div><div className="relative"><button onClick={() => setActiveMenu(activeMenu === document.id ? null : document.id)} className="cursor-pointer text-[var(--text-muted)]"><FiMoreVertical /></button><AnimatePresence>{activeMenu === document.id && <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-6 right-0 z-20 w-32 rounded-xl border border-[var(--border)] bg-[var(--card)] p-1 shadow-xl"><button onClick={onPresent} className="flex w-full gap-2 rounded-lg px-3 py-2 text-xs hover:bg-[var(--primary-soft)]"><FiPlay />Open</button><button onClick={onDelete} className="flex w-full gap-2 rounded-lg px-3 py-2 text-xs text-red-500 hover:bg-red-500/10"><FiTrash2 />Delete</button></Motion.div>}</AnimatePresence></div></div><button onClick={onPresent} className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--primary-soft)] px-4 py-2.5 text-xs font-bold text-[var(--primary)]"><FiPlay />Open Presentation</button></div></Motion.div>;
export default MyPresentations;
