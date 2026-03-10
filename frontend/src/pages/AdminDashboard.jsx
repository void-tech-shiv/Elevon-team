import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Users, UserCheck, FolderGit2, 
  FileText, Bell, LogOut, CheckCircle, XCircle, Trash2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../api/config';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // State for data
  const [students, setStudents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [resources, setResources] = useState([]);
  const [notices, setNotices] = useState([]);

  const fetchData = async () => {
    try {
      const [stRes, prRes, reRes, noRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/admin/students`),
        axios.get(`${API_BASE_URL}/api/admin/projects`),
        axios.get(`${API_BASE_URL}/api/admin/resources`),
        axios.get(`${API_BASE_URL}/api/admin/notices`)
      ]);
      setStudents(stRes.data);
      setProjects(prRes.data);
      setResources(reRes.data);
      setNotices(noRes.data);
    } catch (error) {
      console.error("Failed to fetch admin data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleStudentStatus = async (id, status) => {
    try {
      await axios.put(`${API_BASE_URL}/api/admin/students/${id}/status`, { status });
      fetchData();
    } catch (error) {
      alert('Failed to update student status');
    }
  };

  const handleDeleteStudent = async (id) => {
    if(!window.confirm('Delete this student?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/students/${id}`);
      fetchData();
    } catch (error) {
      alert('Failed to delete student');
    }
  };

  const handleProjectStatus = async (id, status) => {
    try {
      await axios.put(`${API_BASE_URL}/api/admin/projects/${id}/status`, { status });
      fetchData();
    } catch (error) {
      alert('Failed to update project status');
    }
  };

  const handleDeleteProject = async (id) => {
    if(!window.confirm('Delete this project?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/projects/${id}`);
      fetchData();
    } catch (error) {
      alert('Failed to delete project');
    }
  };

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const message = form.message.value;
    try {
      await axios.post(`${API_BASE_URL}/api/admin/notices`, { title, message });
      form.reset();
      fetchData();
    } catch (error) {
      alert('Failed to create notice');
    }
  };

  const handleDeleteNotice = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/notices/${id}`);
      fetchData();
    } catch (error) {
      alert('Failed to delete notice');
    }
  };

  const handleUploadResource = async (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const description = form.description.value;
    const file = form.file.files[0];

    if (!file) return alert('Please select a file');

    try {
      // 1. Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const fileLink = uploadRes.data.url;

      // 2. Save resource to DB
      await axios.post(`${API_BASE_URL}/api/admin/resources`, { title, description, fileLink });
      form.reset();
      fetchData();
      alert('Resource uploaded successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to upload resource');
    }
  };

  const handleDeleteResource = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/resources/${id}`);
      fetchData();
    } catch (error) {
      alert('Failed to delete resource');
    }
  };

  const pendingStudents = students.filter(s => s.status === 'Pending');
  const pendingProjects = projects.filter(p => p.status === 'Pending');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'requests', label: `Student Requests (${pendingStudents.length})`, icon: UserCheck },
    { id: 'students', label: 'All Students', icon: Users },
    { id: 'projects', label: 'Projects Management', icon: FolderGit2 },
    { id: 'resources', label: 'Resources', icon: FileText },
    { id: 'notices', label: 'Notices', icon: Bell },
  ];

  return (
    <div className="min-h-screen flex bg-slate-900">
      {/* Sidebar */}
      <div className="w-64 glass-panel m-4 flex flex-col justify-between border-white/10 shrink-0">
        <div>
          <div className="p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-400">Admin Panel</h2>
            <p className="text-gray-400 text-sm mt-1">Welcome, {user?.username}</p>
          </div>
          <nav className="p-4 space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === tab.id 
                  ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 border border-orange-500/30' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon size={20} />
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
            ))}
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
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <h3 className="text-3xl font-bold mb-8">Dashboard Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="glass-card p-6 border-l-4 border-l-blue-500">
                    <p className="text-gray-400 text-sm font-semibold mb-1">Total Students</p>
                    <p className="text-3xl font-bold text-white">{students.length}</p>
                  </div>
                  <div className="glass-card p-6 border-l-4 border-l-purple-500">
                    <p className="text-gray-400 text-sm font-semibold mb-1">Total Projects</p>
                    <p className="text-3xl font-bold text-white">{projects.length}</p>
                  </div>
                  <div className="glass-card p-6 border-l-4 border-l-orange-500">
                    <p className="text-gray-400 text-sm font-semibold mb-1">Pending Approvals</p>
                    <p className="text-3xl font-bold text-white">{pendingStudents.length + pendingProjects.length}</p>
                  </div>
                  <div className="glass-card p-6 border-l-4 border-l-green-500">
                    <p className="text-gray-400 text-sm font-semibold mb-1">Total Resources</p>
                    <p className="text-3xl font-bold text-white">{resources.length}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                  <div className="glass-card p-6">
                    <h4 className="text-xl font-bold mb-4">Recent Projects</h4>
                    <div className="space-y-4">
                      {projects.slice(0, 5).map(p => (
                        <div key={p._id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                          <div>
                            <p className="font-semibold text-sm">{p.title}</p>
                            <p className="text-xs text-gray-400">By {p.studentId?.name || 'Unknown'}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${p.status === 'Approved' ? 'bg-green-500/20 text-green-300' : p.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300'}`}>
                            {p.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="glass-card p-6">
                    <h4 className="text-xl font-bold mb-4">Recent Students</h4>
                    <div className="space-y-4">
                      {students.slice(0, 5).map(s => (
                        <div key={s._id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                          <div>
                            <p className="font-semibold text-sm">{s.name}</p>
                            <p className="text-xs text-gray-400">{s.department}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${s.status === 'Active' ? 'bg-green-500/20 text-green-300' : s.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300'}`}>
                            {s.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* REQUESTS TAB */}
            {activeTab === 'requests' && (
              <motion.div key="requests" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h3 className="text-3xl font-bold mb-6">Student Registration Requests</h3>
                {pendingStudents.length === 0 ? (
                  <p className="text-gray-400">No pending student requests.</p>
                ) : (
                  <div className="grid gap-4">
                    {pendingStudents.map(student => (
                      <div key={student._id} className="glass-card p-5 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                          <p className="font-bold text-lg">{student.name} <span className="text-gray-400 text-sm font-normal">({student.studentId})</span></p>
                          <p className="text-sm text-indigo-300">{student.email} • {student.department} • {student.year}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleStudentStatus(student._id, 'Active')} className="bg-green-500/20 hover:bg-green-500/40 text-green-400 p-2 rounded-lg flex items-center gap-2 transition-colors">
                            <CheckCircle size={18} /> Accept
                          </button>
                          <button onClick={() => handleStudentStatus(student._id, 'Rejected')} className="bg-red-500/20 hover:bg-red-500/40 text-red-400 p-2 rounded-lg flex items-center gap-2 transition-colors">
                            <XCircle size={18} /> Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* STUDENTS TAB */}
            {activeTab === 'students' && (
              <motion.div key="students" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h3 className="text-3xl font-bold mb-6">Manage Students</h3>
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10 text-gray-300 text-sm">
                        <th className="p-4 font-medium">Name</th>
                        <th className="p-4 font-medium">ID / Dept</th>
                        <th className="p-4 font-medium">Email</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {students.map(s => (
                        <tr key={s._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="p-4">{s.name}</td>
                          <td className="p-4 text-gray-400">{s.studentId}<br/>{s.department}</td>
                          <td className="p-4 text-gray-400">{s.email}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${s.status === 'Active' ? 'bg-green-500/20 text-green-300' : s.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300'}`}>
                              {s.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <select 
                              value={s.status} 
                              onChange={(e) => handleStudentStatus(s._id, e.target.value)}
                              className="bg-white/10 border border-white/20 rounded px-2 py-1 text-xs mr-2 outline-none"
                            >
                              <option value="Active">Active</option>
                              <option value="Pending">Pending</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                            <button onClick={() => handleDeleteStudent(s._id)} className="text-red-400 hover:text-red-300 p-1">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* PROJECTS TAB */}
            {activeTab === 'projects' && (
              <motion.div key="projects" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h3 className="text-3xl font-bold mb-6">Project Approvals & Management</h3>
                <div className="grid gap-4">
                  {projects.map(project => (
                    <div key={project._id} className="glass-card p-5">
                      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="text-xl font-bold">{project.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${project.status === 'Approved' ? 'bg-green-500/20 text-green-300' : project.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300'}`}>
                              {project.status}
                            </span>
                          </div>
                          <p className="text-sm text-indigo-300 mb-2">By {project.studentId?.name || 'Unknown Student'} ({project.studentId?.department})</p>
                          <p className="text-gray-300 text-sm line-clamp-2">{project.description}</p>
                        </div>
                        <div className="flex gap-2 items-start shrink-0">
                          {project.status !== 'Approved' && (
                            <button onClick={() => handleProjectStatus(project._id, 'Approved')} className="bg-green-500/20 hover:bg-green-500/40 text-green-400 p-2 rounded-lg flex items-center gap-2 transition-colors text-sm">
                              <CheckCircle size={16} /> Approve
                            </button>
                          )}
                          {project.status !== 'Rejected' && (
                            <button onClick={() => handleProjectStatus(project._id, 'Rejected')} className="bg-orange-500/20 hover:bg-orange-500/40 text-orange-400 p-2 rounded-lg flex items-center gap-2 transition-colors text-sm">
                              <XCircle size={16} /> Reject
                            </button>
                          )}
                          <button onClick={() => handleDeleteProject(project._id)} className="bg-red-500/20 hover:bg-red-500/40 text-red-400 p-2 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-4 border-t border-white/10 pt-3 text-sm">
                        {project.githubLink && <a href={project.githubLink} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300">GitHub Repo</a>}
                        {project.demoLink && <a href={project.demoLink} target="_blank" rel="noreferrer" className="text-purple-400 hover:text-purple-300">Live Demo</a>}
                        {project.pdfLink && <a href={project.pdfLink} target="_blank" rel="noreferrer" className="text-orange-400 hover:text-orange-300">Project PDF</a>}
                      </div>
                    </div>
                  ))}
                  {projects.length === 0 && <p className="text-gray-400">No projects uploaded yet.</p>}
                </div>
              </motion.div>
            )}

            {/* RESOURCES TAB */}
            {activeTab === 'resources' && (
              <motion.div key="resources" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h3 className="text-3xl font-bold mb-6">Educational Resources</h3>
                
                <form onSubmit={handleUploadResource} className="glass-card p-6 mb-8 border border-white/20">
                  <h4 className="text-lg font-semibold mb-4 text-indigo-200">Upload New Resource</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-300">Resource Title</label>
                      <input type="text" name="title" required className="input-glass" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-300">File (PDF/Image)</label>
                      <input type="file" name="file" required className="input-glass p-2 file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/20 file:text-indigo-300 hover:file:bg-indigo-500/40" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1 text-gray-300">Description</label>
                      <textarea name="description" required className="input-glass min-h-[100px]" />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary mt-4">Upload Resource</button>
                </form>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {resources.map(res => (
                    <div key={res._id} className="glass-card p-5 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-lg mb-1">{res.title}</h4>
                        <p className="text-xs text-indigo-300 mb-3">By {res.uploadedBy?.username}</p>
                        <p className="text-sm text-gray-300 mb-4">{res.description}</p>
                      </div>
                      <div className="flex justify-between items-center border-t border-white/10 pt-3">
                        <a href={res.fileLink} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:underline">View File</a>
                        <button onClick={() => handleDeleteResource(res._id)} className="text-red-400 hover:text-red-300 p-1"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* NOTICES TAB */}
            {activeTab === 'notices' && (
              <motion.div key="notices" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h3 className="text-3xl font-bold mb-6">Platform Notices</h3>
                
                <form onSubmit={handleCreateNotice} className="glass-card p-6 mb-8 border border-white/20">
                  <h4 className="text-lg font-semibold mb-4 text-orange-200">Post New Announcement</h4>
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-300">Title</label>
                      <input type="text" name="title" required className="input-glass" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-300">Message</label>
                      <textarea name="message" required className="input-glass min-h-[120px]" />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary bg-gradient-to-r from-orange-500 to-red-600 shadow-orange-500/50 mt-4">Post Notice</button>
                </form>

                <div className="space-y-4">
                  {notices.map(notice => (
                    <div key={notice._id} className="glass-card p-5 relative border-l-4 border-l-orange-500">
                      <button onClick={() => handleDeleteNotice(notice._id)} className="absolute top-4 right-4 text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                      <h4 className="text-lg font-bold mb-2 pr-8">{notice.title}</h4>
                      <p className="text-sm text-gray-300 whitespace-pre-wrap">{notice.message}</p>
                      <p className="text-xs text-gray-500 mt-3">{new Date(notice.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
