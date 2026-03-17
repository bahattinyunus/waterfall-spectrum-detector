# 📡 WATERSPECT: Şelale Spektrum Dedektörü

> [!IMPORTANT]
> **SİNYAL İSTİHBARATI (SIGINT) EĞİTİM MODÜLÜ**
> Bu depo, elektronik harp simülasyonu ve sinyal tespit eğitimi için tasarlanmış yüksek performanslı, web tabanlı bir spektrum analiz aracı içerir.

![WATERSPECT Banner](https://raw.githubusercontent.com/bahattinyunus/waterfall-spectrum-detector/main/assets/banner.png) *(Not: Proje görseli temsilidir)*

## 🛠️ Teknik Genel Bakış

WATERSPECT, yüksek yoğunluklu sinyal verilerinin düşük gecikmeli işlenmesini sağlamak için **Vanilla JavaScript** ve **HTML5 Canvas** kullanılarak geliştirilmiştir. Gerçek zamanlı Hızlı Fourier Dönüşümü (FFT) analizini simüle ederek çift görünümlü bir arayüz sunar:

1.  **Gerçek Zamanlı FFT Analizörü**: Frekans spektrumu üzerindeki anlık sinyal gücünü gösteren yüksek hızlı çizgi grafik.
2.  **Tarihsel Şelale Spektrogramı**: Sinyal modellerini, kaymaları ve sürekliliği ortaya çıkaran, zaman-frekans eksenli kayan ekran.

## 🚀 Öne Çıkan Özellikler

-   **Askeri Standartta UI**: "Siber-Yeşil" ve "Amber" vurgulu, optimize edilmiş karanlık tema dashboard.
-   **Türkçe Yerlileştirme**: Tüm teknik terimler ve arayüz elemanları Türkçe SIGINT/ELINT standartlarına uygundur.
-   **Sinyal Modülasyon Simülasyonu**: Sabit taşıyıcı, frekans atlamalı (Frequency Hopping) ve darbeli (Pulse) sinyal tiplerini simüle eder.
-   **Gelişmiş Denetimler**: Ayarlanabilir Kazanç, Gürültü Tabanı, Eşik Değeri ve Şelale Hızı.
-   **Otomatik Tepe Tespiti**: Belirlenen eşiği aşan sinyalleri otomatik olarak tanımlar ve günlük kaydı tutar.

## 📖 Kullanım Kılavuzu

1.  `index.html` dosyasını herhangi bir modern tarayıcıda açın.
2.  **Kontrol Paneli** üzerinden spektral hassasiyeti ayarlayın.
3.  Anlık değişimler için **FFT Analizi** ekranını takip edin.
4.  Sinyal geçmişi ve kaymaları (drift) için **Şelale Spektrogramı**nı izleyin.
5.  Yakalanan frekans tepeleri için **Sinyal Tespit Günlüğü**nü kontrol edin.

## 🔬 Bilimsel Bağlam

Elektronik harpte **Şelale Grafiği (Waterfall Plot)**, Düşük Yakalanma Olasılığına (LPI) sahip sinyalleri takip etmek için kritiktir. Frekansı zaman ekseninde görselleştirerek, operatörlerin rastgele gürültü ile kasıtlı yayınları (kısa süreli olsalar bile) ayırt etmesine olanak tanır.

---

### 🏛️ Geliştiren: [Bahattin Yunus](https://github.com/bahattinyunus)
*Elektronik Harp ve Savunma Sistemleri Meraklısı*

**TASNİF DIŞI // SADECE EĞİTİM AMAÇLIDIR**
