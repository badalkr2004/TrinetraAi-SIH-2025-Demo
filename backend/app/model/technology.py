# backend/app/models/technology.py
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class Patent(BaseModel):
    id: str
    title: str
    abstract: str
    inventors: List[str]
    assignee: str
    filing_date: datetime
    publication_date: datetime
    classification: List[str]
    country: str


class ResearchPaper(BaseModel):
    id: str
    title: str
    abstract: str
    authors: List[str]
    journal: str
    publication_date: datetime
    keywords: List[str]
    citations: int


class TechnologyIntelligence(BaseModel):
    technology_name: str
    current_trl: int
    predicted_trl: int
    market_size: float
    growth_rate: float
    key_players: List[str]
    convergence_technologies: List[str]
    hype_cycle_position: str
    last_updated: datetime
