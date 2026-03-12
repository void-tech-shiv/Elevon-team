import React from 'react';
import { 
  LayoutDashboard, Users, UserCheck, FolderGit2, 
  FileText, Bell, LogOut 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = ({ pendingStudents = 0, pendingProjects = 0 }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'overview', label: 'Command Center', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'requests', label: `Access Requests (${pendingStudents})`, icon: UserCheck, path: '/admin/requests' },
    { id: 'students', label: 'User Directory', icon: Users, path: '/admin/students' },
    { id: 'approvals', label: `Project Approvals (${pendingProjects})`, icon: FolderGit2, path: '/admin/projects' },
    { id: 'resources', label: 'Data Bank', icon: FileText, path: '/admin/resources' },
    { id: 'notices', label: 'Broadcasts', icon: Bell, path: '/admin/notices' },
  ];

  const activeTab = tabs.find(tab => location.pathname === tab.path)?.id || 'overview';

  return (
    <div className="w-64 sidebar-neon m-4 flex flex-col justify-between rounded-2xl shrink-0 z-10 border-r-pink-500/30 bg-black/80 shadow-[4px_0_24px_rgba(236,72,153,0.1)]">
      <div>
        <div className="p-6 border-b border-pink-500/20">
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-500 tracking-widest uppercase drop-shadow-[0_0_10px_rgba(236,72,153,0.6)]">ADMIN CORE</h2>
          <p className="text-pink-200/50 text-[10px] mt-2 uppercase tracking-widest font-mono">SYS-ADMIN: {user?.username}</p>
        </div>
        <nav className="p-4 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 uppercase tracking-wider text-xs font-bold ${
                activeTab === tab.id 
                ? 'bg-pink-950/50 text-pink-300 border border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.2)] translate-x-1' 
                : 'text-pink-100/40 hover:text-pink-200 hover:bg-pink-900/20 hover:border-pink-500/20 border border-transparent'
              }`}
            >
              <tab.icon size={18} className={activeTab === tab.id ? "text-pink-400" : "opacity-70"} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-pink-500/20">
        <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-red-500/80 hover:text-red-400 border border-transparent hover:bg-red-950/40 hover:border-red-500/40 transition-all font-bold text-xs uppercase tracking-wider">
          <LogOut size={18} /> TERM SESSION
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
