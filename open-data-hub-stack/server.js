import bcrypt from "bcryptjs";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function requireAuth(request, response, next) {
  const token = request.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return response.status(401).json({ message: "Missing token" });
  }

  try {
    request.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return response.status(401).json({ message: "Invalid token" });
  }
}

function requireAdmin(request, response, next) {
  if (request.user?.role !== "admin") {
    return response.status(403).json({ message: "Admin access required" });
  }

  return next();
}

app.post("/api/auth/register", async (request, response) => {
  const { name, email, password, role = "user" } = request.body;
  const passwordHash = await bcrypt.hash(password, 10);

  await pool.execute(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
    [name, email, passwordHash, role]
  );

  response.status(201).json({ message: "User registered" });
});

app.post("/api/auth/login", async (request, response) => {
  const { email, password } = request.body;
  const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
  const user = rows[0];

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return response.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return response.json({ token, role: user.role });
});

app.get("/api/datasets", async (request, response) => {
  const { q = "", domain = "", format = "", year = "", state = "" } = request.query;
  const filters = [];
  const values = [];

  if (q) {
    filters.push("(name LIKE ? OR description LIKE ? OR source LIKE ?)");
    values.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }

  for (const [field, value] of Object.entries({ domain, format, year, state })) {
    if (value) {
      filters.push(`${field} = ?`);
      values.push(value);
    }
  }

  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const [datasets] = await pool.execute(
    `SELECT datasets.*, COUNT(downloads.id) AS downloads
     FROM datasets
     LEFT JOIN downloads ON downloads.dataset_id = datasets.id
     ${where}
     GROUP BY datasets.id
     ORDER BY datasets.created_at DESC`,
    values
  );

  response.json(datasets);
});

app.get("/api/datasets/:id", async (request, response) => {
  const [rows] = await pool.execute("SELECT * FROM datasets WHERE id = ?", [request.params.id]);

  if (!rows[0]) {
    return response.status(404).json({ message: "Dataset not found" });
  }

  return response.json({
    ...rows[0],
    preview: [
      { state: "Delhi", indicator: "AQI", value: "214", source: "CPCB" },
      { state: "Mumbai", indicator: "PM2.5", value: "86", source: "CPCB" },
      { state: "Bengaluru", indicator: "Schools", value: "5,840", source: "State Portal" }
    ]
  });
});

app.post("/api/datasets", requireAuth, requireAdmin, async (request, response) => {
  const { name, description, domain, format, year, state, source, fileSize, downloadUrl } = request.body;

  const [result] = await pool.execute(
    `INSERT INTO datasets
      (name, description, domain, format, year, state, source, file_size, download_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, description, domain, format, year, state, source, fileSize, downloadUrl]
  );

  response.status(201).json({ id: result.insertId });
});

app.put("/api/datasets/:id", requireAuth, requireAdmin, async (request, response) => {
  const { name, description, domain, format, year, state, source, fileSize, downloadUrl } = request.body;

  await pool.execute(
    `UPDATE datasets
     SET name = ?, description = ?, domain = ?, format = ?, year = ?, state = ?, source = ?, file_size = ?, download_url = ?
     WHERE id = ?`,
    [name, description, domain, format, year, state, source, fileSize, downloadUrl, request.params.id]
  );

  response.json({ message: "Dataset updated" });
});

app.delete("/api/datasets/:id", requireAuth, requireAdmin, async (request, response) => {
  await pool.execute("DELETE FROM datasets WHERE id = ?", [request.params.id]);
  response.json({ message: "Dataset deleted" });
});

app.post("/api/datasets/:id/download", async (request, response) => {
  await pool.execute("INSERT INTO downloads (dataset_id) VALUES (?)", [request.params.id]);
  const [rows] = await pool.execute("SELECT download_url FROM datasets WHERE id = ?", [request.params.id]);
  response.json({ downloadUrl: rows[0]?.download_url || "#" });
});

app.get("/api/stats", async (request, response) => {
  const [[datasetStats]] = await pool.execute("SELECT COUNT(*) AS datasets FROM datasets");
  const [[downloadStats]] = await pool.execute("SELECT COUNT(*) AS downloads FROM downloads");
  const [domains] = await pool.execute(
    `SELECT domain, COUNT(*) AS total
     FROM datasets
     GROUP BY domain
     ORDER BY total DESC`
  );

  response.json({
    datasets: datasetStats.datasets,
    downloads: downloadStats.downloads,
    domains
  });
});

app.listen(port, () => {
  console.log(`Unified Open Data Hub running at http://localhost:${port}`);
});

