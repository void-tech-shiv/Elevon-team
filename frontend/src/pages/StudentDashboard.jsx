import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, User, FolderGit2, UploadCloud,
  FileText, Bell, LogOut, CheckCircle, ExternalLink, Globe
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import API_BASE_URL from '../api/config';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { logout, user, login, token } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [resources, setResources] = useState([]);
  const [notices, setNotices] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ phone: '', bio: '', skills: '' });

  const fetchData = async () => {
    try {
      const [profRes, projRes, resRes, notRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/students/profile`),
        axios.get(`${API_BASE_URL}/api/students/projects`),
        axios.get(`${API_BASE_URL}/api/resources`),
        axios.get(`${API_BASE_URL}/api/notices`)
      ]);
      setProfile(profRes.data);
      setProjects(projRes.data);
      setResources(resRes.data);
      setNotices(notRes.data);

      setEditForm({
        phone: profRes.data.phone || '',
        bio: profRes.data.bio || '',
        skills: profRes.data.skills?.join(', ') || ''
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_BASE_URL}/api/students/profile`, {
        ...editForm,
        skills: editForm.skills.split(',').map(s => s.trim()).filter(Boolean)
      });
      setProfile(res.data);
      setIsEditing(false);
      login(token, { ...user, name: res.data.name }, 'student');
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  const handleUploadProject = async (e) => {
    e.preventDefault();
    const form = e.target;
    // Gather logic
    const title = form.title.value;
    const description = form.description.value;
    const githubLink = form.githubLink.value;
    const demoLink = form.demoLink.value;
    const file = form.file.files[0];

    if (!file) return alert('Please select a project PDF file');

    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const pdfLink = uploadRes.data.url;

      await axios.post(`${API_BASE_URL}/api/projects`, {
        title, description, githubLink, demoLink, pdfLink
      });

      alert('Project uploaded successfully! Waiting for admin approval.');
      form.reset();
      fetchData();
      setActiveTab('my-projects');
    } catch (error) {
      console.error(error);
      alert('Failed to upload project');
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'my-projects', label: 'Projects', icon: FolderGit2 },
    { id: 'upload', label: 'Upload', icon: UploadCloud },
    { id: 'resources', label: 'Resources', icon: FileText },
    { id: 'notices', label: 'Notices', icon: Bell },
  ];

  if (!profile) return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-cyan-400 font-mono tracking-widest uppercase">INITIALIZING SYSTEM...</div>;

  const approvedProjects = projects.filter(p => p.status === 'approved');

  return (
    <div className="relative min-h-screen flex bg-gray-950 overflow-hidden text-cyan-50">
      <div className="cyber-grid"></div>

      {/* Background Glow */}
      <div className="absolute top-[0%] left-[50%] w-[800px] h-[800px] bg-cyan-900/10 rounded-full blur-[150px] pointer-events-none -translate-x-1/2 mix-blend-screen"></div>

      {/* Sidebar */}
      <div className="w-64 sidebar-neon m-4 flex flex-col justify-between rounded-2xl shrink-0 z-10 transition-all">
        <div>
          <div className="p-6 border-b border-cyan-500/20">
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 tracking-widest uppercase neon-text-glow">STUDENT</h2>
            <p className="text-cyan-200/50 text-xs mt-2 uppercase tracking-widest truncate">ID: {profile.name.split(' ')[0]}</p>
          </div>
          <nav className="p-4 space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 uppercase tracking-wider text-xs font-bold ${activeTab === tab.id
                    ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/50 shadow-[0_0_15px_rgba(0,255,255,0.15)] translate-x-1'
                    : 'text-cyan-100/40 hover:text-cyan-200 hover:bg-cyan-900/20 hover:border-cyan-500/20 border border-transparent'
                  }`}
              >
                <tab.icon size={18} className={activeTab === tab.id ? "text-cyan-400" : "opacity-70"} />
                <span>{tab.label}</span>
              </button>
            ))}
            <Link to="/showcase" className="mt-8 w-full flex items-center gap-4 px-4 py-3 rounded-lg text-purple-300/60 border border-transparent hover:text-purple-300 hover:bg-purple-900/20 hover:border-purple-500/30 transition-all text-xs font-bold uppercase tracking-wider">
              <Globe size={18} />
              Public Showcase
            </Link>
          </nav>
        </div>
        <div className="p-4 border-t border-cyan-500/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-red-400/60 hover:text-red-400 border border-transparent hover:bg-red-950/40 hover:border-red-500/40 transition-all font-bold text-xs uppercase tracking-wider"
          >
            <LogOut size={18} />
            Disconnect
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 pl-0 overflow-y-auto w-full max-w-full z-10">
        <div className="glass-panel-neon h-full p-8 relative overflow-x-hidden">

          <AnimatePresence mode="wait">

            {/* DASHBOARD OVERVIEW */}
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-8">
                <header className="mb-8">
                  <h3 className="text-4xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-200">System Overview</h3>
                  <p className="text-cyan-200/60 mt-1 uppercase tracking-widest text-sm">Welcome back, {profile.name}</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-card-neon p-6 border-l-4 border-l-cyan-400 group">
                    <p className="text-cyan-200/50 text-xs font-bold uppercase tracking-wider mb-2">My Projects</p>
                    <p className="text-5xl font-black text-white mb-2 group-hover:neon-text-glow transition-all">{projects.length}</p>
                    <p className="text-xs text-cyan-400 uppercase tracking-widest">{approvedProjects.length} Approved</p>
                  </div>
                  <div className="glass-card-neon p-6 border-l-4 border-l-purple-400 cursor-pointer group" onClick={() => setActiveTab('resources')}>
                    <p className="text-purple-200/50 text-xs font-bold uppercase tracking-wider mb-2">Resources</p>
                    <p className="text-5xl font-black text-white mb-2 group-hover:drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all">{resources.length}</p>
                    <p className="text-xs text-purple-400 uppercase tracking-widest">Available materials</p>
                  </div>
                  <div className="glass-card-neon p-6 border-l-4 border-l-orange-400 cursor-pointer group" onClick={() => setActiveTab('notices')}>
                    <p className="text-orange-200/50 text-xs font-bold uppercase tracking-wider mb-2">Notices</p>
                    <p className="text-5xl font-black text-white mb-2 group-hover:drop-shadow-[0_0_15px_rgba(249,115,22,0.5)] transition-all">{notices.length}</p>
                    <p className="text-xs text-orange-400 uppercase tracking-widest">Admin Broadcasts</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
                  <div className="glass-card-neon p-8">
                    <h4 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-cyan-500/20 pb-4 text-cyan-300">Latest Transmissions</h4>
                    <div className="space-y-4">
                      {notices.slice(0, 3).map(notice => (
                        <div key={notice._id} className="bg-black/30 p-4 rounded-xl border border-orange-500/20 hover:border-orange-500/50 transition-colors">
                          <p className="font-bold text-sm text-orange-100 uppercase tracking-wider mb-1">{notice.title}</p>
                          <p className="text-xs text-orange-200/60 line-clamp-2 leading-relaxed">{notice.message}</p>
                        </div>
                      ))}
                      {notices.length === 0 && <p className="text-xs text-cyan-500/50 uppercase tracking-widest text-center py-4">No recent transmissions</p>}
                    </div>
                  </div>

                  <div className="glass-card-neon p-8">
                    <h4 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-cyan-500/20 pb-4 text-cyan-300">Project Activity</h4>
                    <div className="space-y-4">
                      {projects.slice(0, 3).map(p => (
                        <div key={p._id} className="flex justify-between items-center bg-black/30 p-4 rounded-xl border border-cyan-500/20 hover:border-cyan-500/50 transition-colors">
                          <p className="font-bold text-xs uppercase tracking-wider text-cyan-50 truncate pr-4">{p.title}</p>
                          <span className={`text-[10px] px-3 py-1 rounded-sm uppercase tracking-widest shrink-0 font-bold border ${p.status === 'approved' ? 'bg-green-950/40 text-green-400 border-green-500/50' : p.status === 'pending' ? 'bg-yellow-950/40 text-yellow-400 border-yellow-500/50' : 'bg-red-950/40 text-red-400 border-red-500/50'}`}>
                            {p.status}
                          </span>
                        </div>
                      ))}
                      {projects.length === 0 && <p className="text-xs text-cyan-500/50 uppercase tracking-widest text-center py-4">No projects logged</p>}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
                <div className="flex justify-between items-end mb-8">
                  <h3 className="text-4xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-200">Personal profile</h3>
                  {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="btn-neon-secondary text-xs py-2 px-6">Edit Profile</button>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleUpdateProfile} className="glass-card-neon p-10 max-w-2xl border-cyan-400/50">
                    <div className="grid gap-6">
                      <div>
                        <label className="block text-xs font-bold mb-2 text-cyan-200 uppercase tracking-wider">Comm Link (Phone)</label>
                        <input type="text" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} className="input-neon" placeholder="123-456-7890" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-2 text-cyan-200 uppercase tracking-wider">Biography</label>
                        <textarea value={editForm.bio} onChange={e => setEditForm({ ...editForm, bio: e.target.value })} className="input-neon min-h-[120px]" placeholder="Enter background logs..." />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-2 text-cyan-200 uppercase tracking-wider">Skill Parameters</label>
                        <input type="text" value={editForm.skills} onChange={e => setEditForm({ ...editForm, skills: e.target.value })} className="input-neon" placeholder="React, Node.js, AI" />
                        <p className="text-[10px] text-cyan-500 mt-2 uppercase tracking-widest">Comma separated values</p>
                      </div>
                    </div>
                    <div className="mt-8 flex gap-4">
                      <button type="submit" className="btn-neon-primary py-3 px-8 text-xs">Save Updates</button>
                      <button type="button" onClick={() => { setIsEditing(false); setEditForm({ phone: profile.phone || '', bio: profile.bio || '', skills: profile.skills?.join(', ') || '' }); }} className="btn-neon-secondary py-3 px-8 text-xs border-red-500/30 text-red-200 hover:border-red-500/60 hover:text-red-100 hover:bg-red-900/30">Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div className="glass-card-neon p-10 max-w-4xl relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div>
                        <h4 className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mb-2">Subject Name</h4>
                        <p className="text-xl font-medium text-cyan-50 uppercase tracking-wider bg-cyan-950/20 p-4 rounded-lg border border-cyan-500/20">{profile.name}</p>
                      </div>
                      <div>
                        <h4 className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mb-2">Identifier</h4>
                        <p className="text-xl font-medium text-cyan-50 uppercase tracking-wider font-mono bg-cyan-950/20 p-4 rounded-lg border border-cyan-500/20">{profile.studentId}</p>
                      </div>
                      <div>
                        <h4 className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mb-2">Network Address</h4>
                        <p className="text-md font-medium text-cyan-50 font-mono bg-cyan-950/20 p-4 rounded-lg border border-cyan-500/20">{profile.email}</p>
                      </div>
                      <div>
                        <h4 className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mb-2">Sector & Tier</h4>
                        <p className="text-md font-medium text-cyan-50 uppercase tracking-wider bg-cyan-950/20 p-4 rounded-lg border border-cyan-500/20">{profile.department} - {profile.year}</p>
                      </div>
                      <div className="md:col-span-2">
                        <h4 className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mb-2">Biography Log</h4>
                        <p className="text-sm bg-cyan-950/20 p-6 rounded-lg border border-cyan-500/20 min-h-[100px] text-cyan-100/80 whitespace-pre-wrap leading-relaxed">{profile.bio || 'NO LOG DATA.'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <h4 className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mb-3">Skill Matrix</h4>
                        <div className="flex flex-wrap gap-3">
                          {profile.skills?.length > 0 ? (
                            profile.skills.map((skill, i) => (
                              <span key={i} className="px-4 py-1.5 bg-purple-900/30 text-purple-200 border border-purple-500/50 rounded-md text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <p className="text-xs text-cyan-500/50 uppercase tracking-widest">No parameters inputted.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* MY PROJECTS TAB */}
            {activeTab === 'my-projects' && (
              <motion.div key="my-projects" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-4xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-200">Project Archive</h3>
                  <button onClick={() => setActiveTab('upload')} className="btn-neon-primary py-2 px-6 text-xs gap-3">
                    <UploadCloud size={16} /> INITIALIZE UPLOAD
                  </button>
                </div>

                <div className="grid gap-8">
                  {projects.map(project => (
                    <div key={project._id} className="glass-card-neon p-8 border-l-4 border-l-cyan-500 group">
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12">
                        <FolderGit2 size={120} className="text-cyan-400" />
                      </div>
                      <div className="relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                          <h4 className="text-2xl font-black text-white pr-4 uppercase tracking-wider group-hover:neon-text-glow transition-all">{project.title}</h4>
                          <span className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest border ${project.status === 'approved' ? 'bg-green-950/40 text-green-400 border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.2)]' : project.status === 'pending' ? 'bg-yellow-950/40 text-yellow-400 border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.2)]' : 'bg-red-950/40 text-red-400 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]'}`}>
                            {project.status}
                          </span>
                        </div>
                        <p className="text-cyan-100/70 text-sm mb-8 max-w-3xl leading-relaxed">{project.description}</p>

                        <div className="flex flex-wrap gap-4">
                          {project.githubLink && (
                            <a href={project.githubLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs uppercase tracking-wider bg-black/50 hover:bg-cyan-950/40 px-5 py-2.5 rounded-lg border border-cyan-500/30 hover:border-cyan-400 font-bold transition-all text-cyan-200">
                              <ExternalLink size={16} /> Repository
                            </a>
                          )}
                          {project.demoLink && (
                            <a href={project.demoLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs uppercase tracking-wider bg-purple-950/30 hover:bg-purple-900/50 text-purple-200 px-5 py-2.5 rounded-lg border border-purple-500/40 hover:border-purple-400 transition-all font-bold">
                              <Globe size={16} /> Deployment
                            </a>
                          )}
                          {project.pdfLink && (
                            <a href={project.pdfLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs uppercase tracking-wider bg-orange-950/30 hover:bg-orange-900/50 text-orange-200 px-5 py-2.5 rounded-lg border border-orange-500/40 hover:border-orange-400 transition-all font-bold">
                              <FileText size={16} /> Data File
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <div className="text-center py-20 glass-card-neon border-dashed border-cyan-500/30">
                      <FolderGit2 size={64} className="mx-auto text-cyan-500/30 mb-6" />
                      <p className="text-xl text-cyan-300/50 font-black uppercase tracking-widest mb-4">Archive Empty</p>
                      <button onClick={() => setActiveTab('upload')} className="text-cyan-400 hover:text-cyan-300 text-sm font-bold uppercase tracking-wider border-b border-transparent hover:border-cyan-400 transition-all">Commence Upload Protocol</button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* UPLOAD TAB */}
            {activeTab === 'upload' && (
              <motion.div key="upload" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
                <h3 className="text-4xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-200 mb-8">Data Upload Module</h3>
                <form onSubmit={handleUploadProject} className="glass-card-neon p-10 max-w-3xl border-cyan-400/30 bg-black/60">
                  <div className="grid gap-8">
                    <div>
                      <label className="block text-xs font-bold mb-2 text-cyan-200 uppercase tracking-wider">Project Designation <span className="text-red-400">*</span></label>
                      <input type="text" name="title" required className="input-neon text-lg font-bold" placeholder="PROJECT NEXUS" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-2 text-cyan-200 uppercase tracking-wider">Operational Description <span className="text-red-400">*</span></label>
                      <textarea name="description" required className="input-neon min-h-[150px]" placeholder="Detail system architecture and parameters..." />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-xs font-bold mb-2 text-cyan-200 uppercase tracking-wider">Repository URL</label>
                        <input type="url" name="githubLink" className="input-neon font-mono text-sm" placeholder="https://github.com/..." />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-2 text-cyan-200 uppercase tracking-wider">Deployment URL</label>
                        <input type="url" name="demoLink" className="input-neon font-mono text-sm" placeholder="https://..." />
                      </div>
                    </div>

                    <div className="bg-cyan-950/20 border border-cyan-500/30 p-8 rounded-xl relative overflow-hidden group">
                      <div className="absolute right-0 top-0 h-full w-2 bg-gradient-to-b from-cyan-400 to-transparent"></div>
                      <label className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest mb-3 text-cyan-300">
                        <FileText size={20} /> Encrypt Documentation <span className="text-red-400">*</span>
                      </label>
                      <p className="text-xs text-cyan-100/50 mb-6 uppercase tracking-wider font-medium">Attach PDF presentation or schematics</p>
                      <input type="file" name="file" accept=".pdf,image/*" required className="w-full text-xs font-mono text-cyan-200 file:cursor-pointer file:mr-6 file:py-3 file:px-6 file:rounded file:border file:border-cyan-500/50 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-cyan-950/60 file:text-cyan-300 hover:file:bg-cyan-900/80 hover:file:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all" />
                    </div>

                    <div className="mt-4 pt-8 border-t border-cyan-500/20 flex justify-end">
                      <button type="submit" className="btn-neon-primary py-4 px-10 text-xs tracking-widest">TRANSMIT TO HQ</button>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}

            {/* RESOURCES AND NOTICES FOLLOW EXACT SAME LOGIC ... */}
            {activeTab === 'resources' && (
              <motion.div key="resources" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
                <h3 className="text-4xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-300 mb-8">Resource Network</h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {resources.map(res => (
                    <div key={res._id} className="glass-card-neon p-8 flex flex-col justify-between border-t-2 border-t-purple-500 relative group">
                      <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <FileText size={180} />
                      </div>
                      <div className="relative z-10 mb-6">
                        <h4 className="font-black text-xl mb-2 text-white uppercase tracking-wider">{res.title}</h4>
                        <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest mb-4">Origin: {res.uploadedBy?.username}</p>
                        <p className="text-sm text-cyan-100/70 leading-relaxed">{res.description}</p>
                      </div>
                      <a href={res.fileLink} target="_blank" rel="noreferrer" className="inline-flex w-fit items-center gap-3 text-xs font-bold uppercase tracking-widest bg-purple-900/30 hover:bg-purple-900/60 text-purple-200 px-5 py-3 rounded border border-purple-500/40 relative z-10 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all">
                        <ExternalLink size={16} /> Intercept File
                      </a>
                    </div>
                  ))}
                  {resources.length === 0 && <p className="text-cyan-500/50 font-bold uppercase tracking-widest col-span-full">No active resources within grid.</p>}
                </div>
              </motion.div>
            )}

            {activeTab === 'notices' && (
              <motion.div key="notices" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
                <h3 className="text-4xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-orange-300 mb-8">Command Notices</h3>
                <div className="max-w-4xl space-y-6">
                  {notices.map((notice, idx) => (
                    <motion.div
                      key={notice._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="glass-card-neon p-8 border-l-4 border-l-orange-500"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-xl font-black text-white uppercase tracking-widest">{notice.title}</h4>
                        <span className="text-[10px] font-mono font-bold text-orange-400 bg-orange-950/40 px-3 py-1.5 rounded border border-orange-500/30">
                          {new Date(notice.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-cyan-100/80 whitespace-pre-wrap leading-relaxed">{notice.message}</p>
                    </motion.div>
                  ))}
                  {notices.length === 0 && <p className="text-cyan-500/50 font-bold uppercase tracking-widest">No broadcasts intercepted.</p>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
