import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Upload, 
  Settings, 
  Rocket, 
  CheckCircle,
  AlertTriangle,
  Clock,
  Zap
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { PublishStep } from '../types';
import UploadZone from './UploadZone';
import toast from 'react-hot-toast';

const PublishWizard: React.FC = () => {
  const { currentProject, updateProject, addNotification } = useStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSteps, setPublishSteps] = useState<PublishStep[]>([]);

  const steps = [
    { id: 'upload', title: 'Upload Files', icon: Upload },
    { id: 'metadata', title: 'App Metadata', icon: Settings },
    { id: 'review', title: 'Review & Publish', icon: Rocket }
  ];

  const initializePublishSteps = () => {
    const steps: PublishStep[] = [
      { id: '1', name: 'Creating Edit Session', status: 'pending', progress: 0 },
      { id: '2', name: 'Uploading AAB', status: 'pending', progress: 0 },
      { id: '3', name: 'Uploading Assets', status: 'pending', progress: 0 },
      { id: '4', name: 'Updating Metadata', status: 'pending', progress: 0 },
      { id: '5', name: 'Policy Validation', status: 'pending', progress: 0 },
      { id: '6', name: 'Committing Changes', status: 'pending', progress: 0 },
      { id: '7', name: 'Review Submission', status: 'pending', progress: 0 }
    ];
    setPublishSteps(steps);
  };

  const simulatePublishStep = async (stepIndex: number) => {
    const step = publishSteps[stepIndex];
    
    // Start processing
    setPublishSteps(prev => prev.map(s => 
      s.id === step.id 
        ? { ...s, status: 'processing', message: `Processing ${s.name.toLowerCase()}...` }
        : s
    ));

    // Simulate progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setPublishSteps(prev => prev.map(s => 
        s.id === step.id ? { ...s, progress } : s
      ));
    }

    // Complete step
    setPublishSteps(prev => prev.map(s => 
      s.id === step.id 
        ? { ...s, status: 'completed', progress: 100, message: `${s.name} completed successfully` }
        : s
    ));

    // Add some variety - simulate an error on policy validation
    if (stepIndex === 4 && Math.random() > 0.7) {
      setPublishSteps(prev => prev.map(s => 
        s.id === step.id 
          ? { ...s, status: 'error', message: 'Privacy policy URL is missing' }
          : s
      ));
      throw new Error('Privacy policy validation failed');
    }
  };

  const handlePublish = async () => {
    if (!currentProject) return;

    setIsPublishing(true);
    initializePublishSteps();

    try {
      // Simulate each publish step
      for (let i = 0; i < publishSteps.length; i++) {
        await simulatePublishStep(i);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Success
      updateProject(currentProject.id, { 
        status: 'published', 
        progress: 100,
        lastUpdated: new Date()
      });

      addNotification({
        id: Date.now().toString(),
        type: 'success',
        message: `${currentProject.name} has been published successfully!`,
        timestamp: new Date(),
        read: false
      });

      toast.success('App published successfully! 🎉');

    } catch (error) {
      updateProject(currentProject.id, { 
        status: 'error',
        lastUpdated: new Date()
      });

      addNotification({
        id: Date.now().toString(),
        type: 'error',
        message: `Failed to publish ${currentProject.name}: ${error}`,
        timestamp: new Date(),
        read: false
      });

      toast.error('Publishing failed. Please check the errors.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleFileUpload = (files: File[], type: 'aab' | 'icon' | 'featureGraphic' | 'screenshots') => {
    if (!currentProject) return;

    if (type === 'aab') {
      updateProject(currentProject.id, { aabFile: files[0] });
      toast.success('AAB file uploaded successfully!');
    } else if (type === 'screenshots') {
      updateProject(currentProject.id, { 
        assets: { ...currentProject.assets, screenshots: files }
      });
      toast.success(`${files.length} screenshot(s) uploaded!`);
    } else {
      updateProject(currentProject.id, { 
        assets: { ...currentProject.assets, [type]: files[0] }
      });
      toast.success(`${type} uploaded successfully!`);
    }
  };

  const renderUploadStep = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Your App Files</h3>
        <p className="text-gray-600">Upload your AAB file and app assets to get started.</p>
      </div>

      <div className="grid gap-6">
        <UploadZone
          accept={{ 'application/octet-stream': ['.aab'] }}
          onDrop={(files) => handleFileUpload(files, 'aab')}
          title="Android App Bundle (AAB)"
          description="Upload your signed AAB file"
          files={currentProject?.aabFile ? [currentProject.aabFile] : []}
        />

        <div className="grid md:grid-cols-2 gap-6">
          <UploadZone
            accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
            onDrop={(files) => handleFileUpload(files, 'icon')}
            title="App Icon"
            description="512x512 PNG format"
            files={currentProject?.assets.icon ? [currentProject.assets.icon] : []}
          />

          <UploadZone
            accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
            onDrop={(files) => handleFileUpload(files, 'featureGraphic')}
            title="Feature Graphic"
            description="1024x500 PNG/JPG format"
            files={currentProject?.assets.featureGraphic ? [currentProject.assets.featureGraphic] : []}
          />
        </div>

        <UploadZone
          accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
          multiple
          onDrop={(files) => handleFileUpload(files, 'screenshots')}
          title="Screenshots"
          description="Upload 2-8 screenshots (phone/tablet)"
          files={currentProject?.assets.screenshots || []}
        />
      </div>
    </div>
  );

  const renderMetadataStep = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">App Store Metadata</h3>
        <p className="text-gray-600">Configure your app's store listing information.</p>
      </div>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">App Title</label>
            <input
              type="text"
              value={currentProject?.metadata.title || ''}
              onChange={(e) => currentProject && updateProject(currentProject.id, {
                metadata: { ...currentProject.metadata, title: e.target.value }
              })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter app title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={currentProject?.metadata.category || ''}
              onChange={(e) => currentProject && updateProject(currentProject.id, {
                metadata: { ...currentProject.metadata, category: e.target.value }
              })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select category</option>
              <option value="Productivity">Productivity</option>
              <option value="Games">Games</option>
              <option value="Social">Social</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Health & Fitness">Health & Fitness</option>
              <option value="Food & Drink">Food & Drink</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
          <textarea
            value={currentProject?.metadata.shortDescription || ''}
            onChange={(e) => currentProject && updateProject(currentProject.id, {
              metadata: { ...currentProject.metadata, shortDescription: e.target.value }
            })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={3}
            placeholder="Brief description (max 80 characters)"
            maxLength={80}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
          <textarea
            value={currentProject?.metadata.fullDescription || ''}
            onChange={(e) => currentProject && updateProject(currentProject.id, {
              metadata: { ...currentProject.metadata, fullDescription: e.target.value }
            })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={6}
            placeholder="Detailed app description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Privacy Policy URL</label>
          <input
            type="url"
            value={currentProject?.metadata.privacyPolicyUrl || ''}
            onChange={(e) => currentProject && updateProject(currentProject.id, {
              metadata: { ...currentProject.metadata, privacyPolicyUrl: e.target.value }
            })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="https://yoursite.com/privacy"
          />
        </div>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Review & Publish</h3>
        <p className="text-gray-600">Review your app details and publish to the Play Store.</p>
      </div>

      {!isPublishing ? (
        <div className="space-y-6">
          <div className="bg-white/60 rounded-2xl p-6 border border-white/30">
            <h4 className="font-semibold text-gray-900 mb-4">App Summary</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Title:</span>
                <span className="ml-2 font-medium">{currentProject?.metadata.title}</span>
              </div>
              <div>
                <span className="text-gray-500">Package:</span>
                <span className="ml-2 font-medium">{currentProject?.packageName}</span>
              </div>
              <div>
                <span className="text-gray-500">Version:</span>
                <span className="ml-2 font-medium">{currentProject?.version}</span>
              </div>
              <div>
                <span className="text-gray-500">Track:</span>
                <span className="ml-2 font-medium capitalize">{currentProject?.track}</span>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePublish}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center space-x-2"
          >
            <Rocket className="w-6 h-6" />
            <span>Publish to Play Store</span>
          </motion.button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center"
            >
              <Zap className="w-8 h-8 text-white" />
            </motion.div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Publishing Your App</h4>
            <p className="text-gray-600">Please wait while we process your submission...</p>
          </div>

          <div className="space-y-4">
            {publishSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-4 bg-white/60 rounded-xl border border-white/30"
              >
                <div className="flex-shrink-0">
                  {step.status === 'completed' && (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
                  {step.status === 'processing' && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Clock className="w-6 h-6 text-blue-500" />
                    </motion.div>
                  )}
                  {step.status === 'error' && (
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                  )}
                  {step.status === 'pending' && (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{step.name}</span>
                    {step.status === 'processing' && (
                      <span className="text-sm text-gray-500">{step.progress}%</span>
                    )}
                  </div>
                  {step.message && (
                    <p className="text-sm text-gray-600">{step.message}</p>
                  )}
                  {step.status === 'processing' && (
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${step.progress}%` }}
                        className="h-1 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (!currentProject) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No project selected</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                index <= currentStep
                  ? 'bg-indigo-500 border-indigo-500 text-white'
                  : 'border-gray-300 text-gray-400'
              }`}
            >
              <step.icon className="w-6 h-6" />
            </motion.div>
            <div className="ml-3 mr-8">
              <p className={`font-medium ${
                index <= currentStep ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mr-8 ${
                index < currentStep ? 'bg-indigo-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 border border-white/30"
      >
        <AnimatePresence mode="wait">
          {currentStep === 0 && renderUploadStep()}
          {currentStep === 1 && renderMetadataStep()}
          {currentStep === 2 && renderReviewStep()}
        </AnimatePresence>

        {/* Navigation */}
        {!isPublishing && (
          <div className="flex justify-between mt-8 pt-8 border-t border-gray-200">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </motion.button>

            {currentStep < steps.length - 1 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                className="flex items-center space-x-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PublishWizard;