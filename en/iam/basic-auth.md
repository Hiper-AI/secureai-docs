---
sidebar_position: 4
title: "Basic Auth"
---



# Basic Authentication

Basic authentication provides a simple username and password authentication method for SecureAI. Users authenticate against our database using their credentials, with optional multi-factor authentication support.

## What is Basic Authentication?

**Basic authentication** is a simple authentication method that uses username and password credentials to authenticate users against our database. It's the most straightforward authentication method available in SecureAI.

## Key Features

### **Simple Login**
- **Username and Password**: Users provide their credentials to log in
- **Database Authentication**: Credentials are verified against our database
- **Secure Storage**: Passwords are securely hashed and stored

### **Multi-Factor Authentication (MFA)**
- **Google Authenticator**: Users can enroll their Google Authenticator app
- **Microsoft Authenticator**: Support for Microsoft Authenticator app
- **QR Code Setup**: Easy enrollment process with QR codes
- **Backup Codes**: Recovery codes for account access

### **Email OTP Configuration**
- **Default Email OTP**: Email OTP is enabled by default as second factor
- **Per-User Disable**: Admins can disable email OTP for specific users
- **MFA Alternative**: Users can switch from email OTP to authenticator apps

## How It Works

### **Authentication Flow**
1. **User Login**: User enters username and password
2. **Credential Verification**: System checks credentials against database
3. **Second Factor**: Email OTP sent or MFA app code required
4. **Access Granted**: User gains access to SecureAI platform

### **Second Factor Behavior**
- **Before MFA Setup**: Email OTP is always required as second factor
- **After MFA Setup**: User can choose between email OTP or MFA code
- **Login Options**: User selects preferred second factor method during login
- **Fallback**: Email OTP remains available as backup option

## User Experience

### **First Time Login (Before MFA)**
- Enter username and password
- Receive email OTP as second factor
- Access SecureAI platform

### **MFA Setup Process**
1. **Navigate to Chat**: Go to "/chat-ai/new-chat" or any chat page
2. **Open Profile Menu**: Click profile image in top-right corner
3. **Access Settings**: Select "Settings" from dropdown
4. **Go to Security**: Click on "Security" tab
5. **Enable MFA**: Click "Enable Multi-Factor Authentication"
6. **Scan QR Code**: Use Google or Microsoft Authenticator to scan QR code
7. **Enter Code**: Input the 6-digit code from your authenticator app
8. **Save Backup Codes**: Store the generated backup codes securely

### **Login After MFA Setup**
- Enter username and password
- Choose second factor method:
  - **Email OTP**: Receive code via email
  - **MFA Code**: Enter code from authenticator app
- Access SecureAI platform

### **Backup Code Usage**
- Use backup codes if authenticator app is unavailable
- Each backup code can only be used once
- Generate new backup codes if needed



## Security Features

### **Password Security**
- **Strong Hashing**: Passwords are securely hashed
- **Database Storage**: Credentials stored in our database
- **Secure Transmission**: All authentication data encrypted

### **MFA Security**
- **Time-based Codes**: Authenticator apps generate time-based codes
- **Secure Enrollment**: QR code-based secure setup
- **Backup Recovery**: Backup codes for account recovery

### **Session Management**
- **Secure Sessions**: Encrypted session management
- **Timeout Protection**: Automatic session timeout
- **Concurrent Session Control**: Manage multiple active sessions





## Getting Started

1. **Enable Basic Auth**: Configure in admin panel
2. **Create User Accounts**: Set up user credentials
3. **Configure MFA**: Enable multi-factor authentication
4. **User Training**: Educate users on login process
5. **Monitor Usage**: Track authentication patterns

## Next Steps

- [Google Workspace](/en/iam/google-workspace) - Integrate with Google Workspace
- [Microsoft Entra ID](/en/iam/microsoft-entra-id) - Connect with Microsoft Entra ID
- [IAM Overview](/en/iam/overview) - Learn about identity management 
