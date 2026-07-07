/* Bilgi Atlası — Coğrafya içerik verisi
   Etkileşim türleri:
   - province : belirli bir ile tıkla (plaka)
   - group    : bir kümedeki herhangi bir ile tıkla (plakas)
   - features : haritada çizilen öğelerden doğru olanı seç
        point : ilin merkezine (dx/dy kaydırmalı) konan işaretçi
        line  : verilen illerin merkezlerini birleştiren çizgi (fay, nehir, rüzgâr oku)
                arrow:true → çizginin ucuna yön oku eklenir (nereden nereye)
   Her öğede `info`: cevap sonrası gösterilen kısa bilgi. */

window.GEO = {
  categories: [
    { title: "🗺️ Harita Bilgisi",            topics: ["iller", "bolgeler"] },
    { title: "🏔️ Yer Şekilleri ve Yer'in Kuvvetleri", topics: ["yersekilleri", "ickuvvetler", "diskuvvetler", "daglar", "goller"] },
    { title: "🌦️ İklim Bilgisi",             topics: ["iklimler", "sicaklik", "basincruzgar", "yagis"] },
    { title: "🌱 Su, Toprak ve Bitki",        topics: ["sutoprakbitki", "toprak"] },
    { title: "👥 Beşeri ve Ekonomik Coğrafya", topics: ["nufus", "goc", "yerlesme", "ekonomi"] },
  ],

  topics: {

    /* ---------------- Harita Bilgisi ---------------- */
    iller: {
      icon: "🏙️", name: "İller", color: "#2b7de9", tries: 3, type: "province",
      allProvinces: true, tag: "81 il · 3 hak",
      desc: "Verilen ili haritada bul. 3 deneme hakkın var.",
      prompt: "Haritadan doğru ili seç",
    },

    bolgeler: {
      icon: "🧩", name: "Coğrafi Bölgeler", color: "#16a34a", tries: 1, type: "group",
      tag: "7 bölge · tek hak",
      desc: "Sorulan coğrafi bölgeyi bul — o bölgeden herhangi bir ile tıkla.",
      prompt: "Bölgeyi bul: o bölgeden bir ile tıkla",
      groups: [
        { name: "Marmara Bölgesi", plakas: ["10","11","16","17","22","34","39","41","54","59","77"], info: "Nüfus ve sanayice en yoğun bölge; en çok göç alır. İç kesimlerde Marmara (geçiş) iklimi görülür." },
        { name: "Ege Bölgesi", plakas: ["03","09","20","35","43","45","48","64"], info: "Kıyıda Akdeniz iklimi; dağlar denize dik uzandığı için Menderes ovaları verimlidir. Zeytin, incir, üzüm." },
        { name: "Akdeniz Bölgesi", plakas: ["01","07","15","31","32","46","33","80"], info: "Turunçgil ve seracılığın merkezi; Toroslar ve deniz turizmi öne çıkar. Kışları ılık." },
        { name: "İç Anadolu Bölgesi", plakas: ["68","06","18","26","70","38","71","40","42","50","51","58","66"], info: "Karasal iklim ve bozkır; Türkiye'nin tahıl ambarı. En az yağış alan yerler buradadır." },
        { name: "Karadeniz Bölgesi", plakas: ["05","08","74","69","14","19","81","28","29","78","37","52","53","55","57","60","61","67"], info: "Her mevsim yağışlı, gür ormanlı. Çay ve fındık üretimi; dağınık yerleşme yaygındır." },
        { name: "Doğu Anadolu Bölgesi", plakas: ["04","75","12","13","23","24","25","30","76","36","44","49","62","65"], info: "En yüksek ve en soğuk bölge; büyükbaş hayvancılık ve akarsu kaynakları (Fırat, Dicle, Aras) buradadır." },
        { name: "Güneydoğu Anadolu Bölgesi", plakas: ["02","72","21","27","79","47","56","63","73"], info: "En sıcak bölge; GAP ile sulu tarım gelişti. Antep fıstığı ve Fırat-Dicle havzası." },
      ],
    },

    /* ---------------- Yer Şekilleri ---------------- */
    yersekilleri: {
      icon: "🏞️", name: "Türkiye'nin Yer Şekilleri", color: "#b45309", tries: 1, type: "features",
      tag: "ova, plato, boğaz · tek hak",
      desc: "Ovalar, platolar, boğazlar ve önemli yer şekillerini haritada bul.",
      prompt: "Sorulan yer şeklini haritada seç",
      features: [
        { name: "Çukurova (Adana Ovası)", kind: "point", pk: "01", dy: 6, info: "Seyhan-Ceyhan'ın oluşturduğu delta ovası; Türkiye'nin en büyük pamuk ve turfanda sebze alanı." },
        { name: "Konya Ovası", kind: "point", pk: "42", dx: 10, dy: 8, info: "Türkiye'nin en büyük tektonik-karstik ovası; tahıl üretiminde ilk sırada, sulama önemli." },
        { name: "Bafra Ovası", kind: "point", pk: "55", dx: -8, dy: -10, info: "Kızılırmak'ın Karadeniz'e döküldüğü yerde oluşan delta ovası; tütün ve sebze." },
        { name: "Çarşamba Ovası", kind: "point", pk: "55", dx: 14, dy: -6, info: "Yeşilırmak'ın oluşturduğu delta ovası; fındık ve sebzeciliğiyle bilinir." },
        { name: "Harran Ovası", kind: "point", pk: "63", dy: 12, info: "GAP ile Atatürk Barajı'ndan sulanır; pamuk üretiminin arttığı sıcak ova." },
        { name: "Gediz Ovası", kind: "point", pk: "45", dx: -10, dy: 6, info: "Gediz Nehri'nin oluşturduğu verimli Ege ovası; üzüm ve pamuk." },
        { name: "İç Anadolu Platoları", kind: "point", pk: "68", dx: -14, info: "Obruk, Cihanbeyli, Haymana gibi geniş düzlükler; tahıl ve mera hayvancılığı." },
        { name: "Erzurum–Kars Platosu", kind: "point", pk: "36", dx: -10, info: "Türkiye'nin en yüksek platosu; çernozyom toprakları ve büyükbaş hayvancılık." },
        { name: "Taşeli Platosu", kind: "point", pk: "70", dy: 14, info: "Orta Toroslar'da karstik plato; derin kanyonlar ve mağaralarıyla tanınır." },
        { name: "İstanbul Boğazı", kind: "point", pk: "34", dx: 6, dy: 4, info: "Karadeniz ile Marmara'yı bağlar; Asya ile Avrupa'yı ayıran doğal su yolu." },
        { name: "Çanakkale Boğazı", kind: "point", pk: "17", dx: -6, dy: 6, info: "Marmara ile Ege'yi bağlar; stratejik konumdaki dar deniz geçidi." },
      ],
    },

    ickuvvetler: {
      icon: "🌋", name: "İç Kuvvetler", color: "#dc2626", tries: 1, type: "features",
      tag: "fay & volkan · tek hak",
      desc: "Fay hatları ve volkanik dağlar — yeryüzünü içten şekillendiren kuvvetler.",
      prompt: "Sorulan fay hattını / volkanik dağı haritada seç",
      note: "Fay hatları illerin merkezlerinden geçen çizgilerle temsil edilir; gerçek güzergâha yaklaşıktır.",
      features: [
        { name: "Kuzey Anadolu Fay Hattı", kind: "line", plakas: ["41","54","81","14","18","19","05","60","24","25"], info: "Türkiye'nin en aktif fayı; batıda Marmara'dan doğuda Erzincan'a uzanır. 1999 Gölcük depremi bu fayda oldu." },
        { name: "Doğu Anadolu Fay Hattı", kind: "line", plakas: ["31","46","44","23","12"], info: "Hatay–Kahramanmaraş'tan Bingöl'e uzanır. 2023 Kahramanmaraş depremleri bu fay üzerindedir." },
        { name: "Batı Anadolu Fayları (Grabenler)", kind: "line", plakas: ["45","35","09","20"], info: "Ege'de çöküntü ovaları (Gediz, B. Menderes grabenleri) oluşturur; jeotermal kaynaklar buradadır." },
        { name: "Ağrı Dağı (volkanik)", kind: "point", pk: "04", dx: 16, dy: -6, info: "Türkiye'nin en yüksek noktası (5.137 m); sönmüş bir volkandır." },
        { name: "Erciyes Dağı (volkanik)", kind: "point", pk: "38", dy: 10, info: "İç Anadolu'nun en yüksek volkanik dağı; Kapadokya'nın tüf tabakalarının kaynağıdır." },
        { name: "Süphan Dağı (volkanik)", kind: "point", pk: "13", dx: 10, dy: -6, info: "Van Gölü kuzeyindeki sönmüş volkan; Türkiye'nin ikinci yüksek volkanik dağı." },
        { name: "Nemrut Dağı (Bitlis, volkanik)", kind: "point", pk: "13", dx: -12, dy: 8, info: "Kraterinde göl bulunan sönmüş volkan; Van Gölü'nün oluşumunda lavları etkili olmuştur." },
        { name: "Hasan Dağı (volkanik)", kind: "point", pk: "68", dy: 16, info: "İç Anadolu'da sönmüş volkan; Aksaray yakınında koni biçimli dağ." },
        { name: "Karacadağ (volkanik)", kind: "point", pk: "21", dx: -10, dy: 6, info: "Diyarbakır–Şanlıurfa arasında kalkan biçimli volkan; bazalt platosu oluşturur." },
      ],
    },

    diskuvvetler: {
      icon: "🌊", name: "Dış Kuvvetler", color: "#0891b2", tries: 1, type: "features",
      tag: "akarsu & karst · tek hak",
      desc: "Akarsular, karstik şekiller ve delta ovaları — yeryüzünü dıştan şekillendiren kuvvetler.",
      prompt: "Sorulan akarsuyu / şekli haritada seç",
      features: [
        { name: "Kızılırmak", kind: "line", plakas: ["58","38","50","40","71","18","19","55"], info: "Türkiye topraklarından doğup en uzun yol kat eden nehir; Bafra Ovası deltasını oluşturur." },
        { name: "Yeşilırmak", kind: "line", plakas: ["58","60","05","55"], info: "Sivas'tan doğar, Çarşamba deltasını oluşturarak Karadeniz'e dökülür." },
        { name: "Sakarya Nehri", kind: "line", plakas: ["03","26","06","11","54"], info: "İç Batı Anadolu'dan doğar, Karadeniz'e dökülür; üzerinde önemli barajlar vardır." },
        { name: "Fırat Nehri", kind: "line", plakas: ["24","23","44","02","63"], info: "Türkiye'nin en çok su taşıyan nehri; Keban ve Atatürk barajları GAP'ın kalbidir." },
        { name: "Dicle Nehri", kind: "line", plakas: ["21","72","56","73"], info: "Diyarbakır çevresinden doğar; Fırat ile birlikte Mezopotamya'yı sular." },
        { name: "Seyhan Nehri", kind: "line", plakas: ["38","01"], info: "Toroslar'dan doğar, Çukurova'yı sulayarak Akdeniz'e dökülür." },
        { name: "Ceyhan Nehri", kind: "line", plakas: ["46","80","01"], info: "Kahramanmaraş'tan doğar, Çukurova'nın doğusunu sular." },
        { name: "Büyük Menderes", kind: "line", plakas: ["03","20","09"], info: "Menderes (kıvrım) şekilleriyle ünlüdür; Ege'nin verimli ovalarını oluşturur." },
        { name: "Pamukkale Travertenleri (karst)", kind: "point", pk: "20", dx: 8, dy: -6, info: "Kalsiyum karbonatlı suların çökelmesiyle oluşan beyaz basamaklar; karstik dış kuvvet örneği." },
        { name: "Taşeli Karst Alanı", kind: "point", pk: "07", dx: 14, dy: -4, info: "Toroslar'daki kireçtaşlarında oluşan mağara, düden ve obruklar; karstlaşma bölgesi." },
      ],
    },

    daglar: {
      icon: "⛰️", name: "Dağlar", color: "#7c3f12", tries: 1, type: "features",
      tag: "doruklar · tek hak",
      desc: "Türkiye'nin önemli dağlarını ve doruklarını haritada bul.",
      prompt: "Sorulan dağın noktasını seç",
      features: [
        { name: "Ağrı Dağı", kind: "point", pk: "04", dx: 18, dy: -6, info: "5.137 m ile Türkiye'nin en yüksek dağı; sönmüş volkan." },
        { name: "Erciyes Dağı", kind: "point", pk: "38", dy: 10, info: "İç Anadolu'nun çatısı; kayak turizmiyle bilinir." },
        { name: "Uludağ", kind: "point", pk: "16", dy: 14, info: "Bursa'da kış turizmi merkezi; bir kütle (horst) dağıdır." },
        { name: "Kaçkar Dağı", kind: "point", pk: "53", dy: 6, info: "Doğu Karadeniz'in en yüksek doruğu; buzul gölleri ve yaylalarıyla ünlü." },
        { name: "Palandöken Dağı", kind: "point", pk: "25", dy: 8, info: "Erzurum'da uzun kayak pistleriyle tanınan dağ." },
        { name: "Nemrut Dağı (Adıyaman)", kind: "point", pk: "02", dx: 10, dy: -6, info: "Kommagene dev heykelleri ve tümülüsüyle ünlü; UNESCO Dünya Mirası." },
        { name: "Cilo Dağı", kind: "point", pk: "30", dy: 6, info: "Hakkâri'de; Ağrı'dan sonra Türkiye'nin en yüksek ikinci zirvesi, buzullarıyla bilinir." },
        { name: "Kaz Dağı (İda)", kind: "point", pk: "17", dx: 14, dy: 12, info: "Mitolojik 'İda Dağı'; zengin bitki örtüsü ve oksijeniyle ünlü." },
        { name: "Bey Dağları", kind: "point", pk: "07", dx: -18, dy: -6, info: "Antalya kıyısında Toroslar'ın bir bölümü; Tahtalı zirvesi turistiktir." },
        { name: "Munzur Dağları", kind: "point", pk: "62", dy: -6, info: "Tunceli'de; Munzur Vadisi Milli Parkı ve endemik türleriyle tanınır." },
      ],
    },

    goller: {
      icon: "💧", name: "Göller", color: "#0e7490", tries: 1, type: "features",
      tag: "göller · tek hak",
      desc: "Türkiye'nin önemli göllerini haritada bul. Tek deneme!",
      prompt: "Sorulan gölün noktasını seç",
      features: [
        { name: "Van Gölü", kind: "point", pk: "65", info: "Türkiye'nin en büyük gölü; sodalı (tuzlu) suyu ve inci kefaliyle bilinir." },
        { name: "Tuz Gölü", kind: "point", pk: "68", info: "Çok sığ ve aşırı tuzlu; Türkiye'nin tuz ihtiyacının büyük kısmını karşılar." },
        { name: "Beyşehir Gölü", kind: "point", pk: "42", dx: -22, dy: 8, info: "Türkiye'nin en büyük tatlı su gölü; karstik-tektonik kökenli." },
        { name: "Eğirdir Gölü", kind: "point", pk: "32", dx: 6, dy: -6, info: "Isparta'da büyük tatlı su gölü; balıkçılık ve sulama için önemli." },
        { name: "Burdur Gölü", kind: "point", pk: "15", dy: -8, info: "Tektonik kökenli, sodalı acı su gölü; su seviyesi hızla azalıyor." },
        { name: "Salda Gölü", kind: "point", pk: "15", dx: -16, dy: 10, info: "Derin krater gölü; beyaz kumları ve turkuaz suyuyla 'Türkiye'nin Maldivleri'." },
        { name: "İznik Gölü", kind: "point", pk: "16", dx: 10, dy: 4, info: "Tektonik çöküntü gölü; çevresi zeytinlikleriyle ünlü." },
        { name: "Sapanca Gölü", kind: "point", pk: "54", dy: 6, info: "Tektonik oluk içinde tatlı su gölü; bölgeye içme suyu sağlar." },
        { name: "Manyas (Kuş) Gölü", kind: "point", pk: "10", dx: 14, dy: -10, info: "Kuş Cenneti Milli Parkı; göçmen kuşların uğrak yeri." },
        { name: "Acıgöl", kind: "point", pk: "20", dx: -18, info: "Denizli–Afyon arasında sodalı acı su gölü; sodyum sülfat çıkarılır." },
        { name: "Çıldır Gölü", kind: "point", pk: "75", info: "Yüksek volkanik set gölü; kışın buz tutar, buzda balıkçılık yapılır." },
        { name: "Hazar Gölü", kind: "point", pk: "23", dy: 8, info: "Elazığ'da Doğu Anadolu Fayı üzerinde tektonik göl." },
        { name: "Bafa Gölü", kind: "point", pk: "09", dx: -10, dy: 14, info: "Büyük Menderes deltasının denizden ayrılmasıyla oluşan kıyı (lagün) gölü." },
      ],
    },

    /* ---------------- İklim Bilgisi ---------------- */
    iklimler: {
      icon: "🌤️", name: "İklim Tipleri", color: "#e0791b", tries: 1, type: "group",
      tag: "iklimler · tek hak",
      desc: "Akdeniz, Karadeniz, karasal ve geçiş iklimlerinin görüldüğü yerleri bul.",
      prompt: "Bu iklimin görüldüğü bir yere tıkla",
      groups: [
        { name: "Akdeniz İklimi", plakas: ["07","33","01","31","48","35","09"], info: "Yazları sıcak-kurak, kışları ılık-yağışlı. Doğal bitki örtüsü makidir." },
        { name: "Karadeniz İklimi", plakas: ["53","61","52","28","55","57","08","41"], info: "Her mevsim yağışlı, nemli ve ılıman. Gür ormanlar ve çay-fındık tarımı." },
        { name: "Karasal İklim", plakas: ["06","42","58","25","65","44","66"], info: "Yazları sıcak, kışları çok soğuk; yıllık sıcaklık farkı fazla. Bozkır bitki örtüsü." },
        { name: "Marmara (Geçiş) İklimi", plakas: ["34","16","10","59","22"], info: "Akdeniz, Karadeniz ve karasal iklim arasında geçiş özelliği gösterir." },
      ],
    },

    sicaklik: {
      icon: "🌡️", name: "Atmosfer ve Sıcaklık", color: "#ef5350", tries: 1, type: "group",
      tag: "sıcaklık · tek hak",
      desc: "Sıcaklığın en yüksek ve en düşük olduğu yerleri, karasallığı harita üzerinde tanı.",
      prompt: "Açıklamaya uyan yeri haritada seç",
      groups: [
        { name: "En yüksek sıcaklık ortalaması (en sıcak)", plakas: ["33","31","63","21"], info: "Güney enlemleri ve alçak alanlar en sıcak yerlerdir; G.Doğu ve Akdeniz kıyıları öne çıkar." },
        { name: "En düşük sıcaklık (en soğuk / yüksek)", plakas: ["25","36","75","04"], info: "Yükselti arttıkça sıcaklık düşer; Doğu Anadolu en soğuk bölgedir (Erzurum-Kars)." },
        { name: "Yıllık sıcaklık farkının en fazla olduğu yer (karasallık)", plakas: ["76","25","68"], info: "Denizden uzak, çukur ovalarda karasallık artar; Iğdır ve İç/Doğu Anadolu örnektir." },
        { name: "Kışın en ılıman kalan kıyılar", plakas: ["07","33","48"], info: "Deniz etkisi ve güney konum nedeniyle Akdeniz kıyıları kışın en ılık yerlerdir." },
        { name: "Yükselti nedeniyle sıcaklığın düştüğü Doğu Anadolu", plakas: ["30","65","62","24"], info: "Ortalama yükseltinin fazla olması sıcaklığı düşürür; don olaylı gün sayısı çoktur." },
      ],
    },

    basincruzgar: {
      icon: "🌬️", name: "Basınç ve Rüzgârlar", color: "#0ea5e9", tries: 1, type: "features",
      tag: "yön okları · tek hak",
      desc: "Türkiye'de etkili yerel rüzgârların hangi yönden estiğini oklarla gör ve bul.",
      prompt: "Sorulan rüzgârın okunu (yönünü) haritada seç",
      note: "Oklar rüzgârın estiği yönü gösterir; etki alanları yaklaşıktır.",
      features: [
        { name: "Poyraz (Kuzeydoğu → serin-kuru)", kind: "line", arrow: true, plakas: ["67","54","34","17"], info: "Kuzeydoğudan eser; serin ve kurudur. Yazın Marmara ve Ege'yi ferahlatır." },
        { name: "Lodos (Güneybatı → sıcak-nemli)", kind: "line", arrow: true, plakas: ["48","35","45","34"], info: "Güneybatıdan eser; sıcak ve nemlidir. Kışın sıcaklığı yükseltir, fırtına yapar." },
        { name: "Karayel (Kuzeybatı → soğuk)", kind: "line", arrow: true, plakas: ["22","59","16","06"], info: "Kuzeybatıdan eser; soğuk ve sert bir rüzgârdır, kışın kar getirir." },
        { name: "Yıldız (Kuzey → soğuk)", kind: "line", arrow: true, plakas: ["57","19","40"], info: "Kuzeyden (Karadeniz'den) eser; soğuk bir rüzgârdır." },
        { name: "Samyeli / Keşişleme (Güneydoğu → sıcak-kuru)", kind: "line", arrow: true, plakas: ["73","47","21","27"], info: "Güneydoğudan eser; çöl kaynaklı, çok sıcak ve kuru bir rüzgârdır. Bitkilere zarar verir." },
      ],
    },

    yagis: {
      icon: "🌧️", name: "Nem, Yağış ve Buharlaşma", color: "#2563eb", tries: 1, type: "group",
      tag: "yağış · tek hak",
      desc: "En çok/az yağış alan, en nemli ve buharlaşmanın en yüksek olduğu yerleri bul.",
      prompt: "Açıklamaya uyan yeri haritada seç",
      groups: [
        { name: "En çok yağış alan yer (Doğu Karadeniz)", plakas: ["53","61","08"], info: "Dağların denize paralel ve yüksek olması yağışı artırır; Rize en çok yağış alan ilimizdir." },
        { name: "En az yağış alan yer (Tuz Gölü çevresi / Iğdır)", plakas: ["68","42","76"], info: "Etraf dağlarla çevrili çukur alanlar yağış alamaz; Tuz Gölü çevresi en kurak yerdir." },
        { name: "Nemin en yüksek olduğu kıyılar", plakas: ["53","55","61"], info: "Deniz etkisi ve bol yağış nedeniyle Karadeniz kıyılarında nem yüksektir." },
        { name: "Buharlaşmanın en fazla olduğu yer (G.Doğu)", plakas: ["63","21","73"], info: "Yüksek sıcaklık nedeniyle buharlaşma artar; G.Doğu'da su açığı büyüktür." },
        { name: "Kar yağışının en uzun sürdüğü yer (Doğu Anadolu)", plakas: ["25","36","30"], info: "Yükselti ve soğuk nedeniyle karla örtülü gün sayısı en fazla buradadır." },
      ],
    },

    /* ---------------- Su, Toprak, Bitki ---------------- */
    sutoprakbitki: {
      icon: "🌿", name: "Su, Toprak ve Bitki Örtüsü", color: "#15803d", tries: 1, type: "group",
      tag: "bitki örtüsü · tek hak",
      desc: "Maki, bozkır, orman gibi doğal bitki örtülerinin görüldüğü yerleri bul.",
      prompt: "Bu bitki örtüsünün görüldüğü yere tıkla",
      groups: [
        { name: "Maki (Akdeniz kıyıları)", plakas: ["07","33","48","31","01"], info: "Akdeniz ikliminin kızılçam altındaki kısa boylu, kışın yeşil kalan çalı topluluğu." },
        { name: "Bozkır / Step (İç Anadolu)", plakas: ["06","42","68","51"], info: "Kurak karasal iklimde ilkbaharda yeşerip yazın kuruyan otsu bitki örtüsü." },
        { name: "Gür Ormanlar (Karadeniz)", plakas: ["53","61","37","14"], info: "Bol yağış nedeniyle geniş ve iğne yapraklı zengin ormanlar görülür." },
        { name: "Antropojen Bozkır (G.Doğu)", plakas: ["63","21","47"], info: "İnsan eliyle ormanların yok edilmesiyle oluşan ikincil bozkır alanları." },
        { name: "Dağ Çayırları (Doğu Anadolu yükseltileri)", plakas: ["25","30","65"], info: "Yüksek dağların orman üstündeki gür otlakları; yaz otlatmacılığında kullanılır." },
      ],
    },

    toprak: {
      icon: "🟤", name: "Toprak Türleri", color: "#92400e", tries: 1, type: "group",
      tag: "toprak · tek hak",
      desc: "Toprak türlerinin görüldüğü yerleri haritadan seç.",
      prompt: "Bu toprak türünün görüldüğü ile tıkla",
      groups: [
        { name: "Terra Rossa (Kırmızı Akdeniz Toprağı)", plakas: ["07","33","01","48","31"], info: "Kireçtaşı üzerinde oluşan kırmızı renkli Akdeniz toprağı; demir oksitçe zengin." },
        { name: "Çernozyom (Kara Toprak)", plakas: ["25","36","75","76"], info: "Erzurum-Kars platosunun humusça zengin, çok verimli kara toprağı." },
        { name: "Alüvyal Topraklar (Akarsu Ovaları)", plakas: ["55","09","45","10"], info: "Akarsuların taşıyıp biriktirdiği verimli ova toprakları; tarımın en yoğun olduğu yerler." },
        { name: "Çöl / Kırmızımsı Kahverengi Topraklar", plakas: ["63","21","47"], info: "Sıcak ve kurak G.Doğu'da görülen, humusça fakir topraklar." },
        { name: "Kahverengi Orman Toprakları", plakas: ["53","61","14","37"], info: "Nemli ormanlık alanlarda, humusça zengin, koyu renkli topraklar." },
      ],
    },

    /* ---------------- Beşeri ve Ekonomik ---------------- */
    nufus: {
      icon: "👥", name: "Nüfus", color: "#7c3aed", tries: 1, type: "group",
      tag: "nüfus · tek hak",
      desc: "Nüfusun yoğun ve seyrek olduğu yerleri, sebepleriyle birlikte tanı.",
      prompt: "Açıklamaya uyan yeri haritada seç",
      groups: [
        { name: "En kalabalık il (İstanbul)", plakas: ["34"], info: "Sanayi, ticaret ve göç nedeniyle Türkiye'nin en kalabalık ve en yoğun ilidir." },
        { name: "Nüfus yoğunluğunun en fazla olduğu bölge (Marmara)", plakas: ["34","41","16","77"], info: "Sanayi, ulaşım ve iş olanakları nüfusu Marmara'da toplamıştır." },
        { name: "Nüfusun seyrek olduğu engebeli yerler (Doğu Anadolu)", plakas: ["62","69","30","75"], info: "Yükselti, engebe ve sert iklim nüfusu seyrekleştirir." },
        { name: "Sanayi nedeniyle nüfusun toplandığı yerler", plakas: ["41","16","35","06"], info: "Sanayi yatırımları iş gücünü çekerek nüfusu yoğunlaştırır." },
        { name: "Turizm nedeniyle nüfusu artan kıyılar", plakas: ["07","48"], info: "Deniz turizmi Antalya ve Muğla'da özellikle yazın nüfusu artırır." },
      ],
    },

    goc: {
      icon: "🚚", name: "Göç", color: "#db2777", tries: 1, type: "group",
      tag: "göç · tek hak",
      desc: "En çok göç veren ve alan yerler ile mevsimlik göç hedeflerini tanı.",
      prompt: "Açıklamaya uyan yeri haritada seç",
      groups: [
        { name: "En çok göç alan iller", plakas: ["34","06","35","16","41"], info: "İş, eğitim ve sağlık olanakları bu illere yoğun göç çeker." },
        { name: "En çok göç veren bölgeler (Doğu / G.Doğu)", plakas: ["25","62","63","21","49"], info: "İş imkânının azlığı ve iklim koşulları bu bölgelerden dışa göçe yol açar." },
        { name: "Mevsimlik tarım göçünün hedefi (Çukurova / GAP)", plakas: ["01","63","33"], info: "Pamuk ve sebze hasadı için mevsimlik işçi göçü bu ovalara yönelir." },
        { name: "Karadeniz'den dışa göç veren iller", plakas: ["28","29","69","61"], info: "Dar tarım alanları ve engebe nedeniyle Karadeniz sürekli göç verir." },
      ],
    },

    yerlesme: {
      icon: "🏘️", name: "Yerleşme", color: "#0d9488", tries: 1, type: "group",
      tag: "yerleşme · tek hak",
      desc: "Toplu ve dağınık yerleşme ile yayla yerleşmesinin görüldüğü yerleri bul.",
      prompt: "Açıklamaya uyan yerleşme tipinin görüldüğü yere tıkla",
      groups: [
        { name: "Toplu yerleşme (su kaynağı az — İç Anadolu / G.Doğu)", plakas: ["42","68","63","21"], info: "Su kaynakları sınırlı olduğu için evler su çevresinde toplu kurulur." },
        { name: "Dağınık yerleşme (su bol, engebeli — Karadeniz)", plakas: ["53","61","37","52"], info: "Bol su ve engebe nedeniyle evler birbirinden uzak, dağınık kurulur." },
        { name: "Yayla yerleşmesinin yaygın olduğu yerler", plakas: ["53","25","08"], info: "Yaz aylarında hayvan otlatmak için yükseklere çıkılan geçici yerleşmeler." },
        { name: "Büyük kentsel yerleşmeler (metropoller)", plakas: ["34","06","35"], info: "Nüfusun milyonları aştığı, ekonomik faaliyetin yoğunlaştığı büyükşehirler." },
      ],
    },

    ekonomi: {
      icon: "🏭", name: "Ekonomik Faaliyetler", color: "#ca8a04", tries: 1, type: "group",
      tag: "tarım & ekonomi · tek hak",
      desc: "Tarım ürünleri, madenler ve turizmin öne çıktığı yerleri haritada bul.",
      prompt: "Bu faaliyetin/ürünün öne çıktığı yere tıkla",
      groups: [
        { name: "Fındık (Doğu Karadeniz)", plakas: ["28","52","61","55","08"], info: "Nemli iklim fındık için idealdir; Türkiye dünya üretiminde ilk sıradadır." },
        { name: "Çay (Rize çevresi)", plakas: ["53","08"], info: "Bol yağış ve asitli toprak çay için uygundur; üretim Rize çevresinde toplanır." },
        { name: "Pamuk (Çukurova / GAP / Ege)", plakas: ["01","63","09"], info: "Sıcaklık ve sulama isteyen pamuk; Çukurova, GAP ve Ege ovalarında yetişir." },
        { name: "İncir (Aydın)", plakas: ["09"], info: "Kuru incir üretiminde Aydın ve Büyük Menderes havzası öne çıkar." },
        { name: "Kayısı (Malatya)", plakas: ["44"], info: "Dünya kuru kayısı üretiminin büyük kısmı Malatya'dan sağlanır." },
        { name: "Antep Fıstığı (G.Antep / Şanlıurfa)", plakas: ["27","63"], info: "Sıcak ve kurak iklim ister; Gaziantep ve Şanlıurfa üretimin merkezidir." },
        { name: "Zeytin (Ege–Marmara–Akdeniz kıyıları)", plakas: ["10","35","45","16","31"], info: "Akdeniz ikliminin ürünü; kıyı kuşağında geniş zeytinlikler vardır." },
        { name: "Deniz Turizmi (Antalya / Muğla)", plakas: ["07","48"], info: "Uzun yaz, deniz ve tarihi değerler Antalya-Muğla'yı turizmin merkezi yapar." },
      ],
    },

  },
};
