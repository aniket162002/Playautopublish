export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  googleToken?: string;
}

export interface Project {
  id: string;
  name: string;
  packageName: string;
  status: 'draft' | 'uploading' | 'processing' | 'testing' | 'published' | 'error';
  version: string;
  track: 'internal' | 'alpha' | 'beta' | 'production';
  lastUpdated: Date;
  progress: number;
  aabFile?: File;
  assets: {
    icon?: File;
    featureGraphic?: File;
    screenshots: File[];
  };
  metadata: {
    title: string;
    shortDescription: string;
    fullDescription: string;
    privacyPolicyUrl: string;
    category: string;
  };
  errors: ProjectError[];
  notifications: Notification[];
}

export interface ProjectError {
  id: string;
  type: 'warning' | 'error' | 'critical';
  message: string;
  suggestion?: string;
  autoFixable: boolean;
  fixed: boolean;
}

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface PublishStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  message?: string;
}