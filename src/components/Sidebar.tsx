import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  FolderOpen, 
  Upload, 
  Settings, 
  BarChart3, 
  Bell,
  HelpCircle,
  Zap
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: FolderOpen, label: 'Projects' },
    { icon: Upload, label: 'Upload' },
    { icon: BarChart3, label: 'Analytics' },
    { icon: Bell, label: 'Notifications' },
    { icon: Settings, label: 'Settings' },
    { icon: HelpCircle, label: 'Help' },
  ];

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-0 h-full w-64 bg-white/30 backdrop-blur-lg border-r border-white/20 z-40 pt-20"
    >
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all ${
                item.active
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          ))}
        </nav>

        <div className="mt-8 p-4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl text-white">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-5 h-5" />
            <span className="font-semibold">Pro Features</span>
          </div>
          <p className="text-sm text-emerald-100 mb-3">
            Unlock advanced automation and analytics
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-white/20 hover:bg-white/30 rounded-lg py-2 text-sm font-medium transition-colors"
          >
            Upgrade Now
          </motion.button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;