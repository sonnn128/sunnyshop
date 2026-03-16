import React, { useState, useMemo } from 'react';
import { useRole } from '../../hooks/useRole';
import ModernSidebar from './components/ModernSidebar';
import ModernHeader from './components/ModernHeader';
import { motion, AnimatePresence } from 'framer-motion';

const ModernAdminLayout = ({ children, activeTab, onTabChange }) => {
  const { user, role } = useRole();
  const [collapsed, setCollapsed] = useState(false);

  const currentUser = useMemo(() => ({
    name: user?.fullName || user?.username || user?.email || "Admin User",
    role: role,
    avatar: user?.avatar
  }), [user, role]);

  const roleLabels = {
    staff: 'Nhân viên',
    manager: 'Quản lý',
    admin: 'Quản trị viên'
  };

  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: 'LayoutDashboard', roles: ['staff', 'manager', 'admin'] },
    { id: 'orders', label: 'Orders', icon: 'ShoppingBag', roles: ['staff', 'manager', 'admin'] },
    { id: 'products', label: 'Inventory', icon: 'Package', roles: ['staff', 'manager', 'admin'] },
    { id: 'categories', label: 'Categories', icon: 'FolderTree', roles: ['staff', 'manager', 'admin'] },
    { id: 'brands', label: 'Brands', icon: 'Globe', roles: ['staff', 'manager', 'admin'] },
    { id: 'chat', label: 'Messages', icon: 'MessageCircle', roles: ['staff', 'manager', 'admin'] },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3', roles: ['manager', 'admin'] },
    { id: 'users', label: 'Customers', icon: 'Users', roles: ['admin'] },
    { id: 'settings', label: 'Settings', icon: 'Settings', roles: ['admin'] }
  ].filter(tab => tab.roles.includes(role));

  return (
    <div className="min-h-screen mesh-gradient text-foreground selection:bg-primary/20 overflow-x-hidden">
      {/* Dynamic Animated Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div 
          animate={{ x: [0, 40, 0], y: [0, 60, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, 40, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] bg-blue-400/10 rounded-full blur-[110px]" 
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
        <div className="max-w-[1700px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
