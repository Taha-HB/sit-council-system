# 🏛️ SIT Council Meeting Management System

![SIT Council Banner](https://img.shields.io/badge/SIT-Council%20System-blueviolet)
![Version](https://img.shields.io/badge/version-3.0.0-success)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Termux%20%7C%20GitHub%20Pages-orange)
https://taha-hb.github.io/sit-council-system/

A **complete, professional meeting management system** for Student Council with PDF minutes generation, member management, and real-time collaboration. Works on **Termux (Android)** and **GitHub Pages** simultaneously.

## ✨ Features

### 🎯 Core Features
- **📊 Complete Meeting Management** - Schedule, organize, and track meetings
- **📄 Professional PDF Generation** - Create official minutes matching your format
- **👥 Member Management** - All 10 council members with profiles
- **🔐 Role-Based Access** - Secretary controls minutes, members have limited access
- **🌓 Dark/Light Mode** - Toggle between themes
- **📱 Fully Responsive** - Works on mobile, tablet, and desktop

### 🏆 Performance & Recognition
- **👑 Man of the Week** - Automatic recognition for top performers
- **📈 Performance Tracking** - Monitor member engagement and task completion
- **🏅 Leaderboard** - Competitive performance ranking system
- **📊 Analytics Dashboard** - Real-time statistics and insights

### 🔧 Advanced Tools
- **📝 Agenda Builder** - Create structured meeting agendas
- **📎 File Upload System** - Drag & drop document management
- **🔔 Notifications** - Meeting reminders and updates
- **🗃️ Archive System** - Organized meeting storage and retrieval
- **🔍 Search & Filter** - Quick access to meetings and minutes
- **📤 Export/Import** - Backup and restore functionality

### 🔐 Authentication
- **📧 Email/Password Login** - Traditional authentication
- **🔵 Google Sign-In** - One-click Google authentication
- **👤 Role Management** - Different permissions for each role
- **🔒 Secure Sessions** - Protected user sessions

## 🚀 Quick Start

### Option 1: GitHub Pages (Easiest - No Installation)
1. **Save the HTML code** as `index.html`
2. **Create a new repository** on GitHub
3. **Upload `index.html`** to your repository
4. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Source: Select `main` branch
   - Folder: `/ (root)`
   - Click Save
5. **Access your site**: `https://yourusername.github.io/sit-council-system`

### Option 2: Termux (Full Stack on Android)
```bash
# Install Termux from F-Droid (NOT Play Store)
# Then run these commands:

pkg update && pkg upgrade -y
pkg install git nodejs python -y

# Create the project
mkdir sit-council-system
cd sit-council-system

# Create index.html and paste your code
nano index.html
# [Paste your HTML code here, then Ctrl+X, Y, Enter]

# Start the server
python -m http.server 8080
