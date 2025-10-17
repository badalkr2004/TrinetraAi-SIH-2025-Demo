# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from upstash_redis import Redis
from app.services.data_collector import PatentCollector, ResearchCollector
from app.services.ai_analyzer import TechnologyAnalyzer
import asyncio
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="TechnoIntel AI API", version="1.0.0", debug=True)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connections
mongodb_client = MongoClient(os.getenv("MONGODB_URL"))
db = mongodb_client.trinetraai_db

redis_client = Redis(
    url=os.getenv("UPSTASH_REDIS_URL"),
    token=os.getenv("UPSTASH_REDIS_TOKEN"),
)
print(redis_client.ping())

# Initialize services
patent_collector = PatentCollector()
research_collector = ResearchCollector()
ai_analyzer = TechnologyAnalyzer()


@app.get("/")
async def root():
    return {"message": "TechnoIntel AI API is running!"}


@app.post("/api/analyze-technology")
async def analyze_technology(request: dict):
    try:
        technology_name = request.get("technology_name", "")
        print(technology_name)

        # Check cache first
        cache_key = f"analysis:{technology_name}"
        print("CACHE_KEY:", cache_key)
        cached_result = redis_client.get(cache_key)
        print("CACHED_RESULT:", cached_result)

        if cached_result:
            return {"status": "success", "data": eval(cached_result)}

        # Collect data
        patents = await patent_collector.search_patents(technology_name, 100)

        papers = await research_collector.search_papers(technology_name, 50)

        # AI Analysis
        analysis = await ai_analyzer.analyze_technology_trend(patents, papers)
        print("ANALYSIS:", analysis)

        # Calculate S-curve
        patents_per_year = {}
        for patent in patents:
            year = str(patent["filing_date"].year)
            patents_per_year[year] = patents_per_year.get(year, 0) + 1

        s_curve = ai_analyzer.calculate_s_curve_position(patents_per_year)

        # Combine results
        result = {
            "technology_name": technology_name,
            "analysis": analysis,
            "s_curve": s_curve,
            "patents_count": len(patents),
            "papers_count": len(papers),
            "last_updated": datetime.now().isoformat(),
        }

        print("FINAL_RESULT:", result)

        # Cache result for 1 hour
        redis_client.setex(cache_key, 3600, str(result))

        # Store in MongoDB
        inserted = db.analyses.insert_one(result)
        print("MONGODB_INSERTED_ID:", inserted)

        # Convert ObjectId to string for response
        result["_id"] = str(inserted.inserted_id)

        return {"status": "success", "data": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/technologies")
async def get_technologies():
    """Get list of analyzed technologies"""
    try:
        technologies = list(
            db.analyses.find({}, {"technology_name": 1, "last_updated": 1})
            .sort("last_updated", -1)
            .limit(10)
        )
        for tech in technologies:
            tech["_id"] = str(tech["_id"])
        return {"status": "success", "data": technologies}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/dashboard-stats")
async def get_dashboard_stats():
    """Get dashboard statistics"""
    try:
        stats = {
            "total_technologies": db.analyses.count_documents({}),
            "total_patents": 15420,  # Mock data
            "total_papers": 8765,  # Mock data
            "active_alerts": 23,  # Mock data
            "trending_technologies": [
                {"name": "Quantum Computing", "growth": 45.2},
                {"name": "AI/ML", "growth": 38.7},
                {"name": "5G Networks", "growth": 29.3},
                {"name": "Blockchain", "growth": 22.1},
                {"name": "IoT", "growth": 18.9},
            ],
        }
        return {"status": "success", "data": stats}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))  # Use Render's port if available
    uvicorn.run(app, host="0.0.0.0", port=port)
