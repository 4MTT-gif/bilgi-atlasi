# 🧭 Bilgi Atlası — YKS & KPSS Tarih ve Coğrafya

YKS ve KPSS'ye hazırlanan öğrenciler için **tarih ve coğrafya** odaklı, oyunlaştırılmış test uygulaması.

## 🌍 Coğrafya Modülleri

Hepsi Türkiye haritası üzerinde, kategoriler halinde. İl modu 3 deneme (100/60/30 puan), diğer tüm modlar **tek deneme** (100 puan):

- **🗺️ Harita Bilgisi:** İller, Coğrafi Bölgeler
- **🏔️ Yer Şekilleri ve Yer'in Kuvvetleri:** Türkiye'nin Yer Şekilleri (ova/plato/boğaz), İç Kuvvetler (fay hatları + volkanik dağlar), Dış Kuvvetler (akarsular + karst), Dağlar, Göller
- **🌦️ İklim Bilgisi:** İklim Tipleri, Atmosfer ve Sıcaklık, Basınç ve Rüzgârlar, Nem–Yağış–Buharlaşma
- **🌱 Su, Toprak ve Bitki:** Bitki Örtüsü, Toprak Türleri
- **👥 Beşeri ve Ekonomik:** Nüfus, Göç, Yerleşme, Ekonomik Faaliyetler

Etkileşim üç biçimde: bir **ile** tıkla, bir **kümeden** (bölge/iklim/ürün alanı) herhangi bir ile tıkla, ya da haritaya çizilen **nokta/çizgi** öğelerden (göl, dağ, fay hattı, nehir) doğru olanı seç. Fay hattı ve nehirler, geçtikleri illerin merkezleri birleştirilerek yaklaşık güzergâhla çizilir.

**Tarih** modülü yakında.

## 🎮 Nasıl Oynanır?

1. Ana menüden **Coğrafya**'yı, ardından bir mod seç.
2. Sana rastgele bir hedef verilir (ör. **"Bul: Van Gölü"**).
3. Haritadan/noktalardan doğru olanı seç. **Doğru** cevap **yeşil**, yanlışta doğru cevap açığa çıkar.
4. İl modunda 3 deneme hakkın var; diğer modlarda **tek hak** — ilk tıklaman geçerli!
5. Modun tüm sorularını bitirdiğinde puanın ve bilemediklerin listelenir.

Harita üzerinde **yakınlaştırma** (fare tekerleği / iki parmak) ve **kaydırma** (sürükleme) desteklenir.

## 🚀 Çalıştırma

Hiçbir kurulum gerekmez — `index.html` dosyasını tarayıcıda aç, oyna.

## 🛠️ Teknoloji

- Saf HTML / CSS / JavaScript (framework yok, bağımlılık yok)
- SVG tabanlı interaktif Türkiye haritası
- Mobil uyumlu (dokunmatik destekli) — ileride **Capacitor** ile Google Play ve App Store'da yayınlanacak

## 🗺️ Harita Kaynağı

Türkiye SVG haritası: [dnomak/svg-turkiye-haritasi](https://github.com/dnomak/svg-turkiye-haritasi) (MIT Lisansı)

## 📄 Lisans

MIT — bkz. [LICENSE](LICENSE)
