const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface BackendStep {
  step_number: number;
  scene_description: string;
  alt_text: string;
}

export interface BackendProject {
  project_summary: string;
  visual_anchor: string;
  steps: BackendStep[];
}

export interface BackendInstruction {
  source_url: string;
  project: BackendProject;
}

import { Project } from '../types';

export async function deconstructDIYProject(url: string): Promise<Project> {
  const response = await fetch(`${API_URL}/new-chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ instructables_url: url }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Backend error (${response.status}): ${detail}`);
  }

  const data: BackendInstruction = await response.json();
  const { project } = data;

  return {
    id: Math.random().toString(36).substr(2, 9),
    url: data.source_url,
    title: project.project_summary,
    visualAnchor: project.visual_anchor,
    steps: project.steps.map((s) => ({
      stepNumber: s.step_number,
      sceneDescription: s.scene_description,
      altText: s.alt_text,
      isCompleted: false,
    })),
  };
}
