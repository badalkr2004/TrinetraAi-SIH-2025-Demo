// src/services/api.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface TechnologyAnalysis {
  technology_name: string;
  analysis: {
    current_trl: number;
    predicted_trl_2025: number;
    market_size_billions: number;
    growth_rate_percent: number;
    key_players: string[];
    hype_cycle_position: string;
    convergence_technologies: string[];
    strategic_insights: string[];
  };
  s_curve: {
    phase: string;
    total_patents: number;
    yearly_data: Record<string, number>;
  };
  patents_count: number;
  papers_count: number;
  last_updated: string;
}

export interface DashboardStats {
  total_technologies: number;
  total_patents: number;
  total_papers: number;
  active_alerts: number;
  trending_technologies: Array<{
    name: string;
    growth: number;
  }>;
}

export const apiService = {
  async analyzeTechnology(technologyName: string): Promise<TechnologyAnalysis> {
    const response = await api.post("/api/analyze-technology", {
      technology_name: technologyName,
    });
    return response.data.data;
  },

  async getTechnologies(): Promise<
    Array<{ technology_name: string; last_updated: string }>
  > {
    const response = await api.get("/api/technologies");
    return response.data.data;
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get("/api/dashboard-stats");
    return response.data.data;
  },
};
