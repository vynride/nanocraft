
import React, { useState } from 'react';
import { AppState, Project } from './types';
import Landing from './components/Landing';
import Workspace from './components/Workspace';
import Library from './components/Library';
import Processing from './components/Processing';
import { deconstructDIYProject } from './services/apiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (url: string) => {
    setAppState(AppState.PROCESSING);
    setError(null);
    try {
      const project = await deconstructDIYProject(url);
      setActiveProject(project);
      setAppState(AppState.WORKSPACE);
    } catch (err) {
      console.error(err);
      setError("Failed to deconstruct project. Please try again.");
      setAppState(AppState.LANDING);
    }
  };

  const handleBackToLibrary = () => {
    setAppState(AppState.LIBRARY);
  };

  const handleNewProject = () => {
    setAppState(AppState.LANDING);
  };

  return (
    <div className="min-h-screen bg-charcoal-bg">
      {appState === AppState.LANDING && (
        <Landing onGenerate={handleGenerate} onShowLibrary={handleBackToLibrary} />
      )}
      {appState === AppState.PROCESSING && (
        <Processing />
      )}
      {appState === AppState.WORKSPACE && activeProject && (
        <Workspace 
          project={activeProject} 
          onExit={() => setAppState(AppState.LIBRARY)} 
        />
      )}
      {appState === AppState.LIBRARY && (
        <Library 
          onNewProject={handleNewProject} 
          onOpenProject={(p) => {
            setActiveProject(p);
            setAppState(AppState.WORKSPACE);
          }}
        />
      )}
    </div>
  );
};

export default App;
