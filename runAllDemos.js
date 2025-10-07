// runAllDemos.js
// This script runs all demo scripts

const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

// List of demo scripts to run
const demoScripts = [
  "demo.js",
  "apiMethodsDemo.js",
  "errorHandlingDemo.js",
  "authDemo.js",
  "paginationDemo.js",
  "videoOperationsDemo.js",
  "concurrentOperationsDemo.js",
  "errorRecoveryDemo.js",
  "performanceDemo.js",
  "cachingDemo.js",
  "loggingDemo.js",
  "configDemo.js",
  "validationDemo.js",
  "rateLimitingDemo.js",
  "retryDemo.js",
  "timeoutDemo.js",
];

async function runAllDemos() {
  console.log("IG-Live Run All Demos");
  console.log("====================");

  let passed = 0;
  let failed = 0;

  for (const script of demoScripts) {
    console.log(`\nRunning ${script}...`);
    console.log("-".repeat(40));

    try {
      const { stdout, stderr } = await execAsync(`node ${script}`, {
        timeout: 30000, // 30 second timeout
      });

      if (stdout) {
        console.log(stdout);
      }

      if (stderr) {
        console.error("STDERR:", stderr);
      }

      console.log(`✅ ${script} completed successfully`);
      passed++;
    } catch (error) {
      console.error(`❌ ${script} failed:`);
      console.error(error.message);
      failed++;
    }

    // Add a small delay between scripts
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log("\n" + "=".repeat(40));
  console.log("Demo Results Summary:");
  console.log(`  Passed: ${passed}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Total:  ${demoScripts.length}`);

  if (failed === 0) {
    console.log("\n🎉 All demos completed successfully!");
  } else {
    console.log(`\n⚠️  ${failed} demo(s) failed.`);
  }
}

runAllDemos();
