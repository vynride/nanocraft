from typing import List, Optional

from pydantic import BaseModel, Field


class Step(BaseModel):
    step_number: int
    scene_description: str
    alt_text: str
    image_url: Optional[str] = None


class Project(BaseModel):
    project_summary: str = Field(
        ...,
        description="A short, informative title for the DIY project (e.g., 'LED Filament Bulb Panel'). Maximum 5 words.",
    )
    visual_anchor: str
    steps: List[Step]


class Instruction(BaseModel):
    id: Optional[str] = None
    source_url: str
    project: Project
