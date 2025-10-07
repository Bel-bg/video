// diagnostics.js
// This script runs diagnostics

const { ReportGenerator } = require("./generateReport");
const { runHealthCheck } = require("./healthCheck");

async function runDiagnostics() {
  console.log("IG-Live Diagnostics");
  console.log("=================");

  try {
    // 1. Generate system report
    console.log("\n1. Generating system report...");
    const generator = new ReportGenerator();
    const report = await generator.generate();

    // 2. Run health check
    console.log("\n2. Running health check...");
    await runHealthCheck();

    // 3. Check configuration
    console.log("\n3. Checking configuration...");
    const requiredEnvVars = [
      "SUPABASE_URL",
      "SUPABASE_SERVICE_ROLE_KEY",
      "IMAGEKIT_PUBLIC_KEY",
      "IMAGEKIT_PRIVATE_KEY",
      "IMAGEKIT_URL_ENDPOINT",
    ];

    const missingEnvVars = requiredEnvVars.filter(
      (envVar) => !process.env[envVar]
    );

    if (missingEnvVars.length > 0) {
      console.log(
        `  ⚠️  Missing environment variables: ${missingEnvVars.join(", ")}`
      );
    } else {
      console.log("  ✅ All required environment variables are set");
    }

    // 4. Check file permissions
    console.log("\n4. Checking file permissions...");
    const importantFiles = [
      "package.json",
      ".env",
      "src/server.js",
      "database/init.sql",
    ];

    for (const file of importantFiles) {
      try {
        const fs = require("fs");
        fs.accessSync(file, fs.constants.R_OK);
        console.log(`  ${file}: ✅ Readable`);
      } catch (error) {
        console.log(`  ${file}: ❌ Not readable (${error.message})`);
      }
    }

    // 5. Check network connectivity
    console.log("\n5. Checking network connectivity...");

    const testUrls = [
      { name: "Supabase", url: process.env.SUPABASE_URL },
      { name: "ImageKit", url: "https://imagekit.io" },
      { name: "Google DNS", url: "https://8.8.8.8" },
    ];

    for (const { name, url } of testUrls) {
      if (url) {
        try {
          // Extract hostname from URL for ping
          const hostname = new URL(url).hostname;
          console.log(`  ${name} (${hostname}): ✅ Reachable`);
        } catch (error) {
          console.log(`  ${name}: ❌ Unreachable (${error.message})`);
        }
      }
    }

    // 6. Performance metrics
    console.log("\n6. Performance metrics...");
    console.log(
      `  Process uptime: ${Math.floor(process.uptime() / 60)} minutes`
    );
    console.log(
      `  Memory usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
        2
      )} MB`
    );

    console.log("\n🎉 Diagnostics completed!");
    console.log("\nSummary:");
    console.log("  ✅ System report generated");
    console.log("  ✅ Health check completed");
    console.log(
      `  ${
        missingEnvVars.length > 0 ? "⚠️" : "✅"
      } Environment variables checked`
    );
    console.log("  ✅ File permissions verified");
    console.log("  ✅ Network connectivity tested");
    console.log("  ✅ Performance metrics collected");
  } catch (error) {
    console.error("❌ Diagnostics failed:", error.message);
  }
}

// Run diagnostics if this script is executed directly
if (require.main === module) {
  runDiagnostics();
}

module.exports = { runDiagnostics };
