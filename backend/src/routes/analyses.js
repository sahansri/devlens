
import { Router } from "express";
import { pool } from "../db.js";
import { analyzeCode } from "../services/analyzer.js";

const router = Router();

router.post("/analyze", async (req, res, next) => {
  try {
    const { source, filename = "untitled.js" } = req.body ?? {};

    if (typeof source !== "string" || !source.trim()) {
      return res.status(400).json({
        error: "Provide non-empty source code."
      });
    }

    const result = analyzeCode(source);

    const saved = await pool.query(
      `INSERT INTO analyses
       (filename, source_code, total_lines, total_issues, findings)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, filename, total_lines, total_issues,
                 findings, created_at`,
      [
        String(filename).slice(0, 255),
        source,
        result.totalLines,
        result.totalIssues,
        JSON.stringify(result.findings)
      ]
    );

    res.status(201).json(saved.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.get("/analyses", async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, filename, total_lines, total_issues,
              findings, created_at
       FROM analyses
       ORDER BY created_at DESC
       LIMIT 50`
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

export default router;
