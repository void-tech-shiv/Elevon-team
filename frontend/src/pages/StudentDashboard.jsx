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

  // For profile edit
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
      // Update local storage user just in case
      login(token, { ...user, name: res.data.name }, 'student');
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  const handleUploadProject = async (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const description = form.description.value;
    const githubLink = form.githubLink.value;
    const demoLink = form.demoLink.value;
    const file = form.file.files[0];

    if (!file) return alert('Please select a project PDF file');

    try {
      // 1. Upload PDF to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const pdfLink = uploadRes.data.url;

      // 2. Submit project request
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
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'my-projects', label: 'My Projects', icon: FolderGit2 },
    { id: 'upload', label: 'Upload Project', icon: UploadCloud },
    { id: 'resources', label: 'Resources', icon: FileText },
    { id: 'notices', label: 'Notices', icon: Bell },
  ];

  if (!profile) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Loading...</div>;

  const approvedProjects = projects.filter(p => p.status === 'Approved');

  return (
    <div className="min-h-screen flex bg-slate-900">
      {/* Sidebar */}
      <div className="w-64 glass-panel m-4 flex flex-col justify-between border-white/10 shrink-0">
        <div>
          <div className="p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Student Portal</h2>
            <p className="text-gray-400 text-sm mt-1 truncate">Hello, {profile.name.split(' ')[0]}</p>
          </div>
          <nav className="p-4 space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === tab.id 
                  ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon size={20} />
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
            ))}
            <Link to="/showcase" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
              <Globe size={20} />
              Public Showcase
            </Link>
          </nav>
        </div>
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all font-medium text-sm"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 pl-0 overflow-y-auto w-full max-w-full">
        <div className="glass-panel h-full p-8 border-white/10 relative overflow-x-hidden">
          
          <AnimatePresence mode="wait">
            
            {/* DASHBOARD OVERVIEW TAB */}
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <h3 className="text-3xl font-bold mb-8">Welcome Back, {profile.name}!</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-card p-6 border-l-4 border-l-indigo-500">
                    <p className="text-gray-400 text-sm font-semibold mb-1">My Projects</p>
                    <p className="text-4xl font-bold text-white mb-2">{projects.length}</p>
                    <p className="text-xs text-indigo-300">{approvedProjects.length} Approved</p>
                  </div>
                  <div className="glass-card p-6 border-l-4 border-l-purple-500 cursor-pointer" onClick={() => setActiveTab('resources')}>
                    <p className="text-gray-400 text-sm font-semibold mb-1">Available Resources</p>
                    <p className="text-4xl font-bold text-white mb-2">{resources.length}</p>
                    <p className="text-xs text-purple-300">View study materials</p>
                  </div>
                  <div className="glass-card p-6 border-l-4 border-l-orange-500 cursor-pointer" onClick={() => setActiveTab('notices')}>
                    <p className="text-gray-400 text-sm font-semibold mb-1">Unread Notices</p>
                    <p className="text-4xl font-bold text-white mb-2">{notices.length}</p>
                    <p className="text-xs text-orange-300">Check latest updates</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                  <div className="glass-card p-6">
                    <h4 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Recent Notices</h4>
                    <div className="space-y-4">
                      {notices.slice(0, 3).map(notice => (
                        <div key={notice._id} className="bg-white/5 p-3 rounded-lg border-l-2 border-orange-500">
                          <p className="font-semibold text-sm mb-1">{notice.title}</p>
                          <p className="text-xs text-gray-400 line-clamp-2">{notice.message}</p>
                        </div>
                      ))}
                      {notices.length === 0 && <p className="text-sm text-gray-500">No recent notices.</p>}
                    </div>
                  </div>
                  
                  <div className="glass-card p-6">
                    <h4 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">My Recent Projects</h4>
                    <div className="space-y-4">
                      {projects.slice(0, 3).map(p => (
                        <div key={p._id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                          <p className="font-semibold text-sm truncate pr-4">{p.title}</p>
                          <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${p.status === 'Approved' ? 'bg-green-500/20 text-green-300' : p.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300'}`}>
                            {p.status}
                          </span>
                        </div>
                      ))}
                      {projects.length === 0 && <p className="text-sm text-gray-500">No projects uploaded yet.</p>}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="flex justify-between items-end mb-8">
                  <h3 className="text-3xl font-bold">My Profile</h3>
                  {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="btn-secondary text-sm py-2 px-4 border-indigo-500/30 hover:bg-indigo-500/20">Edit Profile</button>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleUpdateProfile} className="glass-card p-8 max-w-2xl border border-indigo-500/30">
                    <div className="grid gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-300">Phone Number</label>
                        <input type="text" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="input-glass" placeholder="Your contact number" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-300">Bio</label>
                        <textarea value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})} className="input-glass min-h-[100px]" placeholder="Tell us about yourself" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-300">Skills (Comma separated)</label>
                        <input type="text" value={editForm.skills} onChange={e => setEditForm({...editForm, skills: e.target.value})} className="input-glass" placeholder="React, Node.js, Design" />
                      </div>
                    </div>
                    <div className="mt-6 flex gap-4">
                      <button type="submit" className="btn-primary py-2 px-6">Save Changes</button>
                      <button type="button" onClick={() => { setIsEditing(false); setEditForm({phone: profile.phone || '', bio: profile.bio || '', skills: profile.skills?.join(', ') || ''}); }} className="btn-secondary py-2 px-6 border-white/20">Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div className="glass-card p-8 max-w-3xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-sm text-indigo-300 font-semibold mb-1">Full Name</h4>
                        <p className="text-lg font-medium bg-white/5 p-3 rounded-lg border border-white/5">{profile.name}</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-indigo-300 font-semibold mb-1">Student ID</h4>
                        <p className="text-lg font-medium bg-white/5 p-3 rounded-lg border border-white/5">{profile.studentId}</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-indigo-300 font-semibold mb-1">Email Address</h4>
                        <p className="text-lg font-medium bg-white/5 p-3 rounded-lg border border-white/5">{profile.email}</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-indigo-300 font-semibold mb-1">Department & Year</h4>
                        <p className="text-lg font-medium bg-white/5 p-3 rounded-lg border border-white/5">{profile.department} - {profile.year}</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-indigo-300 font-semibold mb-1">Phone Number</h4>
                        <p className="text-lg font-medium bg-white/5 p-3 rounded-lg border border-white/5">{profile.phone || 'Not provided'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <h4 className="text-sm text-indigo-300 font-semibold mb-1">Bio</h4>
                        <p className="text-md bg-white/5 p-4 rounded-lg border border-white/5 min-h-[80px] text-gray-300 whitespace-pre-wrap">{profile.bio || 'Add a bio to tell others about yourself.'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <h4 className="text-sm text-indigo-300 font-semibold mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.skills?.length > 0 ? (
                            profile.skills.map((skill, i) => (
                              <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-sm font-medium">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">No skills added yet.</p>
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
              <motion.div key="my-projects" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-3xl font-bold">My Projects</h3>
                  <button onClick={() => setActiveTab('upload')} className="btn-primary py-2 text-sm flex gap-2 items-center">
                    <UploadCloud size={16} /> Upload New
                  </button>
                </div>
                
                <div className="grid gap-6">
                  {projects.map(project => (
                    <div key={project._id} className="glass-card p-6 border-l-4 border-indigo-500 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <FolderGit2 size={80} />
                      </div>
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-2xl font-bold text-white pr-4">{project.title}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${project.status === 'Approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : project.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                            {project.status}
                          </span>
                        </div>
                        <p className="text-gray-300 text-md mb-6 max-w-3xl leading-relaxed">{project.description}</p>
                        
                        <div className="flex flex-wrap gap-4">
                          {project.githubLink && (
                            <a href={project.githubLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10 transition-colors">
                              <ExternalLink size={16} className="text-gray-400" /> GitHub Repository
                            </a>
                          )}
                          {project.demoLink && (
                            <a href={project.demoLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm bg-purple-500/10 hover:bg-purple-500/20 text-purple-200 px-4 py-2 rounded-lg border border-purple-500/30 transition-colors">
                              <Globe size={16} /> Live Demo
                            </a>
                          )}
                          {project.pdfLink && (
                            <a href={project.pdfLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm bg-orange-500/10 hover:bg-orange-500/20 text-orange-200 px-4 py-2 rounded-lg border border-orange-500/30 transition-colors">
                              <FileText size={16} /> View Assignment PDF
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <div className="text-center py-12 glass-card">
                      <FolderGit2 size={48} className="mx-auto text-gray-500 mb-4" />
                      <p className="text-xl text-gray-400">You haven't uploaded any projects yet.</p>
                      <button onClick={() => setActiveTab('upload')} className="text-indigo-400 hover:text-white mt-2 underline">Upload your first project</button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* UPLOAD PROJECT TAB */}
            {activeTab === 'upload' && (
              <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h3 className="text-3xl font-bold mb-6">Upload New Project</h3>
                <form onSubmit={handleUploadProject} className="glass-card p-8 max-w-3xl border border-indigo-500/20">
                  <div className="grid gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-300">Project Title <span className="text-red-400">*</span></label>
                      <input type="text" name="title" required className="input-glass text-lg" placeholder="Awesome Web Platform" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-300">Project Description <span className="text-red-400">*</span></label>
                      <textarea name="description" required className="input-glass min-h-[150px]" placeholder="Describe your project, technologies used, and your learning outcomes..." />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-300">GitHub Link</label>
                        <input type="url" name="githubLink" className="input-glass" placeholder="https://github.com/..." />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-300">Live Demo Link</label>
                        <input type="url" name="demoLink" className="input-glass" placeholder="https://..." />
                      </div>
                    </div>

                    <div className="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-xl">
                      <label className="block text-sm font-medium mb-2 text-indigo-200 flex items-center gap-2">
                        <FileText size={18} /> Upload Project PDF Requirement <span className="text-red-400">*</span>
                      </label>
                      <p className="text-xs text-gray-400 mb-4">Please upload documentation, slides, or assignment requirements as a PDF file.</p>
                      <input type="file" name="file" accept=".pdf,image/*" required className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-600 cursor-pointer" />
                    </div>

                    <div className="mt-4 pt-6 border-t border-white/10 flex justify-end">
                      <button type="submit" className="btn-primary py-3 px-8 text-lg font-bold shadow-indigo-500/50">Submit Project for Approval</button>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}

            {/* RESOURCES TAB */}
            {activeTab === 'resources' && (
              <motion.div key="resources" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h3 className="text-3xl font-bold mb-6">Educational Resources</h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {resources.map(res => (
                    <div key={res._id} className="glass-card p-6 flex flex-col justify-between border-t-2 border-t-purple-500 relative overflow-hidden group">
                      <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <FileText size={120} />
                      </div>
                      <div className="relative z-10 mb-4">
                        <h4 className="font-bold text-xl mb-1 text-white">{res.title}</h4>
                        <p className="text-xs text-purple-300 font-medium mb-3">Uploaded by Admin ({res.uploadedBy?.username})</p>
                        <p className="text-sm text-gray-300">{res.description}</p>
                      </div>
                      <a href={res.fileLink} target="_blank" rel="noreferrer" className="inline-flex w-fit items-center gap-2 text-sm bg-purple-500/20 hover:bg-purple-500/40 text-purple-200 px-4 py-2 rounded-lg transition-colors border border-purple-500/30 relative z-10">
                        <ExternalLink size={16} /> Open Resource
                      </a>
                    </div>
                  ))}
                  {resources.length === 0 && <p className="text-gray-400 col-span-full">No resources uploaded by teachers yet.</p>}
                </div>
              </motion.div>
            )}

            {/* NOTICES TAB */}
            {activeTab === 'notices' && (
              <motion.div key="notices" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h3 className="text-3xl font-bold mb-6">Platform Notices</h3>
                <div className="max-w-4xl space-y-6">
                  {notices.map((notice, idx) => (
                    <motion.div 
                      key={notice._id} 
                      initial={{ opacity: 0, x: -20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      transition={{ delay: idx * 0.1 }}
                      className="glass-card p-6 border-l-4 border-l-orange-500 relative"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-xl font-bold text-white">{notice.title}</h4>
                        <span className="text-xs font-mono text-orange-300 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                          {new Date(notice.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-md text-gray-300 whitespace-pre-wrap leading-relaxed">{notice.message}</p>
                    </motion.div>
                  ))}
                  {notices.length === 0 && <p className="text-gray-400">No notices posted.</p>}
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
