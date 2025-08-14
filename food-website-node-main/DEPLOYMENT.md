# Deployment Guide for Food Donation App

This guide will help you deploy the Food Donation App to production.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- A cloud hosting provider (Heroku, AWS, DigitalOcean, etc.)
- Domain name (optional but recommended)

## Environment Setup

### 1. Backend Environment Variables

Create a `.env` file in the `backend` directory:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/food-donation-app

# JWT Secret (generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=5001
NODE_ENV=production

# Frontend URL for CORS
FRONTEND_URL=https://your-frontend-domain.com
```

### 2. Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```bash
# API URL for production
REACT_APP_API_URL=https://your-api-domain.com

# Environment
NODE_ENV=production
```

## Deployment Options

### Option 1: Heroku Deployment

#### Backend Deployment

1. **Create Heroku App**
   ```bash
   cd backend
   heroku create your-app-name-backend
   ```

2. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI="your-mongodb-uri"
   heroku config:set JWT_SECRET="your-jwt-secret"
   heroku config:set NODE_ENV="production"
   heroku config:set FRONTEND_URL="https://your-frontend-domain.com"
   ```

3. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy backend"
   git push heroku main
   ```

#### Frontend Deployment

1. **Create Heroku App**
   ```bash
   cd frontend
   heroku create your-app-name-frontend
   ```

2. **Set Buildpack**
   ```bash
   heroku buildpacks:set mars/create-react-app
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set REACT_APP_API_URL="https://your-backend-app.herokuapp.com"
   heroku config:set NODE_ENV="production"
   ```

4. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy frontend"
   git push heroku main
   ```

### Option 2: AWS Deployment

#### Backend (EC2)

1. **Launch EC2 Instance**
   - Choose Ubuntu 20.04 LTS
   - Configure security groups to allow port 5001

2. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install nodejs npm
   sudo npm install -g pm2
   ```

3. **Deploy Application**
   ```bash
   git clone your-repo
   cd backend
   npm install
   pm2 start server.js --name "food-donation-backend"
   pm2 startup
   pm2 save
   ```

#### Frontend (S3 + CloudFront)

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Upload to S3**
   - Create S3 bucket
   - Enable static website hosting
   - Upload build folder contents

3. **Configure CloudFront**
   - Create distribution pointing to S3
   - Configure custom domain (optional)

### Option 3: DigitalOcean App Platform

1. **Connect Repository**
   - Connect your GitHub repository
   - Select the backend directory for backend service
   - Select the frontend directory for frontend service

2. **Configure Environment Variables**
   - Set all required environment variables in the dashboard

3. **Deploy**
   - DigitalOcean will automatically build and deploy

## Security Considerations

### 1. Environment Variables
- Never commit `.env` files to version control
- Use strong, unique JWT secrets
- Rotate secrets regularly

### 2. CORS Configuration
- Only allow your frontend domain in CORS settings
- Remove wildcard origins in production

### 3. Database Security
- Use MongoDB Atlas with proper authentication
- Enable IP whitelist if possible
- Use connection strings with authentication

### 4. HTTPS
- Always use HTTPS in production
- Configure SSL certificates
- Redirect HTTP to HTTPS

## Monitoring and Maintenance

### 1. Health Checks
- The backend includes a health check endpoint: `/api/health`
- Set up monitoring to check this endpoint

### 2. Logging
- Use proper logging in production
- Consider using services like Loggly or Papertrail

### 3. Error Handling
- The app includes proper error handling
- Monitor for 500 errors and other issues

### 4. Performance
- Monitor response times
- Set up alerts for slow responses
- Consider caching strategies

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check FRONTEND_URL environment variable
   - Ensure frontend domain is allowed in CORS settings

2. **Database Connection Issues**
   - Verify MONGODB_URI is correct
   - Check network connectivity
   - Ensure IP is whitelisted (if required)

3. **JWT Token Issues**
   - Verify JWT_SECRET is set
   - Check token expiration settings

4. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for syntax errors

### Support

If you encounter issues:
1. Check the application logs
2. Verify environment variables
3. Test endpoints manually
4. Check network connectivity

## Post-Deployment Checklist

- [ ] Backend is accessible and responding
- [ ] Frontend is loading correctly
- [ ] User registration works
- [ ] User login works
- [ ] Food donation creation works
- [ ] Food donation listing works
- [ ] Task management works
- [ ] All forms submit successfully
- [ ] Error handling works properly
- [ ] HTTPS is configured
- [ ] Monitoring is set up
- [ ] Backups are configured
