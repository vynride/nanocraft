import React from "react";
import { useNavigate } from "react-router-dom";
import Library from "../components/Library";
import { Project } from "../types";

const LibraryPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNewProject = () => {
    navigate("/");
  };

  const handleOpenProject = (project: Project) => {
    navigate(`/chat/${project.id}`, { state: { project } });
  };

  return (
    <Library
      onNewProject={handleNewProject}
      onOpenProject={handleOpenProject}
    />
  );
};

export default LibraryPage;
