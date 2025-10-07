// performanceDemo.js
// This script demonstrates API performance monitoring

const videoApi = require('./src/api/videoApi');

// Simple performance monitoring utility
function measurePerformance(operationName, operation) {
  return async () => {
    const start = Date.now();
    try {
      const result = await operation();
      const end = Date.now();
      console.log(`  ${operationName}: ${end - start}ms`);
      return result;
    } catch (error) {
      const end = Date.now();
      console.log(`  ${operationName}: ${end - start}ms (FAILED)`);
      throw error;
    }
  };
}

async function performanceDemo() {
  try {
    console.log('IG-Live Performance Monitoring Demo');
    console.log('=================================');
    
    // 1. Measure video feed performance
    console.log('\n1. Measuring video feed performance...');
    const feed = await measurePerformance('Get video feed', () => videoApi.getVideoFeed(5))();
    console.log(`✓ Retrieved ${feed.length} videos`);
    
    if (feed.length > 0) {
      const videoId = feed[0].id;
      console.log(`Using video ID: ${videoId}`);
      
      // 2. Measure individual operations
      console.log('\n2. Measuring individual operations...');
      
      await measurePerformance('Get video details', () => videoApi.getVideo(videoId))();
      
      await measurePerformance('Like video', () => videoApi.likeVideo(videoId))();
      
      await measurePerformance('Add comment', () => videoApi.commentOnVideo(videoId, 'Performance test comment'))();
      
      await measurePerformance('Get comments', () => videoApi.getVideoComments(videoId, 1, 5))();
      
      await measurePerformance('Share video', () => videoApi.shareVideo(videoId, 'performance_test'))();
      
      // 3. Measure concurrent operations
      console.log('\n3. Measuring concurrent operations...');
      const concurrentStart = Date.now();
      
      const concurrentOperations = [
        measurePerformance('Concurrent op 1', () => videoApi.getVideo(videoId))(),
        measurePerformance('Concurrent op 2', () => videoApi.likeVideo(videoId))(),
        measurePerformance('Concurrent op 3', () => videoApi.commentOnVideo(videoId, 'Concurrent test comment'))()
      ];
      
      await Promise.all(concurrentOperations);
      const concurrentEnd = Date.now();
      console.log(`  All concurrent operations: ${concurrentEnd - concurrentStart}ms`);
    }
    
    console.log('\n🎉 Performance monitoring demo completed successfully!');
  } catch (error) {
    console.error('❌ Performance monitoring demo failed:', error.message);
  }
}

performanceDemo();