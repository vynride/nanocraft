const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface BackendStep {
  step_number: number;
  scene_description: string;
  alt_text: string;
  image_url?: string;
}

export interface BackendProject {
  project_summary: string;
  visual_anchor: string;
  steps: BackendStep[];
}

export interface BackendInstruction {
  id?: string;
  source_url: string;
  project: BackendProject;
}

import { Project } from "../types";

function mapBackendToProject(data: BackendInstruction): Project {
  return {
    id: data.id || Math.random().toString(36).substr(2, 9),
    url: data.source_url,
    title: data.project.project_summary,
    visualAnchor: data.project.visual_anchor,
    steps: data.project.steps.map((s) => ({
      stepNumber: s.step_number,
      sceneDescription: s.scene_description,
      altText: s.alt_text,
      imageUrl: s.image_url ? `${API_URL}${s.image_url}` : undefined,
      isCompleted: false,
    })),
  };
}

export async function deconstructDIYProject(url: string): Promise<Project> {
  const response = await fetch(`${API_URL}/new-chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ instructables_url: url }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Backend error (${response.status}): ${detail}`);
  }

  const data: BackendInstruction = await response.json();
  return mapBackendToProject(data);
}

export async function fetchProject(projectId: string): Promise<Project> {
  const response = await fetch(`${API_URL}/projects/${projectId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch project (${response.status})`);
  }

  const data: BackendInstruction = await response.json();
  return mapBackendToProject(data);
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function sendChatMessage(
  projectId: string,
  message: string,
  history: ChatMessage[],
): Promise<string> {
  const response = await fetch(`${API_URL}/projects/${projectId}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Chat error (${response.status}): ${detail}`);
  }

  const data = await response.json();
  return data.response;
}
