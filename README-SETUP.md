# Service Hub Portal - Database Authentication Setup

## 🔐 New Authentication System

The login page now uses **real database authentication** with PIN-based security.

### 🏗️ Architecture

1. **Database**: PostgreSQL (Mobisat database)
2. **Backend**: Node.js Express server
3. **Authentication**: 2-step PIN verification
4. **Frontend**: Updated login page with real-time validation

### 🚀 Quick Start

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Server**:
   ```bash
   # Option 1: Use batch file (Windows)
   start-server.bat
   
   # Option 2: Direct command
   npm start
   
   # Option 3: Development mode with auto-reload
   npm run dev
   ```

3. **Access Portal**:
   - **Frontend**: http://localhost:3001
   - **API**: http://localhost:3001/api
   - **Login**: http://localhost:3001/pages/login.html

### 🔑 Authentication Flow

#### Step 1: Email Validation
- User enters their **dealer email**
- System validates email exists in `dealer` table
- Must match `companyLoginEmail` field
- Only **active dealers** can login

#### Step 2: PIN Verification
- System generates 6-digit PIN
- PIN expires in **5 minutes**
- Maximum **3 attempts** per PIN
- PIN displayed in console (development mode)

### 🎯 Testing Login

Use any valid dealer email from the database:
1. Enter dealer email (e.g., `dealer@company.com`)
2. Click "Send PIN"
3. Check console for PIN code
4. Enter the 6-digit PIN
5. Successfully login to dashboard

### 💾 Database Connection

- **Host**: devmobisat.ca15w70vfof5.eu-south-1.rds.amazonaws.com
- **Database**: mobisat
- **Table**: dealer
- **Key Field**: companyLoginEmail
- **Security**: Read-only access with SSL

### 📁 File Structure

```
service-hub-portal/
├── server.js              # Node.js backend server
├── package.json           # Dependencies
├── config/
│   └── database.js        # PostgreSQL connection
├── js/
│   └── auth.js            # Frontend authentication
├── pages/
│   └── login.html         # Updated login page
└── start-server.bat       # Easy server startup
```

### ⚡ Key Features

- ✅ **Real Database**: Connects to Mobisat PostgreSQL
- ✅ **Secure Authentication**: PIN-based 2FA system
- ✅ **Dealer Validation**: Only active dealers can login
- ✅ **Session Management**: 24-hour login sessions
- ✅ **Rate Limiting**: Prevents brute force attacks
- ✅ **Error Handling**: Clear user feedback
- ✅ **Development Mode**: PIN shown in console

### 🚨 Security Notes

- PINs expire after 5 minutes
- Maximum 3 attempts per PIN
- Session timeout after 24 hours
- Database uses read-only credentials
- SSL encryption for all connections

---

**Ready to go!** Run `start-server.bat` and test with real dealer emails! 🎯 