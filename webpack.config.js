import path from "path";

import { fileURLToPath } from 'url';
import {dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {
  entry: './lib/all.js',
  output: {
    library: "WebGLBasicLib"
  },
};

export default config;
