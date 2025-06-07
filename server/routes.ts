import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAnalysisSchema, insertCandidateSchema, insertNotificationSchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);

  // Analyses routes
  app.post("/api/analyses", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const validatedData = insertAnalysisSchema.parse(req.body);
      const analysis = await storage.createAnalysis({
        ...validatedData,
        createdById: req.user.id,
      });
      
      res.status(201).json(analysis);
    } catch (error:any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/analyses", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const analyses = await storage.getAnalysesByUser(req.user.id);
      res.json(analyses);
    } catch (error:any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/analyses/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const analysisId = parseInt(req.params.id);
      const analysis = await storage.getAnalysis(analysisId);
      
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }
      
      if (analysis.createdById !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/analyses/:id/status", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const analysisId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!["queued", "processing", "completed", "failed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const analysis = await storage.getAnalysis(analysisId);
      
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }
      
      if (analysis.createdById !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const updatedAnalysis = await storage.updateAnalysisStatus(analysisId, status);
      
      res.json(updatedAnalysis);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Candidates routes
  app.post("/api/candidates", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const validatedData = insertCandidateSchema.parse(req.body);
      
      // Verify the user has access to the analysis
      const analysis = await storage.getAnalysis(validatedData.analysisId);
      
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }
      
      if (analysis.createdById !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const candidate = await storage.createCandidate(validatedData);
      
      res.status(201).json(candidate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/analyses/:id/candidates", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const analysisId = parseInt(req.params.id);
      
      // Verify the user has access to the analysis
      const analysis = await storage.getAnalysis(analysisId);
      
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }
      
      if (analysis.createdById !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const candidates = await storage.getCandidatesByAnalysis(analysisId);
      
      res.json(candidates);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Notifications routes
  app.get("/api/notifications", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const notifications = await storage.getNotificationsByUser(req.user.id);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const validatedData = insertNotificationSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const notification = await storage.createNotification(validatedData);
      
      res.status(201).json(notification);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const notificationId = parseInt(req.params.id);
      const updatedNotification = await storage.markNotificationAsRead(notificationId);
      
      if (!updatedNotification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      
      res.json(updatedNotification);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/notifications/read-all", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      await storage.markAllNotificationsAsRead(req.user.id);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Mock endpoint for simulating resume analysis completion
  app.post("/api/simulate-analysis-complete", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const { analysisId } = req.body;
      
      if (!analysisId) {
        return res.status(400).json({ message: "Analysis ID is required" });
      }
      
      const analysis = await storage.getAnalysis(parseInt(analysisId));
      
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }
      
      if (analysis.createdById !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      // Update the analysis status
      const updatedAnalysis = await storage.updateAnalysisResults(parseInt(analysisId), 78);
      
      // Create a notification
      await storage.createNotification({
        userId: req.user.id,
        title: "Analysis Completed",
        message: `Your analysis "${analysis.name}" has been completed.`,
        type: "success",
        relatedId: analysis.id,
        relatedType: "analysis"
      });
      
      res.json({ success: true, analysis: updatedAnalysis });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
