// runAllUtils.js
// This script runs all utility scripts

const { backupDatabase } = require("./backupDatabase");
const { runCleanup } = require("./runCleanup");
const { updateDependencies } = require("./updateDependencies");
const { generateAllDocs } = require("./generateDocs");

async function runAllUtils() {
  console.log("IG-Live Utility Scripts Runner");
  console.log("=============================");

  const utils = [
    { name: "Database Backup", func: backupDatabase },
    { name: "Video Cleanup", func: runCleanup },
    { name: "Dependency Update", func: updateDependencies },
    { name: "Documentation Generation", func: generateAllDocs },
  ];

  let passed = 0;
  let failed = 0;

  for (const { name, func } of utils) {
    console.log(`\nRunning ${name}...`);
    console.log("-".repeat(40));

    try {
      await func();
      console.log(`✅ ${name} completed successfully`);
      passed++;
    } catch (error) {
      console.error(`❌ ${name} failed:`, error.message);
      failed++;
    }

    // Add a small delay between scripts
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log("\n" + "=".repeat(40));
  console.log("Utility Scripts Summary:");
  console.log(`  Passed: ${passed}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Total:  ${utils.length}`);

  if (failed === 0) {
    console.log("\n🎉 All utility scripts completed successfully!");
  } else {
    console.log(`\n⚠️  ${failed} utility script(s) failed.`);
  }
}

// Run all utilities if this script is executed directly
if (require.main === module) {
  runAllUtils();
}

module.exports = { runAllUtils };
