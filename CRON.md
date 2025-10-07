# Cron Job Setup

To automatically delete videos older than 2 weeks, you need to set up a cron job to run the cleanup script.

## Linux/macOS

1. Open the crontab editor:

   ```
   crontab -e
   ```

2. Add the following line to run the cleanup daily at 2 AM:
   ```
   0 2 * * * /usr/bin/node /path/to/your/project/backend/src/utils/cleanupOldVideos.js
   ```

## Windows

1. Open Task Scheduler
2. Create a new task
3. Set the trigger to daily at 2 AM
4. Set the action to run:
   ```
   node "C:\path\to\your\project\backend\src\utils\cleanupOldVideos.js"
   ```

## Docker

If you're using Docker, you can use the built-in cron functionality or run the cleanup script as a separate service.

## Manual Cleanup

You can also run the cleanup manually at any time:

```
npm run cleanup
```
