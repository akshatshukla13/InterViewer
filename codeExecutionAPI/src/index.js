import express from 'express';
import dotenv from 'dotenv';
import Router from './routes/routes.index.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.static(path.resolve(__dirname, '../public')));

app.use(express.json());
app.use('/', Router);

app.listen(PORT, () => {
console.log(`Server started:
Home: http://localhost:${PORT}/
API: http://localhost:${PORT}/api`);
});
