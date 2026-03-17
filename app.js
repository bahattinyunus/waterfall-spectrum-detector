class WaterfallSpectrum {
    constructor() {
        this.fCanvas = document.getElementById('spectrum-canvas');
        this.wCanvas = document.getElementById('waterfall-canvas');
        this.fCtx = this.fCanvas.getContext('2d');
        this.wCtx = this.wCanvas.getContext('2d');
        
        this.width = 0;
        this.height = 0;
        this.isRunning = true;
        
        // Signal Stats
        this.dataSize = 512;
        this.fftData = new Float32Array(this.dataSize);
        this.noiseFloor = 15;
        this.gain = 50;
        this.threshold = 40;
        
        // Simulating Signals
        this.signals = [
            { freq: 0.2, amp: 60, width: 0.01, drift: 0.001 },
            { freq: 0.45, amp: 85, width: 0.005, drift: 0 },
            { freq: 0.8, amp: 40, width: 0.02, drift: -0.0005 }
        ];

        this.initEventListeners();
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.animate();
    }

    initEventListeners() {
        document.getElementById('toggle-scan').addEventListener('click', (e) => {
            this.isRunning = !this.isRunning;
            e.target.innerText = this.isRunning ? 'PAUSE' : 'RESUME';
            document.getElementById('scan-status').innerText = this.isRunning ? 'ACTIVE' : 'IDLE';
            document.getElementById('scan-status').className = this.isRunning ? 'active' : '';
        });

        document.getElementById('gain-slider').addEventListener('input', (e) => this.gain = parseInt(e.target.value));
        document.getElementById('noise-slider').addEventListener('input', (e) => this.noiseFloor = parseInt(e.target.value));
        document.getElementById('threshold-slider').addEventListener('input', (e) => this.threshold = parseInt(e.target.value));
        
        document.getElementById('reset-peak').addEventListener('click', () => {
            document.getElementById('peak-freq').innerText = '---';
        });
    }

    resize() {
        this.width = this.fCanvas.parentElement.clientWidth;
        this.fCanvas.width = this.width;
        this.fCanvas.height = this.fCanvas.parentElement.clientHeight;
        
        this.wCanvas.width = this.width;
        this.wCanvas.height = this.wCanvas.parentElement.clientHeight;
        
        // Initialize waterfall with black
        this.wCtx.fillStyle = '#0d1117';
        this.wCtx.fillRect(0, 0, this.wCanvas.width, this.wCanvas.height);
    }

    generateData() {
        for (let i = 0; i < this.dataSize; i++) {
            const x = i / this.dataSize;
            let val = Math.random() * this.noiseFloor;
            
            this.signals.forEach(sig => {
                const dist = Math.abs(x - sig.freq);
                if (dist < sig.width * 5) {
                    val += Math.exp(-Math.pow(dist / sig.width, 2)) * sig.amp * (this.gain / 50);
                }
                
                // Add some drift/movement to signals
                if (this.isRunning) {
                    sig.freq += sig.drift;
                    if (sig.freq > 1 || sig.freq < 0) sig.drift *= -1;
                }
            });
            
            this.fftData[i] = val;
        }
    }

    drawSpectrum() {
        const h = this.fCanvas.height;
        const w = this.fCanvas.width;
        
        this.fCtx.clearRect(0, 0, w, h);
        
        // Draw Grid
        this.fCtx.strokeStyle = '#30363d';
        this.fCtx.lineWidth = 1;
        for (let i = 0; i < 10; i++) {
            const gx = (w / 10) * i;
            this.fCtx.beginPath();
            this.fCtx.moveTo(gx, 0);
            this.fCtx.lineTo(gx, h);
            this.fCtx.stroke();
        }

        // Draw Threshold Line
        const ty = h - (this.threshold / 100) * h;
        this.fCtx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        this.fCtx.setLineDash([5, 5]);
        this.fCtx.beginPath();
        this.fCtx.moveTo(0, ty);
        this.fCtx.lineTo(w, ty);
        this.fCtx.stroke();
        this.fCtx.setLineDash([]);

        // Draw FFT Data
        this.fCtx.strokeStyle = '#00ffaa';
        this.fCtx.lineWidth = 2;
        this.fCtx.shadowBlur = 5;
        this.fCtx.shadowColor = 'rgba(0, 255, 170, 0.5)';
        this.fCtx.beginPath();
        
        let peakVal = 0;
        let peakX = 0;

        for (let i = 0; i < this.dataSize; i++) {
            const x = (i / this.dataSize) * w;
            const y = h - (this.fftData[i] / 100) * h;
            
            if (i === 0) this.fCtx.moveTo(x, y);
            else this.fCtx.lineTo(x, y);

            if (this.fftData[i] > peakVal) {
                peakVal = this.fftData[i];
                peakX = i;
            }
        }
        
        this.fCtx.stroke();
        this.fCtx.shadowBlur = 0;

        // Update Peak Telemetry
        if (peakVal > this.threshold) {
            const freqVal = (peakX / this.dataSize * 100).toFixed(2);
            document.getElementById('peak-freq').innerText = `${freqVal} MHz`;
            
            // Add to log if not already detected recently
            this.logDetection(freqVal);
        }
    }

    logDetection(freq) {
        const log = document.getElementById('detection-list');
        const now = new Date().toLocaleTimeString();
        if (log.children.length > 0 && log.firstChild.innerText.includes(freq)) return;
        
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerText = `[${now}] SIG DETECTED: ${freq} MHz`;
        log.insertBefore(entry, log.firstChild);
        
        if (log.children.length > 20) log.removeChild(log.lastChild);
    }

    updateWaterfall() {
        const w = this.wCanvas.width;
        const h = this.wCanvas.height;
        
        // Shift existing image down
        this.wCtx.drawImage(this.wCanvas, 0, 0, w, h, 0, 1, w, h);
        
        // Draw new top line
        const imgData = this.wCtx.createImageData(w, 1);
        for (let i = 0; i < w; i++) {
            const dataIdx = Math.floor((i / w) * this.dataSize);
            const val = this.fftData[dataIdx];
            
            const pixelIdx = i * 4;
            
            // Color mapping (Heatmap look)
            if (val > this.threshold) {
                imgData.data[pixelIdx] = 0;   // R
                imgData.data[pixelIdx+1] = 255; // G
                imgData.data[pixelIdx+2] = 170; // B
            } else {
                const intensity = (val / 100) * 255;
                imgData.data[pixelIdx] = 0;
                imgData.data[pixelIdx+1] = intensity * 0.5;
                imgData.data[pixelIdx+2] = intensity * 0.3;
            }
            imgData.data[pixelIdx+3] = 255; // A
        }
        
        this.wCtx.putImageData(imgData, 0, 0);
    }

    animate() {
        if (this.isRunning) {
            this.generateData();
            this.drawSpectrum();
            this.updateWaterfall();
        }
        requestAnimationFrame(() => this.animate());
    }
}

// Start Application
window.onload = () => {
    new WaterfallSpectrum();
};
