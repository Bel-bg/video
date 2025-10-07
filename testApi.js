// testApi.js
const videoApi = require("./src/api/videoApi");

async function testApi() {
  try {
    console.log("Testing IG-Live Video Backend API...");

    // Test health check
    const response = await fetch("http://localhost:3000/api/health");
    const data = await response.json();

    if (data.status === "OK") {
      console.log("✅ API is running correctly");
      console.log("Message:", data.message);
    } else {
      console.log("❌ API health check failed");
    }
  } catch (error) {
    console.error("❌ API test failed:", error.message);
  }
}

testApi();
