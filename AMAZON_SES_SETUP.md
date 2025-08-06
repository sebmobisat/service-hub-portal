# Amazon SES Setup Guide for Service Hub Portal

This guide explains how to set up Amazon SES (Simple Email Service) to send PIN emails to dealers in your Service Hub Portal application deployed on Railway.

## Prerequisites

1. **AWS Account**: You need an AWS account
2. **Railway Account**: Your application is deployed on Railway
3. **Domain**: A verified domain for sending emails (recommended)

## Step 1: Set up Amazon SES

### 1.1 Create AWS Account (if you don't have one)
- Go to [AWS Console](https://aws.amazon.com/)
- Create a new account or sign in to existing account

### 1.2 Access Amazon SES
- Go to [Amazon SES Console](https://console.aws.amazon.com/ses/)
- Select your preferred region (e.g., `us-east-1`)

### 1.3 Verify Email Addresses
**For Production (Recommended):**
1. Go to "Verified identities" in SES console
2. Click "Create identity"
3. Choose "Domain" and enter your domain (e.g., `mobisat.com`)
4. Follow the DNS verification steps
5. Wait for verification (can take up to 72 hours)

**For Testing (Quick Setup):**
1. Go to "Verified identities" in SES console
2. Click "Create identity"
3. Choose "Email address"
4. Enter the email address you want to send from (e.g., `noreply@yourdomain.com`)
5. Check your email and click the verification link

### 1.4 Request Production Access (if needed)
- If you're in sandbox mode, request production access
- Go to "Account dashboard" → "Sending statistics"
- Click "Request production access"
- Fill out the form with your use case

## Step 2: Create IAM User for SES

### 2.1 Create IAM User
1. Go to [IAM Console](https://console.aws.amazon.com/iam/)
2. Click "Users" → "Create user"
3. Name: `service-hub-ses-user`
4. Select "Programmatic access"

### 2.2 Attach SES Policy
1. Click "Attach policies directly"
2. Search for "AmazonSESFullAccess"
3. Select it and click "Next"
4. Review and create user

### 2.3 Get Access Keys
1. After creating the user, click on it
2. Go to "Security credentials" tab
3. Click "Create access key"
4. Choose "Application running outside AWS"
5. **IMPORTANT**: Copy the Access Key ID and Secret Access Key
6. Store them securely (you'll need them for Railway)

## Step 3: Configure Railway Environment Variables

### 3.1 Add Environment Variables to Railway
1. Go to your Railway project dashboard
2. Click on your service
3. Go to "Variables" tab
4. Add the following environment variables:

```bash
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
SES_FROM_EMAIL=noreply@yourdomain.com
```

### 3.2 Environment Variables Explained
- `AWS_REGION`: The AWS region where your SES is configured (e.g., `us-east-1`)
- `AWS_ACCESS_KEY_ID`: The access key from your IAM user
- `AWS_SECRET_ACCESS_KEY`: The secret key from your IAM user
- `SES_FROM_EMAIL`: The verified email address or domain you want to send from

## Step 4: Test Email Functionality

### 4.1 Check Email Service Status
Visit: `https://your-railway-app.railway.app/api/email/status`

You should see:
```json
{
  "success": true,
  "emailService": {
    "enabled": true,
    "region": "us-east-1",
    "fromEmail": "noreply@yourdomain.com",
    "hasCredentials": true
  }
}
```

### 4.2 Test PIN Request
1. Go to your login page
2. Enter a dealer email
3. Click "Send PIN"
4. Check if the dealer receives the email

## Step 5: Monitor and Troubleshoot

### 5.1 Check SES Console
- Go to SES Console → "Sending statistics"
- Monitor bounce and complaint rates
- Check delivery status

### 5.2 Check Railway Logs
- Go to Railway dashboard → your service → "Deployments"
- Click on latest deployment → "View logs"
- Look for email-related logs

### 5.3 Common Issues

**Issue: "Email service disabled"**
- Check if AWS credentials are set in Railway
- Verify IAM user has SES permissions

**Issue: "Email sending error"**
- Check if sender email is verified in SES
- Verify recipient email is valid
- Check SES sending limits

**Issue: "Access denied"**
- Verify IAM user has correct permissions
- Check if access keys are correct
- Ensure region matches SES configuration

## Step 6: Production Considerations

### 6.1 Domain Verification
- Use a verified domain instead of email address
- Set up proper DNS records
- Monitor domain reputation

### 6.2 Sending Limits
- Sandbox: 200 emails/day, 1 email/second
- Production: Request higher limits if needed
- Monitor usage and adjust as needed

### 6.3 Security
- Use IAM roles instead of access keys when possible
- Regularly rotate access keys
- Monitor SES activity logs

## Cost Estimation

Amazon SES pricing (as of 2024):
- **Free tier**: 62,000 emails/month when sent from EC2
- **Paid tier**: $0.10 per 1,000 emails
- **Data transfer**: Free within same region

For a typical Service Hub Portal with 100 dealers:
- Estimated cost: $1-5/month (depending on usage)

## Support

If you encounter issues:
1. Check Railway logs first
2. Verify SES configuration
3. Test with a simple email first
4. Contact AWS support if needed

## Security Notes

- Never commit AWS credentials to Git
- Use Railway's environment variables for secrets
- Regularly monitor SES activity
- Set up alerts for unusual activity 