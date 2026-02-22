
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Landing from '../components/Landing';
import Processing from '../components/Processing';
import { deconstructDIYProject } from '../services/apiService';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (url: string) => {
    setIsProcessing(true);
    setError(null);
    try {
      const project = await deconstructDIYProject(url);
      navigate(`/chat/${project.id}`, { state: { project } });
    } catch (err) {
      console.error(err);
      setError("Failed to deconstruct project. Please try again.");
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return <Processing />;
  }

  return <Landing onGenerate={handleGenerate} error={error} />;
};

export default LandingPage;
