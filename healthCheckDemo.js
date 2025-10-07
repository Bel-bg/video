// healthCheckDemo.js
// This script demonstrates API health checking

const videoApi = require('./src/api/videoApi');

class HealthChecker {
  constructor() {
    this.checks = [];
  }
  
  addCheck(name, checkFunction) {
    this.checks.push({ name, checkFunction });
  }
  
  async runAllChecks() {
    console.log('Running health checks...');
    console.log('=====================');
    
    const results = [];
    let allPassed = true;
    
    for (const { name, checkFunction } of this.checks) {
      try {
        console.log(`\nChecking ${name}...`);
        const result = await checkFunction();
        console.log(`  ✅ ${name}: ${result.message || 'OK'}`);
        results.push({ name, status: 'PASS', result });
      } catch (error) {
        console.log(`  ❌ ${name}: ${error.message}`);
        results.push({ name, status: 'FAIL', error: error.message });
        allPassed = false;
      }
    }
    
    console.log('\nHealth Check Summary:');
    console.log('====================');
    for (const { name, status } of results) {
      console.log(`  ${status === 'PASS' ? '✅' : '❌'} ${name}: ${status}`);
    }
    
    return { allPassed, results };
  }
}

async function healthCheckDemo() {
  try {
    console.log('IG-Live Health Check Demo');
    console.log('========================');
    
    const healthChecker = new HealthChecker();
    
    // Add health checks
    healthChecker.addCheck('API Health Endpoint', async () => {
      // In a real app, you would call the actual health endpoint
      const response = await fetch('http://localhost:3000/api/health');
      if (!response.ok) {
        throw new Error(`Health endpoint returned ${response.status}`);
      }
      const data = await response.json();
      return { message: data.message };
    });
    
    healthChecker.addCheck('Video Feed Access', async () => {
      const feed = await videoApi.getVideoFeed(1);
      return { message: `Retrieved ${feed.length} videos` };
    });
    
    healthChecker.addCheck('ImageKit Auth', async () => {
      const auth = await videoApi.getImageKitAuth();
      return { message: 'Authentication parameters retrieved' };
    });
    
    healthChecker.addCheck('Database Connection', async () => {
      // In a real app, you would check the database connection
      return { message: 'Database connection OK (simulated)' };
    });
    
    healthChecker.addCheck('Cache Status', async () => {
      // In a real app, you would check cache status
      return { message: 'Cache operational (simulated)' };
    });
    
    // Run all health checks
    const { allPassed, results } = await healthChecker.runAllChecks();
    
    console.log(`\nOverall Status: ${allPassed ? '✅ HEALTHY' : '❌ UNHEALTHY'}`);
    
    if (allPassed) {
      console.log('\n🎉 All health checks passed!');
    } else {
      console.log('\n⚠️  Some health checks failed. Please investigate.');
    }
    
  } catch (error) {
    console.error('❌ Health check demo failed:', error.message);
  }
}

healthCheckDemo();