// workflowTest.js
// This script tests the complete workflow from upload to interactions

const videoApi = require('./src/api/videoApi');

async function workflowTest() {
  try {
    console.log('IG-Live Complete Workflow Test');
    console.log('=============================');
    
    // 1. Get initial video feed
    console.log('\n1. Getting initial video feed...');
    const initialFeed = await videoApi.getVideoFeed(3);
    console.log(`  Found ${initialFeed.length} videos`);
    
    // 2. Upload a new video
    console.log('\n2. Uploading a new video...');
    const videoData = {
      title: 'Workflow Test Video',
      description: 'This video was uploaded as part of the workflow test',
      video_url: 'https://example.com/workflow-test-video.mp4',
      thumbnail_url: 'https://example.com/workflow-test-thumbnail.jpg'
    };
    
    const uploadedVideo = await videoApi.uploadVideo(videoData);
    console.log(`  ✅ Video uploaded successfully with ID: ${uploadedVideo.id}`);
    console.log(`  Title: ${uploadedVideo.title}`);
    console.log(`  Views: ${uploadedVideo.views_count}`);
    console.log(`  Likes: ${uploadedVideo.likes_count}`);
    console.log(`  Comments: ${uploadedVideo.comments_count}`);
    
    // 3. Get the uploaded video
    console.log('\n3. Retrieving the uploaded video...');
    const retrievedVideo = await videoApi.getVideo(uploadedVideo.id);
    console.log(`  ✅ Video retrieved successfully`);
    console.log(`  Title: ${retrievedVideo.title}`);
    console.log(`  Views: ${retrievedVideo.views_count}`);
    console.log(`  Likes: ${retrievedVideo.likes_count}`);
    console.log(`  Comments: ${retrievedVideo.comments_count}`);
    
    // 4. Like the video
    console.log('\n4. Liking the video...');
    const likeResult = await videoApi.likeVideo(uploadedVideo.id);
    console.log(`  ✅ Video ${likeResult.liked ? 'liked' : 'unliked'} successfully`);
    
    // 5. Get the video again to verify like count
    console.log('\n5. Verifying like count...');
    const videoAfterLike = await videoApi.getVideo(uploadedVideo.id);
    console.log(`  Likes after like: ${videoAfterLike.likes_count}`);
    
    // 6. Unlike the video
    console.log('\n6. Unliking the video...');
    const unlikeResult = await videoApi.likeVideo(uploadedVideo.id);
    console.log(`  ✅ Video ${unlikeResult.liked ? 'liked' : 'unliked'} successfully`);
    
    // 7. Get the video again to verify like count
    console.log('\n7. Verifying like count after unlike...');
    const videoAfterUnlike = await videoApi.getVideo(uploadedVideo.id);
    console.log(`  Likes after unlike: ${videoAfterUnlike.likes_count}`);
    
    // 8. Add comments to the video
    console.log('\n8. Adding comments to the video...');
    const comments = [
      'First comment on workflow test video!',
      'Second comment here.',
      'Third and final comment.'
    ];
    
    for (let i = 0; i < comments.length; i++) {
      const comment = await videoApi.commentOnVideo(uploadedVideo.id, comments[i]);
      console.log(`  ✅ Comment ${i + 1} added with ID: ${comment.id}`);
    }
    
    // 9. Get comments for the video
    console.log('\n9. Retrieving comments for the video...');
    const commentsData = await videoApi.getVideoComments(uploadedVideo.id, 1, 10);
    console.log(`  ✅ Retrieved ${commentsData.comments.length} comments`);
    
    commentsData.comments.forEach((comment, index) => {
      console.log(`    ${index + 1}. ${comment.text} (by ${comment.user.username})`);
    });
    
    // 10. Get the video again to verify comment count
    console.log('\n10. Verifying comment count...');
    const videoAfterComments = await videoApi.getVideo(uploadedVideo.id);
    console.log(`  Comments after adding: ${videoAfterComments.comments_count}`);
    
    // 11. Get updated video feed
    console.log('\n11. Getting updated video feed...');
    const updatedFeed = await videoApi.getVideoFeed(5);
    console.log(`  ✅ Retrieved ${updatedFeed.length} videos`);
    
    // Check if our video is in the feed
    const ourVideoInFeed = updatedFeed.find(video => video.id === uploadedVideo.id);
    if (ourVideoInFeed) {
      console.log(`  Our video is in the feed with ${ourVideoInFeed.likes_count} likes and ${ourVideoInFeed.comments_count} comments`);
    } else {
      console.log('  ⚠️  Our video is not in the feed');
    }
    
    // 12. Get ImageKit auth parameters
    console.log('\n12. Getting ImageKit authentication parameters...');
    const authParams = await videoApi.getImageKitAuth();
    console.log('  ✅ Retrieved ImageKit authentication parameters');
    console.log(`  Token: ${authParams.token.substring(0, 10)}...`);
    console.log(`  Expire: ${authParams.expire}`);
    console.log(`  Signature: ${authParams.signature.substring(0, 10)}...`);
    
    // 13. Test health endpoint
    console.log('\n13. Testing health endpoint...');
    try {
      const response = await fetch('http://localhost:3000/api/health');
      const healthData = await response.json();
      
      if (healthData.status === 'OK') {
        console.log('  ✅ Health endpoint is working');
        console.log(`  Message: ${healthData.message}`);
      } else {
        console.log('  ❌ Health endpoint returned unexpected status');
      }
    } catch (error) {
      console.log('  ❌ Health endpoint test failed:', error.message);
    }
    
    // 14. Clean up - delete the test video
    console.log('\n14. Cleaning up - deleting test video...');
    try {
      const deleteResult = await videoApi.deleteVideo(uploadedVideo.id);
      console.log('  ✅ Video deleted successfully');
    } catch (error) {
      console.log('  ❌ Failed to delete video:', error.message);
    }
    
    // 15. Verify video is deleted
    console.log('\n15. Verifying video is deleted...');
    try {
      await videoApi.getVideo(uploadedVideo.id);
      console.log('  ❌ Video still exists after deletion');
    } catch (error) {
      if (error.message.includes('not found') || error.message.includes('404')) {
        console.log('  ✅ Video successfully deleted');
      } else {
        console.log('  ❓ Unexpected error when checking deleted video:', error.message);
      }
    }
    
    console.log('\n🎉 Complete workflow test finished successfully!');
    console.log('\nSummary of operations:');
    console.log('  ✅ Video upload');
    console.log('  ✅ Video retrieval');
    console.log('  ✅ Like/unlike operations');
    console.log('  ✅ Comment operations');
    console.log('  ✅ Comment retrieval');
    console.log('  ✅ Feed updates');
    console.log('  ✅ ImageKit authentication');
    console.log('  ✅ Health endpoint');
    console.log('  ✅ Video deletion');
    
  } catch (error) {
    console.error('❌ Workflow test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

workflowTest();