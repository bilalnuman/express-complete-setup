const fs = require('fs');
const path = require('path');

// Controller template
const controllerTemplate = (name) => {
  return `
import { Request, Response } from 'express';

class ${name} {
  public async index(req: Request, res: Response): Promise<Response> {
    return res.json({ message: '${name} index' });
  }

  public async show(req: Request, res: Response): Promise<Response> {
    return res.json({ message: '${name} show' });
  }

  public async create(req: Request, res: Response): Promise<Response> {
    return res.json({ message: '${name} create' });
  }

  public async update(req: Request, res: Response): Promise<Response> {
    return res.json({ message: '${name}  update' });
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    return res.json({ message: '${name} delete' });
  }
}

export default new ${name}();
  `;
};

// Function to create the controller file inside the specified folder
const createControllerFile = (folder, controllerName) => {
  // Resolve paths to the root src folder
  const folderPath = folder ? path.resolve(__dirname, '..', 'src', 'controllers', folder) : path.resolve(__dirname, '..', 'src', 'controllers');

  // Create the folder if it doesn't exist
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  // Define the full path for the new controller file
  const controllerPath = path.join(folderPath, `${controllerName}.ts`);

  // Write the controller file with the template
  fs.writeFileSync(controllerPath, controllerTemplate(controllerName), 'utf8');
  console.log(`${controllerName} created successfully at ${controllerPath}`);
};

// Capture command-line arguments
const args = process.argv.slice(2);

// Default to the 'controllers' folder if no folder is provided
const folderName = args.length > 1 ? args[0] : null;
const controllerName = args[folderName ? 1 : 0];  // If folder is provided, second arg is the controller name

// Validate that the controller name is provided
if (controllerName) {
  createControllerFile(folderName, controllerName);
} else {
  console.log('Please provide a controller name, e.g., npm run c RoleController');
}
