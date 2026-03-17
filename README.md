# 📡 WATERSPECT: Şelale Spektrum Dedektörü

> [!IMPORTANT]
> **SİNYAL İSTİHBARATI (SIGINT) EĞİTİM VE ANALİZ MODÜLÜ**
> Bu depo, elektronik harp simülasyonu ve gerçek zamanlı sinyal analizi için tasarlanmış yüksek performanslı bir spektrum dedektörü içerir.

![WATERSPECT Banner](assets/banner.png)

## 🛠️ Teknik Genel Bakış

WATERSPECT, hem simülasyon hem de gerçek dünya verileriyle çalışabilen hibrit bir analiz aracıdır. **Web Audio API** entegrasyonu sayesinde mikrofonunuzdan gelen sesleri gerçek zamanlı olarak spektrumda görebilirsiniz.

1.  **Gerçek Zamanlı FFT Analizörü**: Frekans spektrumu üzerindeki anlık sinyal gücünü gösteren yüksek hızlı çizgi grafik.
2.  **Tarihsel Şelale Spektrogramı**: Sinyal modellerini, kaymaları ve sürekliliği ortaya çıkaran zaman-frekans eksenli kayan ekran.
3.  **EH Arayüzü**: CRT tarama çizgileri, TRL-7 doğrulama rozeti ve siber-estetik efektler.

## 🚀 Öne Çıkan Özellikler

-   **Çift Modlu Çalışma**: SİMÜLASYON ve CANLI SİNYAL (Audio Input) modları.
-   **Gelişmiş Sinyal Tipleri**: Sabit, Frekans Atlama (Frequency Hopping) ve Pulsar modülasyonları.
-   **Kullanıcı Denetimi**: Spektrum kazancı, gürültü tabanı, eşik değeri ve şelale hızı ayarları.
-   **Otomatik Günlükleme**: Tespit edilen frekans tepelerinin zaman damgalı kaydı.
-   **Askeri Standart (TR)**: SIGINT/ELINT terminolojisine tam uyumlu Türkçe yerlileştirme.

## 📖 Kullanım Kılavuzu

1.  `index.html` dosyasını tarayıcıda açın.
2.  **KAYNAK** menüsünden "CANLI SİNYAL"i seçerek mikrofonunuzu bağlayın (İzin gereklidir).
3.  **EŞİK DEĞERİ**ni ayarlayarak otomatik sinyal tespitini başlatın.
4.  **HIZ** çubuğu ile şelale grafiğinin akışını optimize edin.

## ⚡ Gelişmiş Özellikler (TRL-7)

Proje, operasyonel ortamda sistem doğrulaması (TRL-7) aşamasındadır. Yüksek performanslı canvas rendering sayesinde düşük donanımlı cihazlarda bile 60 FPS akıcılık sağlar.

---

### 🏛️ Geliştiren: [Bahattin Yunus](https://github.com/bahattinyunus)
*Elektronik Harp ve Savunma Sistemleri Meraklısı*

**TASNİF DIŞI // SADECE EĞİTİM VE ANALİZ AMAÇLIDIR**
