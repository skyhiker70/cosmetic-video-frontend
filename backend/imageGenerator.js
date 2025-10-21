const OpenAI = require('openai');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function generateImages(prompts, sessionId) {
    const outputDir = path.join(__dirname, '../output/images');
    
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const imagePaths = [];

    for (let i = 0; i < prompts.length; i++) {
        try {
            console.log(`  Generating image ${i + 1}/${prompts.length}...`);
            
            // Generate image using DALL-E 3
            const response = await openai.images.generate({
                model: 'dall-e-3',
                prompt: prompts[i],
                n: 1,
                size: '1024x1792', // 9:16 aspect ratio (closest available)
                quality: 'standard',
                style: 'natural' // or 'vivid'
            });

            const imageUrl = response.data[0].url;
            
            // Download image
            const imageResponse = await axios.get(imageUrl, {
                responseType: 'arraybuffer'
            });

            const filename = `${sessionId}_${i + 1}.png`;
            const filepath = path.join(outputDir, filename);
            
            fs.writeFileSync(filepath, imageResponse.data);
            imagePaths.push(filepath);
            
            console.log(`  ✅ Image ${i + 1} saved: ${filename}`);

            // Rate limiting: wait 1 second between requests
            if (i < prompts.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

        } catch (error) {
            console.error(`  ❌ Failed to generate image ${i + 1}:`, error.message);
            throw new Error(`Image generation failed at image ${i + 1}: ${error.message}`);
        }
    }

    return imagePaths;
}

module.exports = { generateImages };
