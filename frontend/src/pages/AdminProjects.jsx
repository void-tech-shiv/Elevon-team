import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  FolderGit2, FileText, CheckCircle, XCircle 
} from 'lucide-react';
import API_BASE_URL from '../api/config';
import AdminSidebar from '../components/AdminSidebar';

const AdminProjects = () => {
  const [pendingProjects, setPendingProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ pendingStudents: 0, pendingProjects: 0 });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [prRes, stRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/admin/projects/pending?t=${Date.now()}`),
        axios.get(`${API_BASE_URL}/api/admin/students?t=${Date.now()}`)
      ]);
      setPendingProjects(prRes.data);
      setStats({
        pendingStudents: stRes.data.filter(s => s.status === 'pending').length,
        pendingProjects: prRes.data.length
      });
    } catch (error) {
      console.error("Failed to fetch admin data", error);
      setError("FAILED TO CONNECT TO HQ. CHECK YOUR UPLINK.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await axios.put(`${API_BASE_URL}/api/admin/projects/${id}/${action}`);
      fetchData();
    } catch (err) { 
      const errMsg = err.response?.data?.message || err.message || 'Operation failed';
      alert(errMsg); 
    }
  };

  return (
    <div className="relative min-h-screen flex bg-gray-950 overflow-hidden text-red-50">
      <div className="cyber-grid" style={{ backgroundImage: 'linear-gradient(to right, rgba(236, 72, 153, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(236, 72, 153, 0.03) 1px, transparent 1px)' }}></div>
      <div className="absolute top-[20%] left-[20%] w-[1000px] h-[1000px] bg-red-900/10 rounded-full blur-[180px] pointer-events-none -translate-x-1/2 mix-blend-screen"></div>

      <AdminSidebar pendingStudents={stats.pendingStudents} pendingProjects={stats.pendingProjects} />

      <div className="flex-1 p-4 pl-0 overflow-y-auto w-full max-w-full z-10">
        <div className="glass-panel-neon h-full p-8 border-pink-500/20 relative overflow-x-hidden">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin"></div>
              <p className="text-pink-400 font-mono text-xs tracking-widest uppercase">SYNCHRONIZING WITH GRID...</p>
            </div>
          ) : error ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <XCircle size={64} className="text-red-500" />
              <p className="text-red-400 font-mono text-xs tracking-widest uppercase font-bold">{error}</p>
              <button onClick={fetchData} className="btn-neon-secondary text-[10px] py-2 px-6">RETRY UPLINK</button>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <h3 className="text-4xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-100 to-pink-400 mb-8">Project Approvals</h3>
              <div className="space-y-6">
                {pendingProjects.length > 0 ? pendingProjects.map(project => (
                  <div key={project._id} className="glass-card-neon border-pink-500/30 p-8 flex flex-col md:flex-row justify-between items-start md:items-center bg-black/60 group">
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-center gap-3">
                         <h4 className="text-2xl font-black text-white uppercase tracking-wider group-hover:neon-text-glow transition-all">{project.title}</h4>
                         <span className="bg-yellow-950/50 text-yellow-400 border border-yellow-500/50 px-3 py-0.5 text-[10px] uppercase font-mono tracking-tighter rounded">PENDING_REVIEW</span>
                      </div>
                      <p className="text-pink-200/60 text-xs font-mono uppercase tracking-widest border-l-2 border-pink-500/30 pl-3">
                        Subject: {project.studentId?.name} [{project.studentId?.studentId}] <br/>
                        Sector: {project.studentId?.department} • Date: {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-pink-100/70 line-clamp-2 leading-relaxed mt-4 italic">"{project.description}"</p>
                      
                      <div className="flex gap-4 mt-6">
                        {project.pdfLink && (
                          <a href={project.pdfLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-pink-400 hover:text-pink-300 border-b border-pink-500/20 hover:border-pink-500/60 transition-all">
                            <FileText size={14} /> Open Data File (PDF)
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4 mt-8 md:mt-0">
                      <button 
                        onClick={() => handleAction(project._id, 'approve')}
                        className="bg-green-950/40 border border-green-500/40 text-green-400 px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-green-900/60 hover:shadow-[0_0_20px_rgba(34,197,94,0.2)] transition-all"
                      >
                        <CheckCircle size={18} /> Approve
                      </button>
                      <button 
                        onClick={() => handleAction(project._id, 'reject')}
                        className="bg-red-950/40 border border-red-500/40 text-red-400 px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-red-900/60 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all"
                      >
                        <XCircle size={18} /> Reject
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="glass-card-neon p-20 text-center border-dashed border-pink-500/30">
                    <FolderGit2 size={64} className="mx-auto text-pink-500/20 mb-6" />
                    <p className="text-pink-200/50 font-mono text-sm tracking-widest uppercase">No pending approvals detected in the queue.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProjects;
