function initWaveBackground() {
    const canvas = document.getElementById('waveBackground');
    const ctx = canvas.getContext('2d');
    
    const computedStyle = getComputedStyle(document.documentElement);
    const waveColor1 = computedStyle.getPropertyValue('--theme-wave1').trim();
    const waveColor2 = computedStyle.getPropertyValue('--theme-wave2').trim();
    
    let width, height, pixelRatio;
    let animationFrame;
    
    const waveConfig = {
        count: 12,
        wavelengthFactor: 0.5,
        thicknessFactor: 0.2,
        amplitudeFactor: 0.015,
        speed: 0.005,
        phaseOffset: 0,
        amplitudeVariation: 0.15
    };
    
    function resizeCanvas() {
        pixelRatio = window.devicePixelRatio || 1;
        width = window.innerWidth;
        height = window.innerHeight;
        
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        canvas.width = width * pixelRatio;
        canvas.height = height * pixelRatio;
        ctx.scale(pixelRatio, pixelRatio);
        
        waveConfig.wavelength = width * waveConfig.wavelengthFactor;
        waveConfig.thickness = height * waveConfig.thicknessFactor;
        waveConfig.amplitude = height * waveConfig.amplitudeFactor;
    }
    
    function animate() {
        ctx.fillStyle = waveColor1;
        ctx.fillRect(0, 0, width, height);
        
        waveConfig.phaseOffset = (waveConfig.phaseOffset + waveConfig.speed) % (Math.PI * 2);
        
        // Vertical padding to prevent visible gaps
        const verticalPadding = height * 0.2;
        const totalHeight = height + (verticalPadding * 2);
        const waveSpacing = totalHeight / (waveConfig.count - 1);
        
        const pi2 = Math.PI * 2;
        
        // Draw waves bottom to top
        for (let i = waveConfig.count - 1; i >= 0; i--) {
            const centerY = (waveSpacing * i) - verticalPadding;
            const color = i % 2 === 0 ? waveColor1 : waveColor2;
            const phaseShift = i * (Math.PI / 6);
            
            // Dynamic wave movement
            const amplitudeMod = 1 + 
                Math.sin(waveConfig.phaseOffset * 0.8 + i * 0.3) * waveConfig.amplitudeVariation;
            
            drawSmoothWave(
                centerY, 
                waveConfig.wavelength, 
                waveConfig.amplitude * amplitudeMod,
                color,
                waveConfig.thickness,
                waveConfig.phaseOffset + phaseShift,
                pi2
            );
        }
        
        animationFrame = requestAnimationFrame(animate);
    }
    
    function drawSmoothWave(centerY, wavelength, amplitude, color, thickness, phase, pi2) {
        ctx.fillStyle = color;
        ctx.beginPath();
        
        const halfThickness = thickness / 2;
        const pointsPerWave = Math.min(40, Math.max(20, wavelength / 10));
        const step = wavelength / pointsPerWave;
        
        const topEdgeOffset = halfThickness + amplitude;
        
        // Overlap edges to prevent rendering gaps
        ctx.moveTo(-20, -20);
        ctx.lineTo(width + 20, -20);
        ctx.lineTo(width + 20, centerY - topEdgeOffset);
        
        for (let x = width; x >= 0; x -= step) {
            const normalizedX = x / wavelength;
            const y = centerY + halfThickness + Math.sin(normalizedX * pi2 + phase) * amplitude;
            ctx.lineTo(x, y);
        }
        
        const leftEdgeBottomY = centerY + halfThickness + 
            Math.sin((0 / wavelength) * pi2 + phase) * amplitude;
        ctx.lineTo(-20, leftEdgeBottomY);
        ctx.lineTo(-20, -20);
        
        ctx.fill();
    }
    
    const handleResize = () => {
        resizeCanvas();
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
        animate();
    };
    
    const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
            animationFrame = requestAnimationFrame(animate);
        } else {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }
        }
    };
    
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    resizeCanvas();
    animate();
    
    return () => {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
}

document.addEventListener('DOMContentLoaded', initWaveBackground);