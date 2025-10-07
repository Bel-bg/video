// paginationDemo.js
// This script demonstrates how to use the API with pagination

const videoApi = require('./src/api/videoApi');

async function paginationDemo() {
  try {
    console.log('IG-Live Pagination Demo');
    console.log('=====================');
    
    // 1. Get first page of videos
    console.log('\n1. Getting first page of videos (limit: 2)...');
    const page1 = await videoApi.getVideoFeed(2);
    console.log(`✓ Retrieved ${page1.length} videos on page 1`);
    
    // 2. Get second page of videos
    console.log('\n2. Getting second page of videos (limit: 2)...');
    const page2 = await videoApi.getVideoFeed(2);
    console.log(`✓ Retrieved ${page2.length} videos on page 2`);
    
    // 3. Get comments with pagination
    console.log('\n3. Getting video feed to test comment pagination...');
    const feed = await videoApi.getVideoFeed(1);
    
    if (feed.length > 0) {
      const videoId = feed[0].id;
      console.log(`Using video ID: ${videoId}`);
      
      // Add some comments to test pagination
      console.log('\n4. Adding test comments...');
      for (let i = 1; i <= 5; i++) {
        await videoApi.commentOnVideo(videoId, `Test comment ${i}`);
      }
      console.log('✓ Added 5 test comments');
      
      // 5. Get first page of comments
      console.log('\n5. Getting first page of comments (page: 1, limit: 2)...');
      const commentsPage1 = await videoApi.getVideoComments(videoId, 1, 2);
      console.log(`✓ Retrieved ${commentsPage1.comments.length} comments on page 1`);
      console.log(`  Total comments: ${commentsPage1.pagination.total}`);
      console.log(`  Total pages: ${commentsPage1.pagination.totalPages}`);
      
      // 6. Get second page of comments
      console.log('\n6. Getting second page of comments (page: 2, limit: 2)...');
      const commentsPage2 = await videoApi.getVideoComments(videoId, 2, 2);
      console.log(`✓ Retrieved ${commentsPage2.comments.length} comments on page 2`);
    }
    
    console.log('\n🎉 Pagination demo completed successfully!');
  } catch (error) {
    console.error('❌ Pagination demo failed:', error.message);
  }
}

paginationDemo();