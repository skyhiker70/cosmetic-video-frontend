const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

async function createVideo(imagePaths, sessionId, concept) {
    return new Promise((resolve, reject) => {
        const outputDir = path.join(__dirname, '../output/videos');
        
        // Ensure output directory exists
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputPath = path.join(outputDir, `${sessionId}.mp4`);
        
        // Create input file list for ffmpeg
        const listPath = path.join(outputDir, `${sessionId}_list.txt`);
        const listContent = imagePaths.map(imgPath => 
            `file '${imgPath}'\nduration 2`
        ).join('\n') + `\nfile '${imagePaths[imagePaths.length - 1]}'`; // Repeat last frame
        
        fs.writeFileSync(listPath, listContent);

        console.log('  Creating video with ffmpeg...');

        // Use ffmpeg to create video
        ffmpeg()
            .input(listPath)
            .inputOptions(['-f concat', '-safe 0'])
            .outputOptions([
                '-c:v libx264',           // H.264 codec
                '-pix_fmt yuv420p',        // Pixel format for compatibility
                '-preset medium',          // Encoding speed/quality balance
                '-crf 23',                 // Quality (lower = better, 18-28 is good range)
                '-vf scale=1080:1920',     // 9:16 Instagram Reel size
                '-r 30'                    // 30 fps
            ])
            .output(outputPath)
            .on('start', (commandLine) => {
                console.log('  FFmpeg command:', commandLine);
            })
            .on('progress', (progress) => {
                if (progress.percent) {
                    console.log(`  Progress: ${Math.floor(progress.percent)}%`);
                }
            })
            .on('end', () => {
                console.log('  ✅ Video created successfully!');
                
                // Clean up temporary list file
                try {
                    fs.unlinkSync(listPath);
                } catch (e) {
                    console.warn('  Warning: Could not delete temp file:', e.message);
                }
                
                resolve(outputPath);
            })
            .on('error', (err) => {
                console.error('  ❌ FFmpeg error:', err.message);
                
                // Clean up on error
                try {
                    fs.unlinkSync(listPath);
                } catch (e) {}
                
                reject(new Error(`Video creation failed: ${err.message}`));
            })
            .run();
    });
}

// Alternative: Create video with transition effects
async function createVideoWithEffects(imagePaths, sessionId, concept) {
    return new Promise((resolve, reject) => {
        const outputDir = path.join(__dirname, '../output/videos');
        
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputPath = path.join(outputDir, `${sessionId}.mp4`);
        
        // Create complex filter for fade transitions
        const filterComplex = [];
        const inputs = [];
        
        imagePaths.forEach((imgPath, i) => {
            inputs.push(`-loop 1 -t 2.5 -i "${imgPath}"`);
            
            if (i === 0) {
                filterComplex.push(`[0:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,setsar=1,fade=t=out:st=2:d=0.5[v0]`);
            } else if (i === imagePaths.length - 1) {
                filterComplex.push(`[${i}:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,setsar=1,fade=t=in:st=0:d=0.5[v${i}]`);
            } else {
                filterComplex.push(`[${i}:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,setsar=1,fade=t=in:st=0:d=0.5,fade=t=out:st=2:d=0.5[v${i}]`);
            }
        });
        
        const concatFilter = imagePaths.map((_, i) => `[v${i}]`).join('') + `concat=n=${imagePaths.length}:v=1:a=0[outv]`;
        filterComplex.push(concatFilter);

        const command = `ffmpeg ${inputs.join(' ')} -filter_complex "${filterComplex.join(';')}" -map "[outv]" -c:v libx264 -pix_fmt yuv420p -preset medium -crf 23 -r 30 "${outputPath}"`;
        
        console.log('  FFmpeg command:', command);
        
        // Note: This is more complex and might need adjustment
        // For simplicity, we'll use the basic version above
        reject(new Error('Advanced effects not implemented yet. Use createVideo() instead.'));
    });
}

module.exports = { createVideo, createVideoWithEffects };
