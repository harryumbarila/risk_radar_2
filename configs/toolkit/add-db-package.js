const path = require('path');
const fs = require('fs');

// Get the package name from the command line argument
const newPackageName = process.argv[2]; // The package name passed as a command-line argument
if (!newPackageName) {
  throw new Error('Package name must be provided as a command-line argument');
}

const templateFolder = path.resolve(__dirname, '../../templates/db'); // Correct path for template folder
const destinationFolder = path.resolve(__dirname, `../../db/${newPackageName}`); // Correct path for destination folder
const dbPackageName = `@denali/${newPackageName}-db`;

// 1. Copy the folder template
function copyFolderTemplate(src, dest) {
  const srcDir = path.resolve(__dirname, src);
  const destDir = path.resolve(__dirname, dest);

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  fs.readdirSync(srcDir).forEach((file) => {
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);
    if (fs.statSync(srcFile).isDirectory()) {
      copyFolderTemplate(srcFile, destFile);
    } else {
      fs.copyFileSync(srcFile, destFile);
    }
  });
}

// Copy the template folder
copyFolderTemplate(templateFolder, destinationFolder);

// 2. Update the name in relevant files
function updateFile(filePath, regex, replacement) {
  if (!fs.existsSync(filePath)) {
    console.warn(`File does not exist: ${filePath}`);
    return;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');

  const updatedContent = fileContent.replace(regex, replacement);
  fs.writeFileSync(filePath, updatedContent, 'utf-8');
}

// Update the package name in the copied package's files
updateFile(
  path.join(destinationFolder, 'package.json'),
  /"name": ".*"/,
  `"name": "${dbPackageName}"`
);
updateFile(
  path.join(destinationFolder, 'package.json'),
  /"db:fixtures": ".*?@denali\/.*?-db"/,
  `"db:fixtures": "fixtures-ts-node-commonjs --dataSource=./src/connection/cli-data-source.ts load ./fixtures --sync --require=@denali/${newPackageName}-db"`
);

// 3. Update "connections/con.ts" to change name
// 3. Update "connections/con.ts" to change name
const conFilePath = path.resolve(
  __dirname,
  '../../db',
  newPackageName,
  'src/connection/nestjs-module.ts'
);
updateFile(conFilePath, /name:\s*'[^']*',/, `name: '${newPackageName}',`);

// 4. Add the new package to "apps/api/package.json"
const apiPackageJsonPath = path.resolve(
  __dirname,
  '../../apps/api/package.json'
);
const apiPackageJson = JSON.parse(fs.readFileSync(apiPackageJsonPath, 'utf-8'));
if (!apiPackageJson.dependencies) {
  apiPackageJson.dependencies = {};
}
apiPackageJson.dependencies = {
  [dbPackageName]: `*`,
  ...apiPackageJson.dependencies,
};
fs.writeFileSync(
  apiPackageJsonPath,
  JSON.stringify(apiPackageJson, null, 2),
  'utf-8'
);

// 5. Update "tsconfig.json" with the new path
const tsconfigPath = path.resolve(__dirname, '../../apps/api/tsconfig.json');
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
const paths = tsconfig.compilerOptions.paths || {};
paths[`@/${newPackageName}/*`] = [`../../db/${newPackageName}/src/*`];
tsconfig.compilerOptions.paths = paths;
fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2), 'utf-8');

// 6. Add an import to "app.module.ts"
// const appModulePath = path.resolve(__dirname, 'apps/api/src/app.module.ts');
// if (fs.existsSync(appModulePath)) {
//   const appModuleContent = fs.readFileSync(appModulePath, 'utf-8');
//   const importStatement = `import { ${newPackageName}Module } from '${dbPackageName}';\n`;

//   // Add the import statement at the beginning of the file before the first export
//   const updatedAppModuleContent = appModuleContent.replace(
//     /import .*;[\s\S]*export class AppModule {/,
//     (match) => `${match}\n${importStatement}`
//   );
//   fs.writeFileSync(appModulePath, updatedAppModuleContent, 'utf-8');
// } else {
//   console.warn('File "app.module.ts" not found. Skipping import update.');
// }

console.log(`Successfully added '${newPackageName}' DB package`);

module.exports = null;
