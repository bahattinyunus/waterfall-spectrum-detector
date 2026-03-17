# 📡 WATERSPECT: Teknik Analiz ve Spektrum Gözlem Platformu

![WATERSPECT Banner](assets/banner.png)

## 🛠️ Teknik Altyapı ve Mimarisi

WATERSPECT, tarayıcı tabanlı gerçek zamanlı sinyal işleme ve görselleştirme yeteneklerine odaklanmış, düşük gecikmeli (low-latency) bir platformdur. Projenin temel teknik bileşenleri aşağıda detaylandırılmıştır:

### 1. Sinyal İşleme Motoru (Core Engine)
-   **Web Audio API Entegrasyonu**: Canlı sinyal modunda, tarayıcının `AudioContext` birimi kullanılarak mikrofon veya sistem girişinden gelen veri akışı yakalanır. `AnalyserNode` aracılığıyla veriler frekans alanına (Frequency Domain) ayrıştırılır.
-   **Simülasyon Algoritması**: JavaScript üzerinde özel bir sinyal jeneratörü çalışır. Bu motor, rastgele gürültü (Gaussian-like noise) üzerine bindirilmiş Gauss dağılımlı spektral pikler üretir.
-   **Modülasyon Tipleri**:
    -   **Sabit Taşıyıcı**: Belirli bir frekans indeksinde sabit genlikli veri üretimi.
    -   **Frekans Atlama (FHSS)**: Periyodik zaman aralıklarında frekans indeksinin rastgele değiştirilmesi.
    -   **Darbeli (Pulse)**: Genliğin sinüs dalgası fonksiyonuna bağlı olarak açılıp kapatılması.

### 2. Görselleştirme ve Grafik İşleme
-   **FFT Analizörü (Line Chart)**: 512 örneklik veri seti, HTML5 Canvas üzerinde yüksek hızda çizilmektedir. Her karede (60 FPS) `requestAnimationFrame` döngüsüyle veriler normalize edilerek dikey eksende genlik, yatay eksende ise frekans olarak render edilir.
-   **Şelale Spektrogramı (Waterfall Canvas)**:
    -   **Piksel Manipülasyonu**: `putImageData` ve `drawImage` fonksiyonları kullanılarak yüksek performanslı kaydırma işlemi gerçekleştirilir. Mevcut canvas verisi dikeyde aşağı kaydırılır ve en üst satıra o anki FFT verileri ısı haritası skalasına (Heatmap) göre işlenir.
    -   **Performans**: Grafik işlemleri işlemciyi yormamak adına dikey kaydırma animasyonları Canvas API'nin dahili bitmap kopyalama fonksiyonları ile optimize edilmiştir.

### 3. Kullanıcı Arayüzü ve Kontrol Mekanizmaları
-   **Eşik Değeri (Thresholding)**: Sinyal piki tespiti için dinamik bir eşik hattı kullanılır. Veri setindeki değerlerden (val > threshold) olanlar filtrelenir ve zaman damgalı olarak DOM üzerinde listelenir.
-   **Kazanç ve Gürültü Kontrolü**: Gelen ham verinin genliği lineer kazanç (Gain) katsayısı ile çarpılarak dinamik aralık (Dynamic Range) yapay olarak genişletilebilir.
-   **Görsel Filtreler**: CSS `linear-gradient` ve `opacity` animasyonları kullanılarak CRT tarama çizgileri ve flicker görsel efektleri performans kaybı yaşanmadan arayüze giydirilmiştir.

## 🚀 Teknik Özellikler
- **Örnekleme**: 512/1024 FFT Boyutu.
- **Yenileme Hızı**: 60 Hz (Sync with Display).
- **Dil**: Pure JavaScript (ES6+), Vanilla CSS3, HTML5.
- **Bağımlılık**: 0 (Zero-Dependency).

## 📊 Kullanım ve Parametreler
- **Kazanç (Gain)**: Ham sinyal verisinin çarpan katsayısı.
- **Eşik (Threshold)**: Otomatik log tutma mekanizmasını tetikleyen genlik seviyesi.
- **Şelale Hızı**: Her render döngüsünde kaç piksellik kaydırma yapılacağını belirleyen adım sayısı.

---

### 🏛️ Geliştiren: [Bahattin Yunus](https://github.com/bahattinyunus)
*Elektronik Harp ve Savunma Sistemleri Meraklısı*

**TASNİF DIŞI // TEKNİK ŞARTNAME VE ANALİZ BELGESİDİR**
