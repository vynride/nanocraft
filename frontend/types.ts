export interface Step {
  stepNumber: number;
  sceneDescription: string;
  altText: string;
  imageUrl?: string;
  isCompleted: boolean;
}

export interface Project {
  id: string;
  title: string;
  visualAnchor: string;
  steps: Step[];
  url?: string;
}
