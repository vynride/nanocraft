from typing import List, Optional

from pydantic import BaseModel


class Step(BaseModel):
    step_number: int
    scene_description: str
    alt_text: str
    image_url: Optional[str] = None


class Project(BaseModel):
    project_summary: str
    visual_anchor: str
    steps: List[Step]


class Instruction(BaseModel):
    id: Optional[str] = None
    source_url: str
    project: Project
