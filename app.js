class WaterfallSpectrum {
    constructor() {
        this.fCanvas = document.getElementById('spectrum-canvas');
        this.wCanvas = document.getElementById('waterfall-canvas');
        this.fCtx = this.fCanvas.getContext('2d');
        this.wCtx = this.wCanvas.getContext('2d');
        
        this.width = 0;
        this.height = 0;
        this.isRunning = true;
        this.sourceType = 'sim'; // 'sim' veya 'live'
        
        // Ses Analiz Ayarları
        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.dataArray = null;
        
        // Simülasyon Verileri
        this.dataSize = 512;
        this.fftData = new Float32Array(this.dataSize);
        this.noiseFloor = 15;
        this.gain = 50;
        this.threshold = 40;
        this.speed = 1;
        this.signalType = 'fixed';
        this.frameCount = 0;
        
        this.signals = [
            { freq: 0.2, amp: 60, width: 0.01, drift: 0.001, type: 'fixed' },
            { freq: 0.45, amp: 85, width: 0.005, drift: 0, type: 'fixed' },
            { freq: 0.8, amp: 40, width: 0.02, drift: -0.0005, type: 'fixed' }
        ];

        this.initEventListeners();
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.animate();
    }

    async initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = this.dataSize * 2;
            this.microphone.connect(this.analyser);
            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
            return true;
        } catch (err) {
            console.error('Mikrofon erişimi reddedildi:', err);
            alert('Gerçek zamanlı analiz için mikrofon izni gereklidir.');
            return false;
        }
    }

    initEventListeners() {
        document.getElementById('toggle-scan').addEventListener('click', (e) => {
            this.isRunning = !this.isRunning;
            e.target.innerText = this.isRunning ? 'DURAKLAT' : 'DEVAM ET';
            document.getElementById('scan-status').innerText = this.isRunning ? 'AKTİF' : 'BEKLEMEDE';
            document.getElementById('scan-status').className = this.isRunning ? 'active' : '';
        });

        document.getElementById('audio-source').addEventListener('change', async (e) => {
            if (e.target.value === 'live') {
                const success = await this.initAudio();
                if (success) {
                    this.sourceType = 'live';
                } else {
                    e.target.value = 'sim';
                }
            } else {
                this.sourceType = 'sim';
            }
        });

        document.getElementById('gain-slider').addEventListener('input', (e) => this.gain = parseInt(e.target.value));
        document.getElementById('noise-slider').addEventListener('input', (e) => this.noiseFloor = parseInt(e.target.value));
        document.getElementById('threshold-slider').addEventListener('input', (e) => this.threshold = parseInt(e.target.value));
        document.getElementById('speed-slider').addEventListener('input', (e) => this.speed = parseInt(e.target.value));
        document.getElementById('signal-type').addEventListener('change', (e) => this.signalType = e.target.value);
        
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
        this.wCtx.fillStyle = '#0d1117';
        this.wCtx.fillRect(0, 0, this.wCanvas.width, this.wCanvas.height);
    }

    updateData() {
        if (this.sourceType === 'live' && this.analyser) {
            this.analyser.getByteFrequencyData(this.dataArray);
            for (let i = 0; i < this.dataSize; i++) {
                this.fftData[i] = (this.dataArray[i] / 255) * 100 * (this.gain / 50);
            }
        } else {
            this.generateSimulatedData();
        }
    }

    generateSimulatedData() {
        this.frameCount++;
        for (let i = 0; i < this.dataSize; i++) {
            const x = i / this.dataSize;
            let val = Math.random() * this.noiseFloor;
            
            this.signals.forEach(sig => {
                const dist = Math.abs(x - sig.freq);
                if (dist < sig.width * 5) {
                    val += Math.exp(-Math.pow(dist / sig.width, 2)) * sig.amp * (this.gain / 50);
                }
                if (this.isRunning) {
                    sig.freq += sig.drift;
                    if (sig.freq > 1 || sig.freq < 0) sig.drift *= -1;
                }
            });

            if (this.signalType === 'hop' && this.frameCount % 20 === 0) {
                this.hopFreq = Math.random();
            }
            if (this.signalType === 'hop' && this.hopFreq) {
                const dist = Math.abs(x - this.hopFreq);
                if (dist < 0.01) val += 70 * (this.gain / 50);
            }

            if (this.signalType === 'pulse') {
                const isPulseOn = Math.sin(this.frameCount * 0.2) > 0.5;
                if (isPulseOn) {
                    const dist = Math.abs(x - 0.6);
                    if (dist < 0.02) val += 90 * (this.gain / 50);
                }
            }
            this.fftData[i] = Math.min(val, 100);
        }
    }

    drawSpectrum() {
        const h = this.fCanvas.height;
        const w = this.fCanvas.width;
        this.fCtx.clearRect(0, 0, w, h);
        
        // Izgara
        this.fCtx.strokeStyle = '#30363d';
        this.fCtx.lineWidth = 1;
        for (let i = 0; i <= 10; i++) {
            const gx = (w / 10) * i;
            this.fCtx.beginPath();
            this.fCtx.moveTo(gx, 0); this.fCtx.lineTo(gx, h);
            this.fCtx.stroke();
            this.fCtx.fillStyle = '#444';
            this.fCtx.font = '8px JetBrains Mono';
            this.fCtx.fillText(`${i * 10}`, gx + 2, h - 5);
        }

        // Eşik
        const ty = h - (this.threshold / 100) * h;
        this.fCtx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        this.fCtx.setLineDash([5, 5]);
        this.fCtx.beginPath();
        this.fCtx.moveTo(0, ty); this.fCtx.lineTo(w, ty);
        this.fCtx.stroke();
        this.fCtx.setLineDash([]);

        // Çizim
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

        if (peakVal > this.threshold) {
            const freqVal = (peakX / this.dataSize * 100).toFixed(2);
            document.getElementById('peak-freq').innerText = `${freqVal} MHz`;
            this.logDetection(freqVal);
        }
    }

    logDetection(freq) {
        const log = document.getElementById('detection-list');
        const now = new Date().toLocaleTimeString();
        if (log.children.length > 0 && log.firstChild.innerText.includes(freq)) return;
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerText = `[${now}] SİNYAL TESPİT EDİLDİ: ${freq} MHz`;
        log.insertBefore(entry, log.firstChild);
        if (log.children.length > 20) log.removeChild(log.lastChild);
    }

    updateWaterfall() {
        const w = this.wCanvas.width;
        const h = this.wCanvas.height;
        this.wCtx.drawImage(this.wCanvas, 0, 0, w, h, 0, this.speed, w, h);
        const imgData = this.wCtx.createImageData(w, this.speed);
        for (let row = 0; row < this.speed; row++) {
            for (let i = 0; i < w; i++) {
                const dataIdx = Math.floor((i / w) * this.dataSize);
                const val = this.fftData[dataIdx];
                const pixelIdx = (row * w + i) * 4;
                if (val > this.threshold) {
                    imgData.data[pixelIdx] = 255;
                    imgData.data[pixelIdx+1] = Math.max(0, 255 - (val - this.threshold) * 5);
                    imgData.data[pixelIdx+2] = 0;
                } else {
                    const intensity = (val / 100) * 255;
                    imgData.data[pixelIdx] = 0;
                    imgData.data[pixelIdx+1] = intensity * 0.8;
                    imgData.data[pixelIdx+2] = intensity * 0.5;
                }
                imgData.data[pixelIdx+3] = 255;
            }
        }
        this.wCtx.putImageData(imgData, 0, 0);
    }

    animate() {
        if (this.isRunning) {
            this.updateData();
            this.drawSpectrum();
            this.updateWaterfall();
        }
        requestAnimationFrame(() => this.animate());
    }
}

window.onload = () => {
    new WaterfallSpectrum();
};
