const fs = require('fs');
const path = require('path');

// Route template with dynamic controller name
const routeTemplate = (routeName, controllerName) => {
    return `import express from 'express';
import ${controllerName} from '../controllers/${controllerName}';

const router = express.Router();

// Define route handlers
router.get('/index', ${controllerName}.index);
router.get('/show/:id', ${controllerName}.show);
router.post('/create', ${controllerName}.create);
router.put('/update/:id', ${controllerName}.update);
router.delete('/delte/:id', ${controllerName}.delete);

export default router;
  `;
};

// Function to create the route file inside the specified folder
const createRouteFile = (folder, routeName, controllerName) => {
    // Resolve paths to the root src folder
    const folderPath = folder ? path.resolve(__dirname, '..', 'src', 'routes', folder) : path.resolve(__dirname, '..', 'src', 'routes');

    // Create the folder if it doesn't exist
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    // Define the full path for the new route file
    const routePath = path.join(folderPath, `${routeName}.ts`);

    // Write the route file with the template
    fs.writeFileSync(routePath, routeTemplate(routeName, controllerName), 'utf8');
    console.log(`${routeName} route created successfully at ${routePath}`);
};

// Manually parse the arguments
const args = process.argv.slice(2);

// Validate arguments
const routeName = args[0];  // The first argument is the route name
const controllerFlagIndex = args.indexOf('-c');  // Find the controller argument
const controllerName = controllerFlagIndex !== -1 ? args[controllerFlagIndex + 1] : null;  // Get the controller name if it exists
const folderFlagIndex = args.indexOf('-f');  // Find the folder argument
const folderName = folderFlagIndex !== -1 ? args[folderFlagIndex + 1] : null;  // Get the folder name if it exists

// Validate that both route name and controller name are provided
if (!routeName) {
    console.log('Please provide a route name!');
    process.exit(1);
}

if (!controllerName) {
    console.log('Please provide a controller name using: -c <ControllerName>');
    process.exit(1);
}

// Call the function to create the route file
createRouteFile(folderName, routeName, controllerName);
