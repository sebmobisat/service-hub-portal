# Localhost Development Setup Guide

This guide will help you set up localhost to work exactly like the production environment.

## 🚀 Quick Setup

### 1. Create Local Environment File
```bash
# Copy the example file
cp env.local.example .env.local

# Edit the file with your credentials
notepad .env.local
```

### 2. Configure Environment Variables

Edit `.env.local` and fill in your values:

```env
# Supabase Configuration (Required for PIN storage)
SUPABASE_URL=https://ivgzcwnmjeetdiccijmp.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2Z3pjd25tamVldGRpY2Npam1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDc2ODksImV4cCI6MjA2OTIyMzY4OX0.ThFPu3_1kBiCF472QXjuH93SScql3i7NzF6Sg6wjMac
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2Z3pjd25tamVldGRpY2Npam1wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzY0NzY4OSwiZXhwIjoyMDY5MjIzNjg5fQ.pg_P_KKVq_ATan8YR5btGAK0HUe0TVzILHx_VwCmWPs

# Amazon SES Configuration (Required for email)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key_here
SES_FROM_EMAIL=noreply@servicehub.mobisat.com

# Development Settings
NODE_ENV=development
DEBUG=true
```

### 3. Start Development Server

**Option A: Using the batch script (Windows)**
```bash
start-dev.bat
```

**Option B: Manual start**
```bash
set NODE_ENV=development
npm run dev
```

## 🔧 Required Setup

### 1. Supabase Table Setup
The `dealer_pins` table must exist in your Supabase project:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/[YOUR_PROJECT]/sql)
2. Run the SQL from `supabase-dealer-pins-table.sql`
3. Verify the table exists

### 2. AWS SES Configuration
For email functionality:

1. **Get AWS Credentials** (if you don't have them):
   - Go to AWS Console → IAM → Users
   - Create a new user with SES permissions
   - Generate access keys

2. **Verify Email Domain** (if not already done):
   - Go to AWS SES → Verified identities
   - Verify your domain or email address

### 3. Test the Setup

Verifica il flusso direttamente dall'app (richiesta PIN e invio email). I vecchi script di test standalone sono stati rimossi.

## 🐛 Troubleshooting

### Issue: PINs not stored in database
**Solution**: Controlla la connessione a Supabase e i log del server; gli script di test separati non sono più presenti.

### Issue: Emails not sent
**Solution**: Check AWS SES configuration
```bash
# Check email service status
curl http://localhost:3000/api/email/status
```

### Issue: Environment variables not loaded
**Solution**: Verify `.env.local` file exists and has correct format
```bash
# Check if file exists
dir .env.local

# Check environment variables
echo %NODE_ENV%
echo %SUPABASE_URL%
```

### Issue: Port already in use
**Solution**: Kill existing process
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F
```

## 🔍 Debug Mode

When `DEBUG=true` is set, you'll see detailed logs:

```
🔐 Attempting to store PIN for dealer 123 in Supabase...
📅 Expires at: 2024-01-15T10:30:00.000Z
✅ PIN stored successfully in Supabase for dealer 123
📊 Supabase response data: [{...}]
```

## 📊 Environment Comparison

| Feature | Production (Railway) | Localhost |
|---------|---------------------|-----------|
| Database | PostgreSQL (read-only) | ✅ Same |
| PIN Storage | Supabase | ✅ Same |
| Email Service | AWS SES | ✅ Same |
| Environment | Railway variables | `.env.local` |
| Debug Logs | Limited | ✅ Full |

## 🚨 Common Issues

### 1. "PIN storage failed"
- Check Supabase credentials in `.env.local`
- Verify `dealer_pins` table exists
- Check network connectivity

### 2. "Email sending failed"
- Check AWS SES credentials
- Verify email domain is verified
- Check AWS region setting

### 3. "Database connection failed"
- Check PostgreSQL credentials
- Verify network access to database
- Check SSL settings

## ✅ Verification Checklist

- [ ] `.env.local` file created and configured
- [ ] Supabase credentials working
- [ ] AWS SES credentials working
- [ ] `dealer_pins` table exists in Supabase
- [ ] Development server starts without errors
- [ ] PIN generation and storage works
- [ ] Email sending works (or fallback shows PIN)
- [ ] Language switching works
- [ ] Authentication flow works

## 🆘 Getting Help

If you encounter issues:

1. **Check the logs**: Look for error messages in the console
2. **Run tests**: Esegui i test direttamente dal flusso dell'app (richiesta/validazione PIN).
3. **Verify setup**: Follow the troubleshooting steps above
4. **Check environment**: Ensure all variables are set correctly

The localhost environment should now work exactly like production! 🎉 