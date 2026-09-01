import fs from 'fs';
import path from 'path';
import YAML from 'yaml';

const swaggerPath = path.join(process.cwd(), 'src', 'docs', 'swagger.yml');

const swaggerFile = fs.readFileSync(swaggerPath, 'utf8');

const swaggerSpec = YAML.parse(swaggerFile);

export default swaggerSpec;
