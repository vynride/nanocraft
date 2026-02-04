from typing import List

from pydantic import BaseModel


class Step(BaseModel):
    step_number: int
    scene_description: str
    alt_text: str


class Project(BaseModel):
    project_summary: str
    visual_anchor: str
    steps: List[Step]


class Instruction(BaseModel):
    source_url: str
    project: Project
