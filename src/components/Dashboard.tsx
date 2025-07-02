import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, Users, Smartphone, Clock } from 'lucide-react';
import { useStore } from '../store/useStore';
import ProjectCard from './ProjectCard';
import { Project } from '../types';

const Dashboard: React.FC = () => {
  const { projects, addProject, setCurrentProject } = useStore();

  useEffect(() => {
    // Initialize with sample projects
    if (projects.length === 0) {
      const sampleProjects: Project[] = [
        {
          id: '1',
          name: 'TaskMaster Pro',
          packageName: 'com.example.taskmaster',
          status: 'published',
          version: '1.2.3',
          track: 'production',
          lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          progress: 100,
          assets: { screenshots: [] },
          metadata: {
            title: 'TaskMaster Pro',
            shortDescription: 'Professional task management',
            fullDescription: 'A comprehensive task management application',
            privacyPolicyUrl: 'https://example.com/privacy',
            category: 'Productivity'
          },
          errors: [],
          notifications: []
        },
        {
          id: '2',
          name: 'FoodieHub',
          packageName: 'com.example.foodiehub',
          status: 'processing',
          version: '2.1.0',
          track: 'beta',
          lastUpdated: new Date(Date.now() - 30 * 60 * 1000),
          progress: 65,
          assets: { screenshots: [] },
          metadata: {
            title: 'FoodieHub',
            shortDescription: 'Discover amazing recipes',
            fullDescription: 'A food discovery and recipe sharing platform',
            privacyPolicyUrl: 'https://example.com/privacy',
            category: 'Food & Drink'
          },
          errors: [],
          notifications: []
        },
        {
          id: '3',
          name: 'FitTracker',
          packageName: 'com.example.fittracker',
          status: 'error',
          version: '1.0.1',
          track: 'internal',
          lastUpdated: new Date(Date.now() - 60 * 60 * 1000),
          progress: 0,
          assets: { screenshots: [] },
          metadata: {
            title: 'FitTracker',
            shortDescription: 'Track your fitness journey',
            fullDescription: 'A comprehensive fitness tracking application',
            privacyPolicyUrl: '',
            category: 'Health & Fitness'
          },
          errors: [
            {
              id: '1',
              type: 'error',
              message: 'Privacy policy URL is required',
              suggestion: 'Add a valid privacy policy URL',
              autoFixable: false,
              fixed: false
            }
          ],
          notifications: []
        }
      ];

      sampleProjects.forEach(project => addProject(project));
    }
  }, [projects.length, addProject]);

  const stats = [
    {
      label: 'Total Projects',
      value: projects.length,
      icon: Smartphone,
      color: 'from-blue-400 to-blue-600',
      change: '+2 this week'
    },
    {
      label: 'Published Apps',
      value: projects.filter(p => p.status === 'published').length,
      icon: TrendingUp,
      color: 'from-green-400 to-green-600',
      change: '+1 this month'
    },
    {
      label: 'Active Users',
      value: '12.4K',
      icon: Users,
      color: 'from-purple-400 to-purple-600',
      change: '+18% growth'
    },
    {
      label: 'Avg. Review Time',
      value: '2.3h',
      icon: Clock,
      color: 'from-orange-400 to-orange-600',
      change: '-30min faster'
    }
  ];

  const handleCreateProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: 'New Project',
      packageName: 'com.example.newapp',
      status: 'draft',
      version: '1.0.0',
      track: 'internal',
      lastUpdated: new Date(),
      progress: 0,
      assets: { screenshots: [] },
      metadata: {
        title: 'New Project',
        shortDescription: '',
        fullDescription: '',
        privacyPolicyUrl: '',
        category: 'Productivity'
      },
      errors: [],
      notifications: []
    };
    addProject(newProject);
    setCurrentProject(newProject);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your Google Play Console projects</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreateProject}
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow"
        >
          <Plus className="w-5 h-5" />
          <span>New Project</span>
        </motion.button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/30"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-green-600 font-medium">{stat.change}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Projects Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProjectCard
                project={project}
                onClick={() => setCurrentProject(project)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;