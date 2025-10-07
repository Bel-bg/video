// configDemo.js
// This script demonstrates API configuration

const videoApi = require('./src/api/videoApi');

// Configuration management
class ConfigManager {
  constructor() {
    this.config = {
      api: {
        baseUrl: process.env.VIDEO_API_URL || 'http://localhost:3000',
        timeout: 10000,
        retries: 3
      },
      features: {
        enableCaching: true,
        enableLogging: true,
        enablePerformanceMonitoring: true
      },
      limits: {
        maxVideosPerPage: 50,
        maxCommentsPerPage: 100
      }
    };
  }
  
  get(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], this.config);
  }
  
  set(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((obj, key) => {
      if (!obj[key]) obj[key] = {};
      return obj[key];
    }, this.config);
    target[lastKey] = value;
  }
  
  update(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }
}

const config = new ConfigManager();

async function configDemo() {
  try {
    console.log('IG-Live Configuration Demo');
    console.log('========================');
    
    // 1. Show current configuration
    console.log('\n1. Current configuration:');
    console.log(`  API Base URL: ${config.get('api.baseUrl')}`);
    console.log(`  API Timeout: ${config.get('api.timeout')}ms`);
    console.log(`  API Retries: ${config.get('api.retries')}`);
    console.log(`  Caching Enabled: ${config.get('features.enableCaching')}`);
    console.log(`  Logging Enabled: ${config.get('features.enableLogging')}`);
    console.log(`  Performance Monitoring: ${config.get('features.enablePerformanceMonitoring')}`);
    console.log(`  Max Videos Per Page: ${config.get('limits.maxVideosPerPage')}`);
    console.log(`  Max Comments Per Page: ${config.get('limits.maxCommentsPerPage')}`);
    
    // 2. Update configuration
    console.log('\n2. Updating configuration...');
    config.set('api.timeout', 15000);
    config.set('features.enableCaching', false);
    config.set('limits.maxVideosPerPage', 25);
    
    console.log('\n3. Updated configuration:');
    console.log(`  API Timeout: ${config.get('api.timeout')}ms`);
    console.log(`  Caching Enabled: ${config.get('features.enableCaching')}`);
    console.log(`  Max Videos Per Page: ${config.get('limits.maxVideosPerPage')}`);
    
    // 3. Use configuration in API calls
    console.log('\n4. Using configuration in API calls...');
    const maxVideos = config.get('limits.maxVideosPerPage');
    console.log(`  Getting up to ${maxVideos} videos...`);
    const feed = await videoApi.getVideoFeed(maxVideos);
    console.log(`  Retrieved ${feed.length} videos`);
    
    console.log('\n🎉 Configuration demo completed successfully!');
  } catch (error) {
    console.error('❌ Configuration demo failed:', error.message);
  }
}

configDemo();