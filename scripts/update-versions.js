#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const version = process.argv[2];

if (!version) {
  console.error("Error: Version argument is required");
  process.exit(1);
}

const subPackages = ["api", "admin", "my-mood"];

function updatePackageVersion(packagePath, newVersion) {
  const packageJsonPath = path.join(__dirname, "..", packagePath, "package.json");
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    packageJson.version = newVersion;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");
    console.log(`Updated ${packagePath}/package.json to version ${newVersion}`);
  } catch (error) {
    console.error(`Error updating ${packagePath}/package.json:`, error.message);
    process.exit(1);
  }
}

console.log(`Updating sub-packages to version ${version}...`);

subPackages.forEach((pkg) => {
  updatePackageVersion(pkg, version);
});

console.log("All sub-packages updated successfully!");
