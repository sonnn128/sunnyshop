import React, { useState, useMemo } from 'react';
import { useRole } from '../../hooks/useRole';
import { useI18n } from '../../i18n';
import ModernSidebar from './components/ModernSidebar';
import ModernHeader from './components/ModernHeader';
import { motion, AnimatePresence } from 'framer-motion';

const ModernAdminLayout = ({ children, activeTab, onTabChange }) => {
  const { user, role } = useRole();
  const { t } = useI18n();
  const [collapsed, setCollapsed] = useState(false);

  const currentUser = useMemo(() => ({
    name: user?.fullName || user?.username || user?.email || "Admin User",
    role: role,
    avatar: user?.avatar
  }), [user, role]);

  const roleLabels = {
    staff: t.settings.users.split(' ')[0], // Approximate, or we can add specific keys
    manager: 'Quản lý',
    admin: 'Quản trị viên'
  };

  const tabs = [
    { id: 'dashboard', label: t.nav.overview, icon: 'LayoutDashboard', roles: ['staff', 'manager', 'admin'] },
    { id: 'orders', label: t.nav.orders, icon: 'ShoppingBag', roles: ['staff', 'manager', 'admin'] },
    { id: 'products', label: t.nav.products, icon: 'Package', roles: ['staff', 'manager', 'admin'] },
    { id: 'categories', label: t.nav.categories, icon: 'FolderTree', roles: ['staff', 'manager', 'admin'] },
    { id: 'brands', label: t.nav.brands, icon: 'Globe', roles: ['staff', 'manager', 'admin'] },
    { id: 'chat', label: t.nav.messages, icon: 'MessageCircle', roles: ['staff', 'manager', 'admin'] },
    { id: 'analytics', label: t.nav.analytics, icon: 'BarChart3', roles: ['manager', 'admin'] },
    { id: 'users', label: t.nav.customers, icon: 'Users', roles: ['admin'] },
    { id: 'settings', label: t.nav.settings, icon: 'Settings', roles: ['admin'] }
  ].filter(tab => tab.roles.includes(role));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 overflow-x-hidden">
      {/* Dynamic Animated Blobs (Subtle) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 opacity-30">
        <motion.div 
          animate={{ x: [0, 20, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-slate-200 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ x: [0, -30, 0], y: [0, 20, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-slate-300 rounded-full blur-[80px]" 
        />
      </div>

      <ModernSidebar 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={onTabChange} 
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      
      <ModernHeader 
        collapsed={collapsed} 
        user={currentUser} 
        roleLabels={roleLabels}
      />

      <motion.main 
        initial={false}
        animate={{ 
          paddingLeft: collapsed ? "100px" : "300px",
        }}
        className="transition-all duration-300 min-h-screen pt-32 pb-16 pr-10"
      >
        <div className="max-w-[1600px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  );
};

export default ModernAdminLayout;
