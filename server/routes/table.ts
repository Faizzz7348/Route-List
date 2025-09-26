import { Router } from "express";
import { z } from "zod";
import { insertTableRowSchema, insertTableColumnSchema } from "@shared/schema.js";
import { storage } from "../lib/storage.js";

export const tableRouter = Router();

// Validation schemas
const reorderSchema = z.object({
  ids: z.array(z.string()),
});

// Row endpoints
tableRouter.get("/rows", async (req, res, next) => {
  try {
    const rows = await storage.getAllRows();
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

tableRouter.get("/rows/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const row = await storage.getRowById(id);
    
    if (!row) {
      return res.status(404).json({ error: "Row not found" });
    }
    
    res.json(row);
  } catch (error) {
    next(error);
  }
});

tableRouter.post("/rows", async (req, res, next) => {
  try {
    const validatedData = insertTableRowSchema.parse(req.body);
    const row = await storage.createRow(validatedData);
    res.status(201).json(row);
  } catch (error) {
    next(error);
  }
});

tableRouter.put("/rows/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = insertTableRowSchema.partial().parse(req.body);
    const row = await storage.updateRow(id, validatedData);
    
    if (!row) {
      return res.status(404).json({ error: "Row not found" });
    }
    
    res.json(row);
  } catch (error) {
    next(error);
  }
});

tableRouter.delete("/rows/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await storage.deleteRow(id);
    
    if (!deleted) {
      return res.status(404).json({ error: "Row not found" });
    }
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

tableRouter.post("/rows/reorder", async (req, res, next) => {
  try {
    const { ids } = reorderSchema.parse(req.body);
    await storage.reorderRows(ids);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Column endpoints
tableRouter.get("/columns", async (req, res, next) => {
  try {
    const columns = await storage.getAllColumns();
    res.json(columns);
  } catch (error) {
    next(error);
  }
});

tableRouter.get("/columns/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const column = await storage.getColumnById(id);
    
    if (!column) {
      return res.status(404).json({ error: "Column not found" });
    }
    
    res.json(column);
  } catch (error) {
    next(error);
  }
});

tableRouter.post("/columns", async (req, res, next) => {
  try {
    const validatedData = insertTableColumnSchema.parse(req.body);
    const column = await storage.createColumn(validatedData);
    res.status(201).json(column);
  } catch (error) {
    next(error);
  }
});

tableRouter.put("/columns/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = insertTableColumnSchema.partial().parse(req.body);
    const column = await storage.updateColumn(id, validatedData);
    
    if (!column) {
      return res.status(404).json({ error: "Column not found" });
    }
    
    res.json(column);
  } catch (error) {
    next(error);
  }
});

tableRouter.delete("/columns/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await storage.deleteColumn(id);
    
    if (!deleted) {
      return res.status(404).json({ error: "Column not found" });
    }
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

tableRouter.post("/columns/reorder", async (req, res, next) => {
  try {
    const { ids } = reorderSchema.parse(req.body);
    await storage.reorderColumns(ids);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Statistics endpoint
tableRouter.get("/stats", async (req, res, next) => {
  try {
    const rows = await storage.getAllRows();
    const columns = await storage.getAllColumns();
    
    const stats = {
      totalRows: rows.length,
      totalColumns: columns.length,
      lastUpdated: new Date().toISOString(),
    };
    
    res.json(stats);
  } catch (error) {
    next(error);
  }
});