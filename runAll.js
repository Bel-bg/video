// runAll.js
// This script runs all major operations

const { runAllTests } = require("./runAllTests");
const { runAllDemos } = require("./runAllDemos");
const { runAllUtils } = require("./runAllUtils");
const { runDiagnostics } = require("./diagnostics");

async function runAll() {
  console.log("IG-Live Complete Operations Runner");
  console.log("================================");

  const operations = [
    { name: "Tests", func: runAllTests },
    { name: "Demos", func: runAllDemos },
    { name: "Utilities", func: runAllUtils },
    { name: "Diagnostics", func: runDiagnostics },
  ];

  let passed = 0;
  let failed = 0;

  for (const { name, func } of operations) {
    console.log(`\nRunning ${name}...`);
    console.log("=".repeat(50));

    try {
      await func();
      console.log(`\n✅ ${name} completed successfully`);
      passed++;
    } catch (error) {
      console.error(`\n❌ ${name} failed:`, error.message);
      failed++;
    }

    // Add a delay between major operations
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  console.log("\n" + "=".repeat(50));
  console.log("Complete Operations Summary:");
  console.log(`  Passed: ${passed}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Total:  ${operations.length}`);

  if (failed === 0) {
    console.log("\n🎉 All operations completed successfully!");
  } else {
    console.log(`\n⚠️  ${failed} operation(s) failed.`);
  }
}

// Run all operations if this script is executed directly
if (require.main === module) {
  runAll();
}

module.exports = { runAll };
