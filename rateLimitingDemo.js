// rateLimitingDemo.js
// This script demonstrates API rate limiting

const videoApi = require('./src/api/videoApi');

// Simple rate limiter
class RateLimiter {
  constructor(maxRequests, timeWindow) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = [];
  }
  
  async execute(operation) {
    const now = Date.now();
    
    // Remove old requests outside the time window
    this.requests = this.requests.filter(time => now - time < this.timeWindow);
    
    // Check if we're within the limit
    if (this.requests.length >= this.maxRequests) {
      const oldest = Math.min(...this.requests);
      const waitTime = this.timeWindow - (now - oldest);
      console.log(`  Rate limit exceeded, waiting ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.execute(operation);
    }
    
    // Add current request
    this.requests.push(now);
    
    // Execute operation
    return await operation();
  }
}

// Create a rate limiter (5 requests per second)
const rateLimiter = new RateLimiter(5, 1000);

async function rateLimitingDemo() {
  try {
    console.log('IG-Live Rate Limiting Demo');
    console.log('========================');
    
    // 1. Make multiple rapid requests to test rate limiting
    console.log('\n1. Making rapid requests to test rate limiting...');
    
    const startTime = Date.now();
    const requests = [];
    
    // Create 10 requests
    for (let i = 1; i <= 10; i++) {
      requests.push(
        rateLimiter.execute(async () => {
          console.log(`  Request ${i} starting...`);
          const feed = await videoApi.getVideoFeed(1);
          console.log(`  Request ${i} completed`);
          return feed;
        })
      );
    }
    
    // Execute all requests
    await Promise.all(requests);
    
    const endTime = Date.now();
    console.log(`\nAll requests completed in ${endTime - startTime}ms`);
    
    // 2. Show rate limiting in action with different operations
    console.log('\n2. Rate limiting with different operations...');
    
    const operations = [
      () => videoApi.getVideoFeed(2),
      () => videoApi.getVideoFeed(3),
      () => videoApi.getVideoFeed(1),
      () => videoApi.getVideoFeed(2),
      () => videoApi.getVideoFeed(3),
      () => videoApi.getVideoFeed(1),
      () => videoApi.getVideoFeed(2)
    ];
    
    const operationStartTime = Date.now();
    
    for (let i = 0; i < operations.length; i++) {
      await rateLimiter.execute(async () => {
        console.log(`  Operation ${i + 1} starting...`);
        const result = await operations[i]();
        console.log(`  Operation ${i + 1} completed (${result.length} videos)`);
      });
    }
    
    const operationEndTime = Date.now();
    console.log(`\nAll operations completed in ${operationEndTime - operationStartTime}ms`);
    
    console.log('\n🎉 Rate limiting demo completed successfully!');
  } catch (error) {
    console.error('❌ Rate limiting demo failed:', error.message);
  }
}

rateLimitingDemo();