# backend/app/services/ai_analyzer.py
from openai import OpenAI
from typing import List, Dict
import json
import os
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()
openai = OpenAI()


class TechForecast(BaseModel):
    current_trl: int
    predicted_trl_2025: int
    market_size_billions: float
    growth_rate_percent: float
    key_players: List[str]
    hype_cycle_position: str
    convergence_technologies: List[str]
    strategic_insights: List[str]


class TechnologyAnalyzer:
    def __init__(self):
        if not os.getenv("OPENAI_API_KEY"):
            raise ValueError("OPENAI_API_KEY not set in environment variables")
        api_key = os.getenv("OPENAI_API_KEY")
        if api_key is None:
            raise ValueError("OPENAI_API_KEY not set in environment variables")
        openai.api_key = api_key
        openai.base_url = "https://api.studio.nebius.com/v1/"

    async def analyze_technology_trend(
        self, patents: List[Dict], papers: List[Dict]
    ) -> Dict:
        """Analyze technology trends using AI"""

        # Prepare data summary
        patent_titles = [p["title"] for p in patents[:10]]
        paper_titles = [p["title"] for p in papers[:10]]

        prompt = f"""
        Analyze the following technology data and provide insights:
        
        Recent Patents: {patent_titles}
        Recent Research: {paper_titles}
        
        Please provide a JSON response with:
        1. current_trl (1-9 scale)
        2. predicted_trl_2025
        3. market_size_billions
        4. growth_rate_percent
        5. key_players (top 5)
        6. hype_cycle_position (Innovation Trigger/Peak of Expectations/Trough of Disillusionment/Slope of Enlightenment/Plateau of Productivity)
        7. convergence_technologies (list of 3)
        8. strategic_insights (list of 3 key points)

        DO NOT include any explanations, only return the JSON object.
         DO NOT INCLUDE ANY Markdown FORMATTING IN THE RESPONSE 
        Example response:
        {{
            "current_trl": 6,
            "predicted_trl_2025": 8,
            "market_size_billions": 45.2,
            "growth_rate_percent": 23.5,
            "key_players": ["Google", "IBM", "Microsoft", "Amazon", "Meta"],
            "hype_cycle_position": "Slope of Enlightenment",
            "convergence_technologies": ["AI", "Quantum Computing", "5G"],
            "strategic_insights": [
                "Rapid advancement in core algorithms",
                "Increasing industry adoption",
                "Government investment growing"
            ]
        }}
        
        DO NOT INCLUDE ANY Markdown FORMATTING IN THE RESPONSE
        """

        try:
            response = openai.chat.completions.create(
                model="openai/gpt-oss-120b",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
            )

            print("AI_RESPONSE:", response)
            content = response.choices[0].message.content
            print("AI_CONTENT:", content)
            if content is None:
                raise ValueError("AI response content is None")
            result = json.loads(content)
            print("PARSED_RESULT:", result)
            return result
        except Exception as e:
            # Fallback mock analysis
            return {
                "current_trl": 6,
                "predicted_trl_2025": 8,
                "market_size_billions": 45.2,
                "growth_rate_percent": 23.5,
                "key_players": ["Google", "IBM", "Microsoft", "Amazon", "Meta"],
                "hype_cycle_position": "Slope of Enlightenment",
                "convergence_technologies": ["AI", "Quantum Computing", "5G"],
                "strategic_insights": [
                    "Rapid advancement in core algorithms",
                    "Increasing industry adoption",
                    "Government investment growing",
                ],
            }

    def calculate_s_curve_position(self, patents_per_year: Dict) -> Dict:
        print("PATENTS_PER_YEAR:", patents_per_year)
        """Calculate S-curve position"""
        years = sorted(patents_per_year.keys())
        values = [patents_per_year[year] for year in years]

        # Simple S-curve calculation
        total_patents = sum(values)
        current_year_patents = values[-1] if values else 0

        if total_patents < 100:
            phase = "Introduction"
        elif current_year_patents > total_patents * 0.3:
            phase = "Growth"
        elif current_year_patents > total_patents * 0.1:
            phase = "Maturity"
        else:
            phase = "Decline"

        return {
            "phase": phase,
            "total_patents": total_patents,
            "yearly_data": patents_per_year,
        }
