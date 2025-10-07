// setupDevEnv.js
// This script helps set up the development environment

const fs = require("fs");
const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

async function setupDevEnvironment() {
  console.log("IG-Live Development Environment Setup");
  console.log("====================================");

  try {
    // 1. Check Node.js version
    console.log("\n1. Checking Node.js version...");
    const { stdout: nodeVersion } = await execAsync("node --version");
    console.log(`  Node.js version: ${nodeVersion.trim()}`);

    // 2. Check npm version
    console.log("\n2. Checking npm version...");
    const { stdout: npmVersion } = await execAsync("npm --version");
    console.log(`  npm version: ${npmVersion.trim()}`);

    // 3. Install dependencies
    console.log("\n3. Installing dependencies...");
    const { stdout: installStdout, stderr: installStderr } = await execAsync(
      "npm install",
      {
        timeout: 300000, // 5 minute timeout
      }
    );

    if (installStdout) {
      console.log(installStdout);
    }

    if (installStderr) {
      console.error("STDERR:", installStderr);
    }

    console.log("  ✅ Dependencies installed successfully");

    // 4. Check if .env file exists
    console.log("\n4. Checking environment configuration...");
    if (!fs.existsSync(".env")) {
      console.log("  Creating .env file from example...");
      fs.copyFileSync(".env.example", ".env");
      console.log("  ✅ .env file created");
      console.log("  ⚠️  Please update .env with your actual credentials");
    } else {
      console.log("  ✅ .env file already exists");
    }

    // 5. Run database setup
    console.log("\n5. Setting up database...");
    try {
      const { stdout: setupStdout, stderr: setupStderr } = await execAsync(
        "node runMigrations.js",
        {
          timeout: 60000, // 1 minute timeout
        }
      );

      if (setupStdout) {
        console.log(setupStdout);
      }

      if (setupStderr) {
        console.error("STDERR:", setupStderr);
      }

      console.log("  ✅ Database setup completed");
    } catch (error) {
      console.log("  ⚠️  Database setup failed:", error.message);
      console.log("  Please run node runMigrations.js manually");
    }

    // 6. Run verification
    console.log("\n6. Verifying setup...");
    try {
      const { stdout: verifyStdout, stderr: verifyStderr } = await execAsync(
        "node verifyDatabase.js",
        {
          timeout: 30000, // 30 second timeout
        }
      );

      if (verifyStdout) {
        console.log(verifyStdout);
      }

      if (verifyStderr) {
        console.error("STDERR:", verifyStderr);
      }
    } catch (error) {
      console.log("  ⚠️  Verification failed:", error.message);
    }

    // 7. Show next steps
    console.log("\n" + "=".repeat(50));
    console.log("🎉 Development environment setup completed!");
    console.log("\nNext steps:");
    console.log("1. Update .env with your actual credentials");
    console.log("2. Start the development server: npm run dev");
    console.log("3. Run the workflow test: node workflowTest.js");
    console.log("4. Check the documentation files for more details");
    console.log("\nUseful commands:");
    console.log("  npm run dev        - Start development server");
    console.log("  npm start          - Start production server");
    console.log("  npm test           - Run tests");
    console.log("  npm run cleanup    - Run video cleanup");
    console.log("  node workflowTest.js - Test complete workflow");
  } catch (error) {
    console.error("❌ Development environment setup failed:", error.message);
  }
}

// Run setup if this script is executed directly
if (require.main === module) {
  setupDevEnvironment();
}

module.exports = { setupDevEnvironment };
