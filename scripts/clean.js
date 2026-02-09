import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const destPath = path.resolve(__dirname, '../dist');

if (fs.existsSync(destPath)) {
    fs.rmSync(destPath, { recursive: true, force: true });
}

