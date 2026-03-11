import dotenv from "dotenv";
dotenv.config();


import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env FIRST
dotenv.config({ path: path.join(__dirname, ".env") });

// Then load the app
import("./server.js")
    


