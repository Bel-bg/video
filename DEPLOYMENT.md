# Deployment Guide

## Prerequisites

1. Node.js 16+
2. npm or yarn
3. Supabase account
4. ImageKit account

## Local Development

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` file:

   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:

   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   ```

5. Run database migrations:

   ```bash
   node runMigrations.js
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

## Production Deployment

### Using Node.js Directly

1. Install dependencies:

   ```bash
   npm ci --only=production
   ```

2. Set environment variables:

   ```bash
   export SUPABASE_URL=your_supabase_url
   export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   export IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   export IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   export IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   ```

3. Start the server:
   ```bash
   npm start
   ```

### Using Docker

1. Build the Docker image:

   ```bash
   docker build -t ig-live-video-backend .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 \
     -e SUPABASE_URL=your_supabase_url \
     -e SUPABASE_SERVICE_ROLE_KEY=your_service_role_key \
     -e IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key \
     -e IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key \
     -e IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint \
     ig-live-video-backend
   ```

### Deploying to Heroku

1. Create a new Heroku app:

   ```bash
   heroku create your-app-name
   ```

2. Set environment variables:

   ```bash
   heroku config:set SUPABASE_URL=your_supabase_url
   heroku config:set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   heroku config:set IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   heroku config:set IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   heroku config:set IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   ```

3. Deploy:
   ```bash
   git push heroku main
   ```

### Deploying to AWS Elastic Beanstalk

1. Install the Elastic Beanstalk CLI
2. Initialize the application:
   ```bash
   eb init
   ```
3. Create environment:
   ```bash
   eb create
   ```
4. Set environment variables:
   ```bash
   eb setenv SUPABASE_URL=your_supabase_url
   eb setenv SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   eb setenv IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   eb setenv IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   eb setenv IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   ```
5. Deploy:
   ```bash
   eb deploy
   ```

## Database Setup

### Initial Setup

1. Run the initialization script:

   ```bash
   node runMigrations.js
   ```

2. Or manually execute the SQL files in order:
   ```bash
   psql -f database/migrations/01_init_tables.sql
   psql -f database/migrations/02_create_functions.sql
   psql -f database/migrations/03_setup_rls.sql
   ```

### Verification

1. Run the verification script:
   ```bash
   node verifyDatabase.js
   ```

## Cron Jobs

Set up automatic cleanup of old videos:

### Linux/macOS

```bash
# Add to crontab (crontab -e)
0 2 * * * /usr/bin/node /path/to/project/backend/src/utils/cleanupOldVideos.js
```

### Windows

Use Task Scheduler to run the script daily.

## Monitoring

### Health Check

```
GET /api/health
```

### Logs

Check logs in your deployment platform or:

```bash
# For Docker
docker logs <container-id>

# For direct Node.js
tail -f logs/app.log
```

## Scaling

### Horizontal Scaling

- Use a load balancer
- Ensure sticky sessions for WebSocket connections (if added later)
- Use Redis for session storage (if needed)

### Database Scaling

- Enable Supabase's auto-scaling
- Add read replicas for high-traffic queries
- Optimize queries with indexes

## Backup and Recovery

### Database Backup

```bash
# Manual backup
pg_dump -h hostname -U username database_name > backup.sql

# Restore
psql -h hostname -U username database_name < backup.sql
```

### Automated Backups

Set up automated backups through your cloud provider or Supabase.

## Troubleshooting

### Common Issues

1. **Connection Refused**

   - Check if the server is running
   - Verify port configuration
   - Check firewall settings

2. **Database Connection Failed**

   - Verify Supabase credentials
   - Check network connectivity
   - Ensure Supabase is not paused

3. **ImageKit Upload Failed**
   - Verify ImageKit credentials
   - Check if the account has sufficient quota
   - Ensure the file size is within limits

### Logs

Check logs for detailed error information:

```bash
# Application logs
cat logs/app.log

# Error logs
cat logs/error.log
```

## Security Considerations

1. **Environment Variables**

   - Never commit `.env` files to version control
   - Use secret management in production

2. **API Keys**

   - Rotate keys regularly
   - Use least privilege principles
   - Monitor usage

3. **Rate Limiting**

   - Implement rate limiting to prevent abuse
   - Monitor for unusual traffic patterns

4. **Input Validation**
   - Validate all user inputs
   - Sanitize data before storing
   - Use parameterized queries

## Performance Tuning

1. **Database Indexes**

   - Ensure proper indexes on frequently queried columns
   - Monitor slow queries

2. **Caching**

   - Implement Redis for frequently accessed data
   - Cache API responses where appropriate

3. **Connection Pooling**

   - Configure appropriate connection pool sizes
   - Monitor connection usage

4. **Response Compression**
   - Enable gzip compression
   - Optimize JSON responses

## Updates and Maintenance

### Updating the Application

1. Pull the latest code:

   ```bash
   git pull origin main
   ```

2. Install updated dependencies:

   ```bash
   npm install
   ```

3. Run database migrations if needed:

   ```bash
   node runMigrations.js
   ```

4. Restart the application:

   ```bash
   # For PM2
   pm2 restart app-name

   # For direct Node.js
   npm start
   ```

### Database Migrations

1. Create new migration files in `database/migrations/`
2. Follow the naming convention: `XX_description.sql`
3. Test migrations in a staging environment first
4. Apply to production during maintenance windows

## Support

For issues and support:

1. Check the documentation
2. Review logs for error messages
3. Contact the development team
4. File issues in the repository
