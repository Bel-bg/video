// backupRestoreDemo.js
// This script demonstrates data backup and restore

const videoApi = require('./src/api/videoApi');
const fs = require('fs').promises;

async function backupRestoreDemo() {
  try {
    console.log('IG-Live Backup & Restore Demo');
    console.log('============================');
    
    // 1. Backup data
    console.log('\n1. Backing up data...');
    
    // Get video feed
    console.log('  Getting video feed...');
    const feed = await videoApi.getVideoFeed(10);
    console.log(`  Retrieved ${feed.length} videos`);
    
    // Get detailed data for each video
    console.log('  Getting detailed video data...');
    const videoDetails = [];
    for (const video of feed.slice(0, 3)) { // Limit to first 3 for demo
      try {
        const details = await videoApi.getVideo(video.id);
        videoDetails.push(details);
      } catch (error) {
        console.log(`  Failed to get details for ${video.id}: ${error.message}`);
      }
    }
    
    // Create backup data
    const backupData = {
      timestamp: new Date().toISOString(),
      videos: videoDetails,
      stats: {
        totalVideos: feed.length,
        backedUpVideos: videoDetails.length
      }
    };
    
    // Save backup to file
    const backupFileName = `backup_${new Date().getTime()}.json`;
    console.log(`  Saving backup to ${backupFileName}...`);
    await fs.writeFile(backupFileName, JSON.stringify(backupData, null, 2));
    console.log('  ✅ Backup saved');
    
    // 2. Restore data (demo - in a real app you would recreate the data)
    console.log('\n2. Restoring data (demo)...');
    
    // Read backup file
    console.log('  Reading backup file...');
    const backupContent = await fs.readFile(backupFileName, 'utf8');
    const restoredData = JSON.parse(backupContent);
    
    console.log(`  Restored backup from ${restoredData.timestamp}`);
    console.log(`  Videos in backup: ${restoredData.stats.backedUpVideos}`);
    
    // In a real restore operation, you would:
    // 1. Check if videos already exist
    // 2. Create new videos from backup data
    // 3. Restore comments, likes, etc.
    
    console.log('  🔄 In a real app, this would recreate the videos and their data');
    
    // 3. Verify backup integrity
    console.log('\n3. Verifying backup integrity...');
    
    if (restoredData.timestamp && restoredData.videos && restoredData.stats) {
      console.log('  ✅ Backup structure is valid');
    } else {
      console.log('  ❌ Backup structure is invalid');
    }
    
    // 4. Show backup info
    console.log('\n4. Backup information:');
    console.log(`  File: ${backupFileName}`);
    console.log(`  Created: ${restoredData.timestamp}`);
    console.log(`  Videos: ${restoredData.stats.backedUpVideos}`);
    console.log(`  File size: ${(JSON.stringify(backupData).length / 1024).toFixed(2)} KB`);
    
    console.log('\n🎉 Backup & restore demo completed successfully!');
  } catch (error) {
    console.error('❌ Backup & restore demo failed:', error.message);
  }
}

backupRestoreDemo();