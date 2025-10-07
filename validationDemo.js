// validationDemo.js
// This script demonstrates API validation

const videoApi = require('./src/api/videoApi');

// Validation utilities
class Validator {
  static validateVideoId(videoId) {
    if (!videoId || typeof videoId !== 'string' || videoId.trim().length === 0) {
      throw new Error('Invalid video ID: must be a non-empty string');
    }
    return true;
  }
  
  static validateCommentText(text) {
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid comment text: must be a string');
    }
    if (text.trim().length === 0) {
      throw new Error('Invalid comment text: cannot be empty');
    }
    if (text.length > 1000) {
      throw new Error('Invalid comment text: too long (max 1000 characters)');
    }
    return true;
  }
  
  static validateVideoData(videoData) {
    if (!videoData || typeof videoData !== 'object') {
      throw new Error('Invalid video data: must be an object');
    }
    if (!videoData.video_url || typeof videoData.video_url !== 'string') {
      throw new Error('Invalid video data: video_url is required and must be a string');
    }
    if (videoData.title && typeof videoData.title !== 'string') {
      throw new Error('Invalid video data: title must be a string');
    }
    if (videoData.description && typeof videoData.description !== 'string') {
      throw new Error('Invalid video data: description must be a string');
    }
    return true;
  }
  
  static validatePagination(page, limit) {
    if (page && (typeof page !== 'number' || page < 1)) {
      throw new Error('Invalid page: must be a positive number');
    }
    if (limit && (typeof limit !== 'number' || limit < 1 || limit > 100)) {
      throw new Error('Invalid limit: must be a number between 1 and 100');
    }
    return true;
  }
}

// Wrapper for API calls with validation
function validatedApiCall(name, validator, apiCall) {
  return async (...args) => {
    console.log(`Validating ${name}...`);
    // Validate arguments
    validator(...args);
    console.log(`✓ Validation passed for ${name}`);
    
    // Make API call
    return await apiCall(...args);
  };
}

async function validationDemo() {
  try {
    console.log('IG-Live Validation Demo');
    console.log('=====================');
    
    // Wrap API calls with validation
    const validatedGetVideo = validatedApiCall(
      'getVideo',
      (videoId) => Validator.validateVideoId(videoId),
      videoApi.getVideo
    );
    
    const validatedLikeVideo = validatedApiCall(
      'likeVideo',
      (videoId) => Validator.validateVideoId(videoId),
      videoApi.likeVideo
    );
    
    const validatedCommentOnVideo = validatedApiCall(
      'commentOnVideo',
      (videoId, text) => {
        Validator.validateVideoId(videoId);
        Validator.validateCommentText(text);
      },
      videoApi.commentOnVideo
    );
    
    const validatedUploadVideo = validatedApiCall(
      'uploadVideo',
      (videoData) => Validator.validateVideoData(videoData),
      videoApi.uploadVideo
    );
    
    const validatedGetVideoComments = validatedApiCall(
      'getVideoComments',
      (videoId, page, limit) => {
        Validator.validateVideoId(videoId);
        Validator.validatePagination(page, limit);
      },
      videoApi.getVideoComments
    );
    
    // 1. Get video feed
    console.log('\n1. Getting video feed...');
    const feed = await videoApi.getVideoFeed(3);
    console.log(`✓ Retrieved ${feed.length} videos`);
    
    if (feed.length > 0) {
      const videoId = feed[0].id;
      console.log(`\nUsing video ID: ${videoId}`);
      
      // 2. Valid operations
      console.log('\n2. Valid operations:');
      
      // Get video (valid)
      console.log('\n  Getting video (valid)...');
      const video = await validatedGetVideo(videoId);
      console.log('  ✓ Video retrieved');
      
      // Like video (valid)
      console.log('\n  Liking video (valid)...');
      const likeResult = await validatedLikeVideo(videoId);
      console.log('  ✓ Video liked');
      
      // Add comment (valid)
      console.log('\n  Adding comment (valid)...');
      const commentResult = await validatedCommentOnVideo(videoId, 'Validation demo comment');
      console.log('  ✓ Comment added');
      
      // Get comments (valid)
      console.log('\n  Getting comments (valid)...');
      const comments = await validatedGetVideoComments(videoId, 1, 10);
      console.log(`  ✓ Retrieved ${comments.comments.length} comments`);
      
      // Upload video (valid)
      console.log('\n  Uploading video (valid)...');
      const uploadData = {
        title: 'Validation Demo Video',
        description: 'Uploaded with validation',
        video_url: 'https://example.com/validation-demo.mp4'
      };
      const uploadResult = await validatedUploadVideo(uploadData);
      console.log('  ✓ Video uploaded');
      
      // 3. Invalid operations
      console.log('\n3. Invalid operations (should fail validation):');
      
      // Invalid video ID
      console.log('\n  Getting video with invalid ID...');
      try {
        await validatedGetVideo('');
        console.log('  ❌ Should have failed');
      } catch (error) {
        console.log(`  ✓ Correctly failed: ${error.message}`);
      }
      
      // Invalid comment text
      console.log('\n  Adding comment with invalid text...');
      try {
        await validatedCommentOnVideo(videoId, '');
        console.log('  ❌ Should have failed');
      } catch (error) {
        console.log(`  ✓ Correctly failed: ${error.message}`);
      }
      
      // Invalid video data
      console.log('\n  Uploading video with invalid data...');
      try {
        await validatedUploadVideo({ title: 'No URL' });
        console.log('  ❌ Should have failed');
      } catch (error) {
        console.log(`  ✓ Correctly failed: ${error.message}`);
      }
      
      // Invalid pagination
      console.log('\n  Getting comments with invalid pagination...');
      try {
        await validatedGetVideoComments(videoId, -1, 1000);
        console.log('  ❌ Should have failed');
      } catch (error) {
        console.log(`  ✓ Correctly failed: ${error.message}`);
      }
    }
    
    console.log('\n🎉 Validation demo completed successfully!');
  } catch (error) {
    console.error('❌ Validation demo failed:', error.message);
  }
}

validationDemo();