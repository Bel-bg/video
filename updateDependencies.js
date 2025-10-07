// updateDependencies.js
// This script updates dependencies

const { exec } = require("child_process");
const { promisify } = require("util");
const fs = require("fs");

const execAsync = promisify(exec);

async function updateDependencies() {
  console.log("IG-Live Dependency Update");
  console.log("========================");

  try {
    // 1. Check current versions
    console.log("\n1. Checking current dependencies...");
    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

    console.log("Current dependencies:");
    Object.entries(packageJson.dependencies || {}).forEach(
      ([name, version]) => {
        console.log(`  ${name}: ${version}`);
      }
    );

    console.log("\nCurrent devDependencies:");
    Object.entries(packageJson.devDependencies || {}).forEach(
      ([name, version]) => {
        console.log(`  ${name}: ${version}`);
      }
    );

    // 2. Check for outdated dependencies
    console.log("\n2. Checking for outdated dependencies...");
    try {
      const { stdout: outdatedStdout } = await execAsync("npm outdated", {
        timeout: 60000, // 1 minute timeout
      });

      if (outdatedStdout) {
        console.log("Outdated dependencies:");
        console.log(outdatedStdout);
      } else {
        console.log("✅ All dependencies are up to date");
      }
    } catch (error) {
      console.log("⚠️  No outdated dependencies found or npm outdated failed");
    }

    // 3. Update dependencies
    console.log("\n3. Updating dependencies...");
    const { stdout: updateStdout, stderr: updateStderr } = await execAsync(
      "npm update",
      {
        timeout: 300000, // 5 minute timeout
      }
    );

    if (updateStdout) {
      console.log(updateStdout);
    }

    if (updateStderr) {
      console.error("STDERR:", updateStderr);
    }

    // 4. Audit for security vulnerabilities
    console.log("\n4. Auditing for security vulnerabilities...");
    try {
      const { stdout: auditStdout } = await execAsync("npm audit", {
        timeout: 60000, // 1 minute timeout
      });

      console.log(auditStdout);
    } catch (error) {
      if (error.message.includes("found 0 vulnerabilities")) {
        console.log("✅ No security vulnerabilities found");
      } else {
        console.log("⚠️  Security audit completed with findings");
        console.log(error.message);
      }
    }

    // 5. Run tests to ensure everything still works
    console.log("\n5. Running tests to verify update...");
    try {
      const { stdout: testStdout, stderr: testStderr } = await execAsync(
        "npm test",
        {
          timeout: 120000, // 2 minute timeout
        }
      );

      if (testStdout) {
        console.log(testStdout);
      }

      if (testStderr) {
        console.error("STDERR:", testStderr);
      }

      console.log("✅ Tests passed after update");
    } catch (error) {
      console.log("⚠️  Tests failed after update. Please check manually.");
    }

    console.log("\n🎉 Dependency update completed!");
  } catch (error) {
    console.error("❌ Dependency update failed:", error.message);
  }
}

// Run update if this script is executed directly
if (require.main === module) {
  updateDependencies();
}

module.exports = { updateDependencies };
