const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const { generatePrompt } = require('./promptGenerator');
const { generateImages } = require('./imageGenerator');
const { createVideo } = require('./videoGenerator');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/output', express.static(path.join(__dirname, '../output')));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Main generation endpoint
app.post('/api/generate', async (req, res) => {
    const { concept, style, color, mood } = req.body;
    
    if (!concept) {
        return res.status(400).json({ error: 'Concept is required' });
    }

    const sessionId = uuidv4();
    console.log(`[${sessionId}] Starting generation for concept: "${concept}"`);

    try {
        // Step 1: Generate AI prompts
        console.log(`[${sessionId}] Step 1: Generating prompts...`);
        const prompts = await generatePrompt(concept, style, color, mood);
        
        // Step 2: Generate images
        console.log(`[${sessionId}] Step 2: Generating images...`);
        const imagePaths = await generateImages(prompts, sessionId);
        
        // Step 3: Create video
        console.log(`[${sessionId}] Step 3: Creating video...`);
        const videoPath = await createVideo(imagePaths, sessionId, concept);
        
        console.log(`[${sessionId}] ✅ Generation completed!`);
        
        res.json({
            success: true,
            sessionId,
            videoUrl: `/output/videos/${path.basename(videoPath)}`,
            imageUrls: imagePaths.map(p => `/output/images/${path.basename(p)}`),
            concept,
            style,
            color,
            mood
        });

    } catch (error) {
        console.error(`[${sessionId}] ❌ Error:`, error.message);
        res.status(500).json({ 
            error: 'Generation failed', 
            message: error.message 
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Output directory: ${path.join(__dirname, '../output')}`);
    
    if (!process.env.OPENAI_API_KEY) {
        console.warn('⚠️  WARNING: OPENAI_API_KEY not set in .env file');
    }
});
