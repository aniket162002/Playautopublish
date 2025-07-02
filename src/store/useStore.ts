import { create } from 'zustand';
import { User, Project, Notification } from '../types';

interface Store {
  user: User | null;
  projects: Project[];
  notifications: Notification[];
  currentProject: Project | null;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (project: Project | null) => void;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
}

export const useStore = create<Store>((set, get) => ({
  user: null,
  projects: [],
  notifications: [],
  currentProject: null,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  addProject: (project) => set((state) => ({
    projects: [...state.projects, project]
  })),
  
  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p),
    currentProject: state.currentProject?.id === id 
      ? { ...state.currentProject, ...updates } 
      : state.currentProject
  })),
  
  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter(p => p.id !== id),
    currentProject: state.currentProject?.id === id ? null : state.currentProject
  })),
  
  setCurrentProject: (project) => set({ currentProject: project }),
  
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications]
  })),
  
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    )
  })),
  
  clearNotifications: () => set({ notifications: [] })
}));