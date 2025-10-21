const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Style definitions
const STYLES = {
    minimal: 'minimalist, clean, simple composition, white space, elegant',
    luxury: 'luxurious, premium, sophisticated, gold accents, high-end',
    natural: 'natural, organic, botanical, earthy tones, sustainable',
    vibrant: 'vibrant, colorful, energetic, bold, eye-catching'
};

// Color palettes
const COLORS = {
    nude: 'nude beige tones, warm neutrals, natural skin tones',
    taupe: 'taupe gray, warm gray, sophisticated neutrals',
    sage: 'sage green, muted green, calming natural tones',
    mauve: 'mauve pink, dusty rose, soft purple-pink',
    slate: 'slate gray, cool gray, modern neutrals',
    cream: 'cream beige, soft ivory, warm vanilla tones'
};

async function generatePrompt(concept, style, color, mood) {
    const styleDesc = STYLES[style] || STYLES.minimal;
    const colorDesc = COLORS[color] || COLORS.nude;
    const moodDesc = mood < 50 ? 'cute, playful, friendly' : 'sophisticated, elegant, refined';

    // Generate detailed prompts using GPT-4
    const systemPrompt = `You are a professional cosmetics advertising creative director. 
Generate 4 detailed image prompts for Instagram Reel video frames about cosmetic products.
Each prompt should be visually stunning, product-focused, and suitable for 9:16 vertical format.
Focus on close-up shots, textures, and aesthetic presentation.`;

    const userPrompt = `Create 4 image prompts for: "${concept}"
Style: ${styleDesc}
Color palette: ${colorDesc}
Mood: ${moodDesc}

Requirements:
- Shot 1: Hero product shot with elegant background
- Shot 2: Close-up of product texture/detail
- Shot 3: Lifestyle or application scene
- Shot 4: Final branding shot with product

Return ONLY a JSON array with 4 prompts, no additional text.
Format: ["prompt1", "prompt2", "prompt3", "prompt4"]`;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            temperature: 0.8,
            max_tokens: 1000
        });

        const response = completion.choices[0].message.content.trim();
        
        // Parse JSON response
        const prompts = JSON.parse(response);
        
        if (!Array.isArray(prompts) || prompts.length !== 4) {
            throw new Error('Invalid prompts format');
        }

        console.log('✅ Generated prompts:', prompts);
        return prompts;

    } catch (error) {
        console.error('❌ GPT prompt generation failed:', error.message);
        
        // Fallback to template-based prompts
        console.log('⚠️  Using fallback prompts');
        return generateFallbackPrompts(concept, styleDesc, colorDesc, moodDesc);
    }
}

function generateFallbackPrompts(concept, styleDesc, colorDesc, moodDesc) {
    return [
        `Professional product photography of ${concept}, ${styleDesc}, ${colorDesc}, studio lighting, 9:16 vertical format, commercial photography, high resolution`,
        `Extreme close-up macro shot of ${concept} texture, ${colorDesc}, soft focus background, luxurious feel, beauty photography`,
        `Lifestyle scene with ${concept}, ${moodDesc} atmosphere, ${styleDesc} setting, natural lighting, Instagram-worthy, aesthetic composition`,
        `Minimal branding shot of ${concept}, ${styleDesc}, ${colorDesc}, clean white background, centered composition, professional beauty photography`
    ];
}

module.exports = { generatePrompt };
