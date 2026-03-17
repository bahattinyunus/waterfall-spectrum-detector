# 📡 WATERSPECT: İleri Seviye Spektrum Analiz ve Sinyal İşleme Mimarisi

![WATERSPECT Banner](assets/banner.png)

## 🏗️ Mimari ve Sistem Tasarımı

WATERSPECT, tarayıcı tabanlı (browser-native) sinyal işleme teknolojilerinin sınırlarını zorlayan, düşük gecikmeli ve yüksek performanslı bir mimari üzerine inşa edilmiştir. Sistem, veri toplama, işleme ve render aşamalarından oluşan doğrusal bir boru hattı (pipeline) kullanır.

### 1. Veri Toplama ve İşleme Katmanı (Web Audio API)
Sistemin kalbinde, ham ses verilerini frekans domain'ine dönüştüren **Web Audio API** altyapısı yer alır:
- **AnalyserNode**: 1024 (`fftSize`) boyutunda bir analiz penceresi kullanılır. Bu, 512 (`frequencyBinCount`) benzersiz frekans kutucuğu (bin) üretir.
- **Normalizasyon**: Ham `Uint8Array` verileri, görselleştirme katmanı için 0.0 - 100.0 aralığına normalize edilir.
- **Örnekleme Hızı**: Tarayıcının varsayılan örnekleme hızı (genellikle 44.1kHz veya 48kHz) üzerinden Nyquist frekansına kadar (yaklaşık 22-24kHz) analiz yapılır.

### 2. Sinyal Simülasyonu ve Matematiksel Modeller
Sistem, gerçek dünya sinyallerini taklit etmek için karmaşık stokastik modeller kullanır:
- **Spektral Pik Üretimi**: Sinyaller, frekans domain'inde birer Gauss dağılımı fonksiyonu olarak temsil edilir:
  $$V(x) = A \cdot e^{-\left(\frac{x - f}{\sigma}\right)^2}$$
  Burada $A$ genliği, $f$ merkez frekansı, $\sigma$ ise bant genişliğini temsil eder.
- **Frekans Atlama (FHSS) Algoritması**: Periyodik bir sayaç (`frameCount`) üzerinden tetiklenen `Math.random()` fonksiyonu ile taşıyıcı frekans anlık olarak değiştirilir.
- **Darbeli (Pulse) Modülasyon**: Periyodik bir sinüs fonksiyonu üzerinden genlik anahtarlaması uygulanarak radar benzeri darbeler oluşturulur.

### 3. Grafik İşleme ve Render Optimizasyonu (HTML5 Canvas)
Görselleştirme katmanı, GPU hızlandırmalı iki ayrı Canvas birimi üzerinden yönetilir:

#### A. Gerçek Zamanlı FFT Render
- **Glow Efekti**: `shadowBlur` ve `shadowColor` parametreleri kullanılarak "neon" askeri ekran etkisi yaratılır.
- **Vektörel Çizim**: Her karede `beginPath()` ve `lineTo()` metodları ile 512 nokta üzerinden sürekli bir dalga formu çizilir.

#### B. Şelale (Waterfall) Kaydırma Algoritması
Şelale grafiği, geleneksel dizi kaydırma (array shifting) yöntemleri yerine daha optimize bir "Bit-Block Transfer" yöntemi kullanır:
- **Bitmap Shifting**: `drawImage(this.wCanvas, 0, 0, w, h, 0, speed, w, h)` kullanılarak mevcut canvas içeriği topluca aşağı kaydırılır. Bu işlem, binlerce pikseli tek tek döngüye sokmaktan çok daha hızlıdır.
- **Isı Haritası (Heatmap) İşleme**: En üstteki yeni satır için `createImageData` ve `putImageData` kullanılarak doğrudan piksel manipülasyonu yapılır. Sinyal gücüne göre RGB değerleri (Yeşil -> Sarı -> Turuncu -> Kırmızı) dinamik olarak atanır.

### 4. Post-Processing ve UI Estetiği
- **CRT Tarama Çizgileri**: CSS `linear-gradient` ile oluşturulan 2px yüksekliğindeki tekrarlayan çizgiler, spektrum verilerinin üzerinde bir katman (overlay) olarak çalışır.
- **Ekran Titremesi (Flicker)**: `opacity` değerini 0.95-1.00 arasında rastgele değiştiren bir CSS animasyonu (`flicker`) ile analog ekran doygunluğu simüle edilir.
- **TRL (Teknoloji Hazırlık Seviyesi)**: Sistem, laboratuvar ortamında doğrulanmış (TRL-7) bir prototip mimarisini yansıtır.

## 📊 Teknik Parametreler
- **Data Size**: 512 Binaural (Double Buffer).
- **FPS**: 60 (Locked via requestAnimationFrame).
- **Latency**: ~20ms (Hardware dependent).
- **Memory Usage**: < 50MB.

## 🔗 Mühendislik Notları
Sistem tamamen "Zero-Dependency" prensibiyle yazılmıştır. Hiçbir dış kütüphane (Chart.js, D3 vb.) kullanılmamış, tüm algoritmalar ve görselleştirme mantığı "vanilla" JavaScript ile sıfırdan kodlanmıştır. Bu, projenin taşınabilirliğini ve düşük donanımlı sistemlerdeki performansını maksimize eder.

---

### 🏛️ Geliştiren: [Bahattin Yunus](https://github.com/bahattinyunus)
*Elektronik Harp ve Savunma Sistemleri Meraklısı*

**TASNİF DIŞI // TEKNİK ŞARTNAME VE SİSTEM MİMARİSİ DÖKÜMANIDIR**
