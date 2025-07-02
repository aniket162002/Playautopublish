import React from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  MoreVertical,
  Smartphone,
  Rocket
} from 'lucide-react';
import { Project } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'published': return 'from-green-400 to-emerald-500';
      case 'processing': return 'from-blue-400 to-indigo-500';
      case 'uploading': return 'from-yellow-400 to-orange-500';
      case 'error': return 'from-red-400 to-pink-500';
      case 'testing': return 'from-purple-400 to-indigo-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'published': return CheckCircle;
      case 'processing': return Clock;
      case 'uploading': return Play;
      case 'error': return AlertTriangle;
      case 'testing': return Rocket;
      default: return Pause;
    }
  };

  const StatusIcon = getStatusIcon(project.status);

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/30 cursor-pointer group hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
              {project.name}
            </h3>
            <p className="text-sm text-gray-500">{project.packageName}</p>
          </div>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="mb-4">
        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r ${getStatusColor(project.status)} text-white text-sm font-medium`}>
          <StatusIcon className="w-4 h-4" />
          <span className="capitalize">{project.status}</span>
        </div>
        <span className="ml-2 text-sm text-gray-500 capitalize">
          {project.track} track
        </span>
      </div>

      {project.progress > 0 && project.progress < 100 && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${project.progress}%` }}
              transition={{ duration: 0.5 }}
              className={`h-2 rounded-full bg-gradient-to-r ${getStatusColor(project.status)}`}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>v{project.version}</span>
        <span>{formatDistanceToNow(project.lastUpdated)} ago</span>
      </div>

      {project.errors.length > 0 && (
        <div className="mt-3 flex items-center space-x-2 text-sm text-amber-600">
          <AlertTriangle className="w-4 h-4" />
          <span>{project.errors.length} issue{project.errors.length > 1 ? 's' : ''} found</span>
        </div>
      )}
    </motion.div>
  );
};

export default ProjectCard;