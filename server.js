const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// File upload configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: function (req, file, cb) {
        const filetypes = /pdf|doc|docx|jpg|jpeg|png|txt/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only document and image files are allowed'));
    }
});

// Database simulation
let database = {
    users: [
        {
            id: 1,
            firstName: 'Ibrahim',
            lastName: 'Mohammed',
            email: 'president@sit.edu',
            role: 'President',
            studentId: 'SIT2023001',
            avatar: 'IM',
            password: 'password123'
        },
        // ... other users as defined in frontend
    ],
    meetings: [],
    minutes: [],
    announcements: []
};

// Authentication middleware
const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    // Simple token validation (in production, use JWT)
    next();
};

// Check if user is secretary
const isSecretary = (req, res, next) => {
    const user = req.user;
    if (user.role !== 'Secretary') {
        return res.status(403).json({ error: 'Secretary access required' });
    }
    next();
};

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'SIT Council API is running' });
});

// Authentication routes
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = database.users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // In production, generate JWT token
        const token = Buffer.from(JSON.stringify({ id: user.id, email: user.email })).toString('base64');
        res.json({ 
            success: true, 
            user: { ...user, password: undefined },
            token 
        });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Google authentication
app.post('/api/auth/google', (req, res) => {
    const { token } = req.body;
    // In production, verify Google token
    // For demo, create/return a user
    res.json({ 
        success: true, 
        user: { 
            id: 1000, 
            firstName: 'Google', 
            lastName: 'User',
            email: 'google@example.com',
            role: 'Member',
            avatar: 'GU'
        },
        token: 'google-token-' + Date.now()
    });
});

// Meetings routes
app.get('/api/meetings', authenticate, (req, res) => {
    res.json(database.meetings);
});

app.post('/api/meetings', authenticate, (req, res) => {
    const meeting = {
        id: Date.now(),
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    database.meetings.push(meeting);
    res.json({ success: true, meeting });
});

// Minutes routes (Secretary only)
app.post('/api/minutes', authenticate, isSecretary, (req, res) => {
    const minutes = {
        id: Date.now(),
        ...req.body,
        createdBy: req.user.id,
        createdAt: new Date().toISOString()
    };
    database.minutes.push(minutes);
    res.json({ success: true, minutes });
});

// File upload
app.post('/api/upload', authenticate, upload.array('files', 10), (req, res) => {
    const files = req.files.map(file => ({
        name: file.originalname,
        url: `/uploads/${file.filename}`,
        size: file.size,
        type: file.mimetype
    }));
    res.json({ success: true, files });
});

// Generate PDF
app.post('/api/generate-pdf', authenticate, (req, res) => {
    const { meetingId, template } = req.body;
    // In production, use a PDF library like pdfkit or puppeteer
    res.json({ 
        success: true, 
        message: 'PDF generated successfully',
        downloadUrl: `/api/pdf/${Date.now()}.pdf`
    });
});

// Announcements
app.get('/api/announcements', authenticate, (req, res) => {
    res.json(database.announcements);
});

app.post('/api/announcements', authenticate, (req, res) => {
    const announcement = {
        id: Date.now(),
        ...req.body,
        createdAt: new Date().toISOString(),
        author: req.user.name || `${req.user.firstName} ${req.user.lastName}`
    };
    database.announcements.push(announcement);
    res.json({ success: true, announcement });
});

// Archive meetings
app.put('/api/meetings/:id/archive', authenticate, isSecretary, (req, res) => {
    const meetingId = parseInt(req.params.id);
    const meeting = database.meetings.find(m => m.id === meetingId);
    
    if (meeting) {
        meeting.archived = true;
        meeting.archivedAt = new Date().toISOString();
        res.json({ success: true, meeting });
    } else {
        res.status(404).json({ success: false, message: 'Meeting not found' });
    }
});

// Dashboard stats
app.get('/api/dashboard/stats', authenticate, (req, res) => {
    const stats = {
        totalMeetings: database.meetings.length,
        upcomingMeetings: database.meetings.filter(m => new Date(m.date) > new Date()).length,
        completedTasks: 0, // Calculate from tasks
        memberCount: database.users.length,
        averageAttendance: 85 // Calculate from meeting attendance
    };
    res.json(stats);
});

// Leaderboard
app.get('/api/leaderboard', authenticate, (req, res) => {
    const leaderboard = database.users.map(user => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
        avatar: user.avatar,
        performance: Math.floor(Math.random() * 100), // Calculate actual performance
        tasksCompleted: Math.floor(Math.random() * 50),
        meetingsAttended: Math.floor(Math.random() * 30)
    })).sort((a, b) => b.performance - a.performance);
    
    res.json(leaderboard);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API URL: http://localhost:${PORT}`);
});
