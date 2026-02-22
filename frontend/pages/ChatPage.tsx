import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Project } from "../types";
import Workspace from "../components/Workspace";
import Processing from "../components/Processing";
import { fetchProject } from "../services/apiService";

interface LocationState {
  project?: Project;
}

const ChatPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as LocationState | null;

  const [project, setProject] = useState<Project | null>(
    locationState?.project || null,
  );
  const [loading, setLoading] = useState(!project);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we already have the project from navigation state, skip fetch
    if (project) return;
    if (!projectId) return;

    const loadProject = async () => {
      try {
        const fetched = await fetchProject(projectId);
        setProject(fetched);
      } catch (err) {
        console.error(err);
        setError("Failed to load project. It may not exist.");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId, project]);

  if (loading) {
    return <Processing />;
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-charcoal-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-off-white text-xl font-display">
            {error || "Project not found"}
          </p>
          <button
            onClick={() => navigate("/")}
            className="clay-button text-charcoal-dark font-display px-6 py-3 text-sm tracking-wide rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return <Workspace project={project} />;
};

export default ChatPage;
