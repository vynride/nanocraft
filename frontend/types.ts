
export interface Step {
  stepNumber: number;
  sceneDescription: string;
  altText: string;
  isCompleted: boolean;
}

export interface Project {
  id: string;
  title: string;
  visualAnchor: string;
  steps: Step[];
  url?: string;
}

export enum AppState {
  LIBRARY = 'LIBRARY',
  LANDING = 'LANDING',
  PROCESSING = 'PROCESSING',
  WORKSPACE = 'WORKSPACE'
}
