import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, FolderGit2, Github, Globe, FileText, ArrowLeft, X } from 'lucide-react';
import API_BASE_URL from '../api/config';

const ProjectShowcase = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/projects/showcase`);
        setProjects(res.data);
      } catch (error) {
        console.error('Failed to fetch projects', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    (p.studentId?.department && p.studentId.department.toLowerCase().includes(search.toLowerCase())) ||
    (p.studentId?.name && p.studentId.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="relative min-h-screen bg-gray-950 text-cyan-50 overflow-hidden font-sans">
      <div className="cyber-grid"></div>
      
      {/* Immersive glow elements */}
      <div className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] bg-purple-600/15 rounded-full blur-[180px] pointer-events-none mix-blend-screen animate-float"></div>
      
      <div className="container mx-auto px-6 py-10 relative z-10 min-h-screen flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <Link to="/" className="text-cyan-400 hover:text-cyan-300 hover:neon-text-glow flex items-center gap-3 transition-all text-xs font-bold uppercase tracking-widest">
            <ArrowLeft size={16} /> Disconnect
          </Link>
          <div className="flex items-center gap-3 bg-black/60 border border-cyan-500/30 px-6 py-3 rounded-xl backdrop-blur-xl shadow-[0_0_15px_rgba(0,255,255,0.1)] focus-within:border-cyan-400 focus-within:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all">
            <Search size={18} className="text-cyan-400" />
            <input 
              type="text" 
              placeholder="QUERY DATABASE..." 
              className="bg-transparent border-none outline-none text-xs font-bold tracking-widest uppercase w-64 md:w-80 text-white placeholder-cyan-600/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-[0.1em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-500 neon-text-glow">Public Archive</h1>
          <p className="text-sm text-cyan-200/60 font-mono tracking-widest uppercase">Decrypted operational data and student projects.</p>
        </div>

        {loading ? (
          <div className="flex justify-center flex-1 items-center">
             <p className="text-cyan-400 font-mono tracking-widest uppercase animate-pulse">CONNECTING TO MAINFRAME...</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  key={project._id}
                  className="glass-card-neon hover:-translate-y-2 cursor-pointer flex flex-col h-full group bg-black/50 border border-cyan-500/20"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="absolute -right-10 -top-10 opacity-5 group-hover:opacity-10 transition-all transform group-hover:scale-110 group-hover:rotate-12 duration-500">
                    <FolderGit2 size={250} className="text-cyan-500" />
                  </div>
                  
                  <div className="p-8 flex-1 flex flex-col z-10 border-t border-cyan-400/30">
                    <h3 className="text-2xl font-black mb-3 text-white uppercase tracking-wider group-hover:neon-text-glow transition-all">{project.title}</h3>
                    <p className="text-[10px] text-cyan-300/80 mb-6 font-bold uppercase tracking-widest bg-cyan-950/40 w-fit px-3 py-1 rounded border border-cyan-500/20">
                       {project.studentId?.name} • {project.studentId?.department}
                    </p>
                    <p className="text-cyan-100/60 text-sm line-clamp-3 mb-8 flex-1 leading-relaxed">{project.description}</p>
                    
                    <button className="text-xs text-purple-400 font-bold uppercase tracking-widest flex justify-between items-center group-hover:text-purple-300">
                      Decrypt Files <ArrowLeft size={16} className="rotate-180 transform group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredProjects.length === 0 && (
              <div className="col-span-full text-center py-20 text-cyan-500/40 font-bold tracking-widest uppercase text-sm">
                NO SECTORS MATCHING QUERY FOUND.
              </div>
            )}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/90 backdrop-blur-xl"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel-neon max-w-3xl w-full max-h-[85vh] overflow-y-auto relative border border-cyan-400/40 shadow-[0_0_40px_rgba(0,255,255,0.15)] bg-black/80"
            >
              <button onClick={() => setSelectedProject(null)} className="absolute top-6 right-6 text-cyan-500 hover:text-cyan-300 bg-cyan-950/50 p-3 rounded-full hover:bg-cyan-900/80 transition-all border border-transparent hover:border-cyan-500/50">
                <X size={20} />
              </button>
              
              <div className="p-10 md:p-14">
                <div className="flex gap-6 items-center mb-10">
                  <div className="bg-cyan-950/60 border border-cyan-500/40 p-5 rounded-2xl shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                    <FolderGit2 size={48} className="text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]" />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-300 mb-2 uppercase tracking-widest neon-text-glow">{selectedProject.title}</h2>
                    <p className="text-xs text-purple-400 font-bold uppercase tracking-widest mt-2 bg-purple-950/40 w-fit px-3 py-1 rounded border border-purple-500/30">Authored by {selectedProject.studentId?.name} [{selectedProject.studentId?.department}]</p>
                  </div>
                </div>

                <div className="bg-black/40 border border-cyan-500/20 rounded-xl p-8 mb-10 text-cyan-50/80 leading-relaxed whitespace-pre-wrap text-sm shadow-inner">
                  <h4 className="text-cyan-300 font-bold mb-4 text-xs uppercase tracking-widest border-b border-cyan-500/20 pb-3">Operational Details</h4>
                  {selectedProject.description}
                </div>

                <div className="flex flex-wrap gap-4">
                  {selectedProject.githubLink && (
                    <a href={selectedProject.githubLink} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-black/50 hover:bg-cyan-950/40 text-cyan-200 px-6 py-4 rounded-xl transition-all border border-cyan-500/30 font-bold uppercase tracking-wider text-xs hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                      <Github size={18} /> Source File
                    </a>
                  )}
                  {selectedProject.demoLink && (
                    <a href={selectedProject.demoLink} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-purple-900/30 hover:bg-purple-800/50 text-purple-100 px-6 py-4 rounded-xl transition-all border border-purple-500/40 font-bold uppercase tracking-wider text-xs shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:border-purple-300">
                      <Globe size={18} /> Initialize Demo
                    </a>
                  )}
                  {selectedProject.pdfLink && (
                    <a href={selectedProject.pdfLink} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-orange-950/40 hover:bg-orange-900/60 text-orange-200 px-6 py-4 rounded-xl transition-all border border-orange-500/30 font-bold uppercase tracking-wider text-xs hover:border-orange-400 hover:shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                      <FileText size={18} /> Decrypt PDF
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectShowcase;
