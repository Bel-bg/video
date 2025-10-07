// initProject.js
// This script initializes the project

const fs = require("fs");
const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

async function initProject() {
  console.log("IG-Live Backend Project Initialization");
  console.log("====================================");

  try {
    // 1. Check if we're in the right directory
    if (!fs.existsSync("package.json")) {
      console.log(
        "❌ package.json not found. Please run this script from the backend directory."
      );
      return;
    }

    // 2. Install dependencies
    console.log("\n1. Installing dependencies...");
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

    console.log("✅ Dependencies installed successfully");

    // 3. Check if .env file exists, create if not
    console.log("\n2. Checking environment configuration...");
    if (!fs.existsSync(".env")) {
      console.log("  Creating .env file from example...");
      fs.copyFileSync(".env.example", ".env");
      console.log(
        "  ✅ .env file created. Please update with your credentials."
      );
    } else {
      console.log("  ✅ .env file already exists");
    }

    // 4. Run database verification
    console.log("\n3. Verifying database setup...");
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
      console.log("  ⚠️  Database verification failed:", error.message);
      console.log(
        "  Please check your database configuration and run verifyDatabase.js manually."
      );
    }

    // 5. Run a simple test
    console.log("\n4. Running basic test...");
    try {
      const { stdout: testStdout, stderr: testStderr } = await execAsync(
        "node testApi.js",
        {
          timeout: 30000, // 30 second timeout
        }
      );

      if (testStdout) {
        console.log(testStdout);
      }

      if (testStderr) {
        console.error("STDERR:", testStderr);
      }
    } catch (error) {
      console.log("  ⚠️  Basic test failed:", error.message);
    }

    // 6. Show next steps
    console.log("\n🎉 Project initialization completed!");
    console.log("\nNext steps:");
    console.log("1. Update .env with your actual credentials");
    console.log("2. Run database migrations if needed");
    console.log("3. Start the development server: npm run dev");
    console.log("4. Run the workflow test: node workflowTest.js");
    console.log("5. Check the documentation files for more details");
  } catch (error) {
    console.error("❌ Project initialization failed:", error.message);
  }
}

initProject();
