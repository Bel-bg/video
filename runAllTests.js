// runAllTests.js
// This script runs all tests

const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

// List of test scripts to run
const testScripts = [
  "verifyDatabase.js",
  "workflowTest.js",
  "demo.js",
  "apiMethodsDemo.js",
];

async function runAllTests() {
  console.log("IG-Live Run All Tests");
  console.log("====================");

  let passed = 0;
  let failed = 0;

  for (const script of testScripts) {
    console.log(`\nRunning ${script}...`);
    console.log("-".repeat(40));

    try {
      const { stdout, stderr } = await execAsync(`node ${script}`, {
        timeout: 60000, // 60 second timeout
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
  console.log("Test Results Summary:");
  console.log(`  Passed: ${passed}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Total:  ${testScripts.length}`);

  if (failed === 0) {
    console.log("\n🎉 All tests completed successfully!");
  } else {
    console.log(`\n⚠️  ${failed} test(s) failed.`);
  }
}

runAllTests();
