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
    <div className="min-h-screen bg-slate-900 text-white relative">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-900/50 to-transparent"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex justify-between items-center mb-12">
          <Link to="/" className="text-indigo-300 hover:text-white flex items-center gap-2 transition-colors">
            <ArrowLeft size={20} /> Back to Home
          </Link>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search projects, departments..." 
              className="bg-transparent border-none outline-none text-sm w-64 text-white placeholder-gray-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-white">Project Showcase</h1>
          <p className="text-lg text-gray-400">Discover amazing projects built by our talented students.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredProjects.map((project, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={project._id}
                  className="glass-card hover:-translate-y-2 transition-transform duration-300 cursor-pointer flex flex-col h-full border border-white/10 relative overflow-hidden group"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="absolute -right-10 -top-10 opacity-5 group-hover:opacity-10 transition-opacity">
                    <FolderGit2 size={200} />
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col z-10">
                    <h3 className="text-2xl font-bold mb-2 text-white">{project.title}</h3>
                    <p className="text-sm text-indigo-300 mb-4 font-medium flex items-center gap-2">
                       {project.studentId?.name} • {project.studentId?.department}
                    </p>
                    <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-1">{project.description}</p>
                    
                    <button className="text-indigo-400 font-medium text-sm flex justify-between items-center group-hover:text-indigo-300">
                      View full details <ArrowLeft size={16} className="rotate-180 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredProjects.length === 0 && (
              <div className="col-span-full text-center py-20 text-gray-500 text-lg">
                No projects found matching your search.
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel max-w-3xl w-full max-h-[90vh] overflow-y-auto relative border border-white/20 shadow-2xl"
            >
              <button onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
              
              <div className="p-8 md:p-12">
                <div className="flex gap-4 items-center mb-6">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg">
                    <FolderGit2 size={40} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{selectedProject.title}</h2>
                    <p className="text-lg text-indigo-300 font-medium">By {selectedProject.studentId?.name}</p>
                    <p className="text-sm text-gray-400">{selectedProject.studentId?.department} Department</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 text-gray-300 leading-relaxed whitespace-pre-wrap">
                  <h4 className="text-white font-semibold mb-3 text-lg border-b border-white/10 pb-2">About the Project</h4>
                  {selectedProject.description}
                </div>

                <div className="flex flex-wrap gap-4">
                  {selectedProject.githubLink && (
                    <a href={selectedProject.githubLink} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-all border border-white/10 font-medium shadow-lg hover:scale-105">
                      <Github size={20} /> View Source Code
                    </a>
                  )}
                  {selectedProject.demoLink && (
                    <a href={selectedProject.demoLink} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white px-6 py-3 rounded-xl transition-all font-medium shadow-lg shadow-indigo-500/25 hover:scale-105">
                      <Globe size={20} /> Live Application
                    </a>
                  )}
                  {selectedProject.pdfLink && (
                    <a href={selectedProject.pdfLink} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-all border border-white/10 font-medium shadow-lg hover:scale-105">
                      <FileText size={20} /> Project Documentation
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
