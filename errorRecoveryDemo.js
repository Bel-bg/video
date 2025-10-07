// errorRecoveryDemo.js
// This script demonstrates error recovery strategies

const videoApi = require('./src/api/videoApi');

async function errorRecoveryDemo() {
  try {
    console.log('IG-Live Error Recovery Demo');
    console.log('=========================');
    
    // 1. Try to get video feed with retry logic
    console.log('\n1. Getting video feed with retry logic...');
    let feed;
    let retries = 3;
    
    while (retries > 0) {
      try {
        feed = await videoApi.getVideoFeed(3);
        console.log(`✓ Retrieved ${feed.length} videos`);
        break;
      } catch (error) {
        retries--;
        console.log(`  Attempt failed, ${retries} retries left`);
        if (retries === 0) throw error;
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    if (feed && feed.length > 0) {
      const videoId = feed[0].id;
      console.log(`Using video ID: ${videoId}`);
      
      // 2. Try to like video with error handling
      console.log('\n2. Liking video with error handling...');
      try {
        const likeResult = await videoApi.likeVideo(videoId);
        console.log('✓ Video liked successfully');
      } catch (error) {
        console.log('  Like failed, but continuing with demo...');
        // In a real app, you might show a user-friendly message
        // or queue the action to retry later
      }
      
      // 3. Try to add comment with validation
      console.log('\n3. Adding comment with validation...');
      const commentText = 'Error recovery demo comment';
      
      if (commentText && commentText.trim().length > 0) {
        try {
          const commentResult = await videoApi.commentOnVideo(videoId, commentText);
          console.log('✓ Comment added successfully');
        } catch (error) {
          console.log('  Comment failed, but validation passed');
        }
      } else {
        console.log('  Comment skipped due to validation failure');
      }
      
      // 4. Try to share video with fallback
      console.log('\n4. Sharing video with fallback...');
      try {
        const shareResult = await videoApi.shareVideo(videoId, 'primary_platform');
        console.log('✓ Video shared on primary platform');
      } catch (error) {
        console.log('  Primary platform failed, trying fallback...');
        try {
          const fallbackResult = await videoApi.shareVideo(videoId, 'fallback_platform');
          console.log('✓ Video shared on fallback platform');
        } catch (fallbackError) {
          console.log('  Fallback also failed, showing user message');
        }
      }
    }
    
    console.log('\n🎉 Error recovery demo completed successfully!');
  } catch (error) {
    console.error('❌ Error recovery demo failed:', error.message);
  }
}

errorRecoveryDemo();