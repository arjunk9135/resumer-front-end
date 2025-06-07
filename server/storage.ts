import { users, type User, type InsertUser, analyses, type Analysis, type InsertAnalysis, candidates, type Candidate, type InsertCandidate, notifications, type Notification, type InsertNotification } from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  sessionStore: session.SessionStore;

  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Analysis methods
  createAnalysis(analysis: InsertAnalysis & { createdById: number }): Promise<Analysis>;
  getAnalysis(id: number): Promise<Analysis | undefined>;
  getAnalysesByUser(userId: number): Promise<Analysis[]>;
  updateAnalysisStatus(id: number, status: string): Promise<Analysis | undefined>;
  updateAnalysisResults(id: number, averageScore: number): Promise<Analysis | undefined>;

  // Candidate methods
  createCandidate(candidate: InsertCandidate): Promise<Candidate>;
  getCandidatesByAnalysis(analysisId: number): Promise<Candidate[]>;
  
  // Notification methods
  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotificationsByUser(userId: number): Promise<Notification[]>;
  markNotificationAsRead(id: number): Promise<Notification | undefined>;
  markAllNotificationsAsRead(userId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private analyses: Map<number, Analysis>;
  private candidates: Map<number, Candidate>;
  private notifications: Map<number, Notification>;
  currentUserId: number;
  currentAnalysisId: number;
  currentCandidateId: number;
  currentNotificationId: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.analyses = new Map();
    this.candidates = new Map();
    this.notifications = new Map();
    this.currentUserId = 1;
    this.currentAnalysisId = 1;
    this.currentCandidateId = 1;
    this.currentNotificationId = 1;

    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, role: "user" };
    this.users.set(id, user);
    return user;
  }

  // Analysis methods
  async createAnalysis(analysis: InsertAnalysis & { createdById: number }): Promise<Analysis> {
    const id = this.currentAnalysisId++;
    const now = new Date();
    const newAnalysis: Analysis = {
      ...analysis,
      id,
      status: "queued",
      candidateCount: 0,
      averageScore: null,
      createdAt: now,
    };
    this.analyses.set(id, newAnalysis);
    return newAnalysis;
  }

  async getAnalysis(id: number): Promise<Analysis | undefined> {
    return this.analyses.get(id);
  }

  async getAnalysesByUser(userId: number): Promise<Analysis[]> {
    return Array.from(this.analyses.values())
      .filter(analysis => analysis.createdById === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updateAnalysisStatus(id: number, status: string): Promise<Analysis | undefined> {
    const analysis = this.analyses.get(id);
    if (!analysis) return undefined;
    
    const updatedAnalysis: Analysis = {
      ...analysis,
      status,
    };
    this.analyses.set(id, updatedAnalysis);
    return updatedAnalysis;
  }

  async updateAnalysisResults(id: number, averageScore: number): Promise<Analysis | undefined> {
    const analysis = this.analyses.get(id);
    if (!analysis) return undefined;
    
    const updatedAnalysis: Analysis = {
      ...analysis,
      status: "completed",
      averageScore,
    };
    this.analyses.set(id, updatedAnalysis);
    return updatedAnalysis;
  }

  // Candidate methods
  async createCandidate(candidate: InsertCandidate): Promise<Candidate> {
    const id = this.currentCandidateId++;
    const now = new Date();
    const newCandidate: Candidate = {
      ...candidate,
      id,
      createdAt: now,
    };
    this.candidates.set(id, newCandidate);
    
    // Update candidate count in the analysis
    const analysis = this.analyses.get(candidate.analysisId);
    if (analysis) {
      analysis.candidateCount += 1;
      this.analyses.set(analysis.id, analysis);
    }
    
    return newCandidate;
  }

  async getCandidatesByAnalysis(analysisId: number): Promise<Candidate[]> {
    return Array.from(this.candidates.values())
      .filter(candidate => candidate.analysisId === analysisId)
      .sort((a, b) => (b.matchScore - a.matchScore));
  }
  
  // Notification methods
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const id = this.currentNotificationId++;
    const now = new Date();
    const newNotification: Notification = {
      ...notification,
      id,
      isRead: false,
      createdAt: now,
    };
    this.notifications.set(id, newNotification);
    return newNotification;
  }

  async getNotificationsByUser(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (!notification) return undefined;
    
    const updatedNotification: Notification = {
      ...notification,
      isRead: true,
    };
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }

  async markAllNotificationsAsRead(userId: number): Promise<void> {
    const userNotifications = Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId);
    
    for (const notification of userNotifications) {
      notification.isRead = true;
      this.notifications.set(notification.id, notification);
    }
  }
}

export const storage = new MemStorage();
