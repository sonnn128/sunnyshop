import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/AppIcon';
import { cn } from '@/lib/utils';

const ModernHeader = ({ collapsed, user, roleLabels }) => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch (e) {}
    const remembered = localStorage.getItem('rememberedEmail');
    try { localStorage.removeItem('user'); localStorage.removeItem('token'); } catch (e) {}
    if (remembered) try { localStorage.setItem('rememberedEmail', remembered); } catch (e) {}
    window.location.href = '/login';
  };

  return (
    <motion.header 
      initial={false}
      animate={{ 
        left: collapsed ? 80 : 280,
      }}
      className={cn(
        "fixed top-0 right-0 h-24 z-40 flex items-center justify-between px-10 pointer-events-none",
      )}
    >
      <div className="w-full h-16 bg-white border border-slate-200 rounded-none flex items-center justify-between px-8 shadow-sm pointer-events-auto">
        {/* Left: Search Bar */}
        <div className="flex-1 max-w-xl group">
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Icon name="Search" size={16} className="text-slate-400 group-focus-within:text-slate-900 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Tìm kiếm..." 
              className="w-full bg-slate-50 border-none rounded-none py-2 pl-12 pr-4 text-[11px] font-bold uppercase tracking-tight focus:ring-1 focus:ring-slate-900/10 transition-all placeholder:text-slate-400"
            />
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <span className="text-[9px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-none border border-slate-100">⌘K</span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-6 ml-6">
          <div className="flex items-center space-x-2 pr-6 border-r border-slate-100">
            <HeaderAction icon="Bell" badge />
            <HeaderAction icon="Mail" />
            <HeaderAction icon="LayoutGrid" />
          </div>

          <div 
            ref={menuRef}
            className="relative flex items-center space-x-4 pl-2 cursor-pointer group"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="text-right hidden sm:block">
              <p className="text-[11px] font-bold text-slate-900 leading-none uppercase tracking-widest transition-colors">
                {user?.name?.split(' ')[0] || "Admin"}
              </p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.1em] mt-1">
                {roleLabels[user?.role] || user?.role}
              </p>
            </div>
            <div className="relative">
              <div className="w-10 h-10 rounded-none overflow-hidden border border-slate-200">
                <img 
                  src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
            </div>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-3 w-56 bg-white border border-slate-200 shadow-xl z-50"
                >
                  <div className="p-4 border-b border-slate-100">
                    <p className="text-[11px] font-bold text-slate-900 uppercase tracking-wide">{user?.email}</p>
                    <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-wider">{roleLabels[user?.role] || user?.role}</p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate('/user-dashboard'); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      <Icon name="User" size={16} />
                      <span>Hồ sơ</span>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleLogout(); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                      <Icon name="LogOut" size={16} />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

const HeaderAction = ({ icon, badge }) => (
  <motion.button 
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.95 }}
    className="relative p-2 rounded-none hover:bg-slate-50 transition-all text-slate-600 hover:text-slate-900"
  >
    <Icon name={icon} size={18} strokeWidth={1.5} />
    {badge && (
      <span className="absolute top-1 right-1 w-2 h-2 bg-slate-900 rounded-full border-2 border-white" />
    )}
  </motion.button>
);

export default ModernHeader;
