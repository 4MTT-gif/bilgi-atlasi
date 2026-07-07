/* Bilgi Atlası — Coğrafya içerik verisi
   Tüm konular harita üzerinde. Üç etkileşim türü:
   - province : belirli bir ile tıkla (plaka)
   - group    : bir kümedeki herhangi bir ile tıkla (plakas)
   - features : haritada çizilen öğelerden doğru olanı seç
        point : ilin merkezine (dx/dy kaydırmalı) konan işaretçi
        line  : verilen illerin merkezlerini birleştiren çizgi (fay hattı, nehir)

   Çizgiler illerin merkezlerinden geçtiği için gerçek güzergâha yaklaşık uyar. */

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
        { name: "Marmara Bölgesi", plakas: ["10","11","16","17","22","34","39","41","54","59","77"] },
        { name: "Ege Bölgesi", plakas: ["03","09","20","35","43","45","48","64"] },
        { name: "Akdeniz Bölgesi", plakas: ["01","07","15","31","32","46","33","80"] },
        { name: "İç Anadolu Bölgesi", plakas: ["68","06","18","26","70","38","71","40","42","50","51","58","66"] },
        { name: "Karadeniz Bölgesi", plakas: ["05","08","74","69","14","19","81","28","29","78","37","52","53","55","57","60","61","67"] },
        { name: "Doğu Anadolu Bölgesi", plakas: ["04","75","12","13","23","24","25","30","76","36","44","49","62","65"] },
        { name: "Güneydoğu Anadolu Bölgesi", plakas: ["02","72","21","27","79","47","56","63","73"] },
      ],
    },

    /* ---------------- Yer Şekilleri ---------------- */
    yersekilleri: {
      icon: "🏞️", name: "Türkiye'nin Yer Şekilleri", color: "#b45309", tries: 1, type: "features",
      tag: "ova, plato, boğaz · tek hak",
      desc: "Ovalar, platolar, boğazlar ve önemli yer şekillerini haritada bul.",
      prompt: "Sorulan yer şeklini haritada seç",
      features: [
        { name: "Çukurova (Adana Ovası)", kind: "point", pk: "01", dy: 6 },
        { name: "Konya Ovası", kind: "point", pk: "42", dx: 10, dy: 8 },
        { name: "Bafra Ovası", kind: "point", pk: "55", dx: -8, dy: -10 },
        { name: "Çarşamba Ovası", kind: "point", pk: "55", dx: 14, dy: -6 },
        { name: "Harran Ovası", kind: "point", pk: "63", dy: 12 },
        { name: "Gediz Ovası", kind: "point", pk: "45", dx: -10, dy: 6 },
        { name: "İç Anadolu Platoları", kind: "point", pk: "68", dx: -14 },
        { name: "Erzurum–Kars Platosu", kind: "point", pk: "36", dx: -10 },
        { name: "Taşeli Platosu", kind: "point", pk: "70", dy: 14 },
        { name: "İstanbul Boğazı", kind: "point", pk: "34", dx: 6, dy: 4 },
        { name: "Çanakkale Boğazı", kind: "point", pk: "17", dx: -6, dy: 6 },
      ],
    },

    ickuvvetler: {
      icon: "🌋", name: "İç Kuvvetler", color: "#dc2626", tries: 1, type: "features",
      tag: "fay & volkan · tek hak",
      desc: "Fay hatları ve volkanik dağlar — yeryüzünü içten şekillendiren kuvvetler.",
      prompt: "Sorulan fay hattını / volkanik dağı haritada seç",
      note: "Fay hatları illerin merkezlerinden geçen çizgilerle temsil edilir; gerçek güzergâha yaklaşıktır.",
      features: [
        { name: "Kuzey Anadolu Fay Hattı", kind: "line", plakas: ["41","54","81","14","18","19","05","60","24","25"] },
        { name: "Doğu Anadolu Fay Hattı", kind: "line", plakas: ["31","46","44","23","12"] },
        { name: "Batı Anadolu Fayları (Grabenler)", kind: "line", plakas: ["45","35","09","20"] },
        { name: "Ağrı Dağı (volkanik)", kind: "point", pk: "04", dx: 16, dy: -6 },
        { name: "Erciyes Dağı (volkanik)", kind: "point", pk: "38", dy: 10 },
        { name: "Süphan Dağı (volkanik)", kind: "point", pk: "13", dx: 10, dy: -6 },
        { name: "Nemrut Dağı (Bitlis, volkanik)", kind: "point", pk: "13", dx: -12, dy: 8 },
        { name: "Hasan Dağı (volkanik)", kind: "point", pk: "68", dy: 16 },
        { name: "Karacadağ (volkanik)", kind: "point", pk: "21", dx: -10, dy: 6 },
      ],
    },

    diskuvvetler: {
      icon: "🌊", name: "Dış Kuvvetler", color: "#0891b2", tries: 1, type: "features",
      tag: "akarsu & karst · tek hak",
      desc: "Akarsular, karstik şekiller ve delta ovaları — yeryüzünü dıştan şekillendiren kuvvetler.",
      prompt: "Sorulan akarsuyu / şekli haritada seç",
      features: [
        { name: "Kızılırmak", kind: "line", plakas: ["58","38","50","40","71","18","19","55"] },
        { name: "Yeşilırmak", kind: "line", plakas: ["58","60","05","55"] },
        { name: "Sakarya Nehri", kind: "line", plakas: ["03","26","06","11","54"] },
        { name: "Fırat Nehri", kind: "line", plakas: ["24","23","44","02","63"] },
        { name: "Dicle Nehri", kind: "line", plakas: ["21","72","56","73"] },
        { name: "Seyhan Nehri", kind: "line", plakas: ["38","01"] },
        { name: "Ceyhan Nehri", kind: "line", plakas: ["46","80","01"] },
        { name: "Büyük Menderes", kind: "line", plakas: ["03","20","09"] },
        { name: "Pamukkale Travertenleri (karst)", kind: "point", pk: "20", dx: 8, dy: -6 },
        { name: "Manavgat–Taşeli Karstı", kind: "point", pk: "07", dx: 14, dy: -4 },
      ],
    },

    daglar: {
      icon: "⛰️", name: "Dağlar", color: "#7c3f12", tries: 1, type: "features",
      tag: "doruklar · tek hak",
      desc: "Türkiye'nin önemli dağlarını ve doruklarını haritada bul.",
      prompt: "Sorulan dağın noktasını seç",
      features: [
        { name: "Ağrı Dağı", kind: "point", pk: "04", dx: 18, dy: -6 },
        { name: "Erciyes Dağı", kind: "point", pk: "38", dy: 10 },
        { name: "Uludağ", kind: "point", pk: "16", dy: 14 },
        { name: "Kaçkar Dağı", kind: "point", pk: "53", dy: 6 },
        { name: "Palandöken Dağı", kind: "point", pk: "25", dy: 8 },
        { name: "Nemrut Dağı (Adıyaman)", kind: "point", pk: "02", dx: 10, dy: -6 },
        { name: "Cilo Dağı", kind: "point", pk: "30", dy: 6 },
        { name: "Kaz Dağı (İda)", kind: "point", pk: "17", dx: 14, dy: 12 },
        { name: "Bey Dağları", kind: "point", pk: "07", dx: -18, dy: -6 },
        { name: "Munzur Dağları", kind: "point", pk: "62", dy: -6 },
      ],
    },

    goller: {
      icon: "💧", name: "Göller", color: "#0e7490", tries: 1, type: "features",
      tag: "göller · tek hak",
      desc: "Türkiye'nin önemli göllerini haritada bul. Tek deneme!",
      prompt: "Sorulan gölün noktasını seç",
      features: [
        { name: "Van Gölü", kind: "point", pk: "65" },
        { name: "Tuz Gölü", kind: "point", pk: "68" },
        { name: "Beyşehir Gölü", kind: "point", pk: "42", dx: -22, dy: 8 },
        { name: "Eğirdir Gölü", kind: "point", pk: "32", dx: 6, dy: -6 },
        { name: "Burdur Gölü", kind: "point", pk: "15", dy: -8 },
        { name: "Salda Gölü", kind: "point", pk: "15", dx: -16, dy: 10 },
        { name: "İznik Gölü", kind: "point", pk: "16", dx: 10, dy: 4 },
        { name: "Sapanca Gölü", kind: "point", pk: "54", dy: 6 },
        { name: "Manyas (Kuş) Gölü", kind: "point", pk: "10", dx: 14, dy: -10 },
        { name: "Acıgöl", kind: "point", pk: "20", dx: -18 },
        { name: "Çıldır Gölü", kind: "point", pk: "75" },
        { name: "Hazar Gölü", kind: "point", pk: "23", dy: 8 },
        { name: "Bafa Gölü", kind: "point", pk: "09", dx: -10, dy: 14 },
      ],
    },

    /* ---------------- İklim Bilgisi ---------------- */
    iklimler: {
      icon: "🌤️", name: "İklim Tipleri", color: "#e0791b", tries: 1, type: "group",
      tag: "iklimler · tek hak",
      desc: "Akdeniz, Karadeniz, karasal ve geçiş iklimlerinin görüldüğü yerleri bul.",
      prompt: "Bu iklimin görüldüğü bir yere tıkla",
      groups: [
        { name: "Akdeniz İklimi", plakas: ["07","33","01","31","48","35","09"] },
        { name: "Karadeniz İklimi", plakas: ["53","61","52","28","55","57","08","41"] },
        { name: "Karasal İklim", plakas: ["06","42","58","25","65","44","66"] },
        { name: "Marmara (Geçiş) İklimi", plakas: ["34","16","10","59","22"] },
      ],
    },

    sicaklik: {
      icon: "🌡️", name: "Atmosfer ve Sıcaklık", color: "#ef5350", tries: 1, type: "group",
      tag: "sıcaklık · tek hak",
      desc: "Sıcaklığın en yüksek ve en düşük olduğu yerleri, karasallığı harita üzerinde tanı.",
      prompt: "Açıklamaya uyan yeri haritada seç",
      groups: [
        { name: "En yüksek sıcaklık ortalaması (en sıcak)", plakas: ["33","31","63","21"] },
        { name: "En düşük sıcaklık (en soğuk / yüksek-karasal)", plakas: ["25","36","75","04"] },
        { name: "Yıllık sıcaklık farkının en fazla olduğu yer (karasallık)", plakas: ["76","25","68"] },
        { name: "Kışın en ılıman kalan kıyılar", plakas: ["07","33","48"] },
        { name: "Yükselti nedeniyle sıcaklığın düştüğü Doğu Anadolu", plakas: ["30","65","62","24"] },
      ],
    },

    basincruzgar: {
      icon: "🌬️", name: "Basınç ve Rüzgârlar", color: "#0ea5e9", tries: 1, type: "group",
      tag: "yerel rüzgârlar · tek hak",
      desc: "Türkiye'de etkili yerel rüzgârların görüldüğü bölgeleri tanı.",
      prompt: "Bu rüzgârın etkili olduğu bölgeye tıkla",
      note: "Yerel rüzgârların etki alanları yaklaşık olarak gösterilmiştir.",
      groups: [
        { name: "Samyeli (Keşişleme) — sıcak-kuru", plakas: ["63","21","27"] },
        { name: "Yıldız — kuzeyden esen soğuk rüzgâr", plakas: ["55","61","57"] },
        { name: "Lodos — güneybatıdan sıcak rüzgâr", plakas: ["34","16","35"] },
        { name: "Karayel — kuzeybatıdan soğuk rüzgâr", plakas: ["59","10","22"] },
        { name: "Poyraz — kuzeydoğudan esen serin rüzgâr", plakas: ["34","41","54"] },
      ],
    },

    yagis: {
      icon: "🌧️", name: "Nem, Yağış ve Buharlaşma", color: "#2563eb", tries: 1, type: "group",
      tag: "yağış · tek hak",
      desc: "En çok/az yağış alan, en nemli ve buharlaşmanın en yüksek olduğu yerleri bul.",
      prompt: "Açıklamaya uyan yeri haritada seç",
      groups: [
        { name: "En çok yağış alan yer (Doğu Karadeniz)", plakas: ["53","61","08"] },
        { name: "En az yağış alan yer (Tuz Gölü çevresi / Iğdır)", plakas: ["68","42","76"] },
        { name: "Nemin en yüksek olduğu kıyılar", plakas: ["53","55","61"] },
        { name: "Buharlaşmanın en fazla olduğu yer (G.Doğu)", plakas: ["63","21","73"] },
        { name: "Kar yağışının en uzun sürdüğü yer (Doğu Anadolu)", plakas: ["25","36","30"] },
      ],
    },

    /* ---------------- Su, Toprak, Bitki ---------------- */
    sutoprakbitki: {
      icon: "🌿", name: "Su, Toprak ve Bitki Örtüsü", color: "#15803d", tries: 1, type: "group",
      tag: "bitki örtüsü · tek hak",
      desc: "Maki, bozkır, orman gibi doğal bitki örtülerinin görüldüğü yerleri bul.",
      prompt: "Bu bitki örtüsünün görüldüğü yere tıkla",
      groups: [
        { name: "Maki (Akdeniz kıyıları)", plakas: ["07","33","48","31","01"] },
        { name: "Bozkır / Step (İç Anadolu)", plakas: ["06","42","68","51"] },
        { name: "Gür Ormanlar (Karadeniz)", plakas: ["53","61","37","14"] },
        { name: "Antropojen Bozkır (G.Doğu)", plakas: ["63","21","47"] },
        { name: "Dağ Çayırları (Doğu Anadolu yükseltileri)", plakas: ["25","30","65"] },
      ],
    },

    toprak: {
      icon: "🟤", name: "Toprak Türleri", color: "#92400e", tries: 1, type: "group",
      tag: "toprak · tek hak",
      desc: "Toprak türlerinin görüldüğü yerleri haritadan seç.",
      prompt: "Bu toprak türünün görüldüğü ile tıkla",
      groups: [
        { name: "Terra Rossa (Kırmızı Akdeniz Toprağı)", plakas: ["07","33","01","48","31"] },
        { name: "Çernozyom (Kara Toprak)", plakas: ["25","36","75","76"] },
        { name: "Alüvyal Topraklar (Akarsu Ovaları)", plakas: ["55","09","45","10"] },
        { name: "Çöl / Kırmızımsı Kahverengi Topraklar", plakas: ["63","21","47"] },
        { name: "Kahverengi Orman Toprakları", plakas: ["53","61","14","37"] },
      ],
    },

    /* ---------------- Beşeri ve Ekonomik ---------------- */
    nufus: {
      icon: "👥", name: "Nüfus", color: "#7c3aed", tries: 1, type: "group",
      tag: "nüfus · tek hak",
      desc: "Nüfusun yoğun ve seyrek olduğu yerleri, sebepleriyle birlikte tanı.",
      prompt: "Açıklamaya uyan yeri haritada seç",
      groups: [
        { name: "En kalabalık il (İstanbul)", plakas: ["34"] },
        { name: "Nüfus yoğunluğunun en fazla olduğu bölge (Marmara)", plakas: ["34","41","16","77"] },
        { name: "Nüfusun seyrek olduğu engebeli yerler (Doğu Anadolu)", plakas: ["62","69","30","75"] },
        { name: "Sanayi nedeniyle nüfusun toplandığı yerler", plakas: ["41","16","35","06"] },
        { name: "Turizm nedeniyle nüfusu artan kıyılar", plakas: ["07","48"] },
      ],
    },

    goc: {
      icon: "🚚", name: "Göç", color: "#db2777", tries: 1, type: "group",
      tag: "göç · tek hak",
      desc: "En çok göç veren ve alan yerler ile mevsimlik göç hedeflerini tanı.",
      prompt: "Açıklamaya uyan yeri haritada seç",
      groups: [
        { name: "En çok göç alan iller", plakas: ["34","06","35","16","41"] },
        { name: "En çok göç veren bölgeler (Doğu / G.Doğu)", plakas: ["25","62","63","21","49"] },
        { name: "Mevsimlik tarım göçünün hedefi (Çukurova / GAP)", plakas: ["01","63","33"] },
        { name: "Karadeniz'den dışa göç veren iller", plakas: ["28","29","69","61"] },
      ],
    },

    yerlesme: {
      icon: "🏘️", name: "Yerleşme", color: "#0d9488", tries: 1, type: "group",
      tag: "yerleşme · tek hak",
      desc: "Toplu ve dağınık yerleşme ile yayla yerleşmesinin görüldüğü yerleri bul.",
      prompt: "Açıklamaya uyan yerleşme tipinin görüldüğü yere tıkla",
      groups: [
        { name: "Toplu yerleşme (su kaynağı az — İç Anadolu / G.Doğu)", plakas: ["42","68","63","21"] },
        { name: "Dağınık yerleşme (su bol, engebeli — Karadeniz)", plakas: ["53","61","37","52"] },
        { name: "Yayla yerleşmesinin yaygın olduğu yerler", plakas: ["53","25","08"] },
        { name: "Büyük kentsel yerleşmeler (metropoller)", plakas: ["34","06","35"] },
      ],
    },

    ekonomi: {
      icon: "🏭", name: "Ekonomik Faaliyetler", color: "#ca8a04", tries: 1, type: "group",
      tag: "tarım & ekonomi · tek hak",
      desc: "Tarım ürünleri, madenler ve turizmin öne çıktığı yerleri haritada bul.",
      prompt: "Bu faaliyetin/ürünün öne çıktığı yere tıkla",
      groups: [
        { name: "Fındık (Doğu Karadeniz)", plakas: ["28","52","61","55","08"] },
        { name: "Çay (Rize çevresi)", plakas: ["53","08"] },
        { name: "Pamuk (Çukurova / GAP / Ege)", plakas: ["01","63","09"] },
        { name: "İncir (Aydın)", plakas: ["09"] },
        { name: "Kayısı (Malatya)", plakas: ["44"] },
        { name: "Antep Fıstığı (G.Antep / Şanlıurfa)", plakas: ["27","63"] },
        { name: "Zeytin (Ege–Marmara–Akdeniz kıyıları)", plakas: ["10","35","45","16","31"] },
        { name: "Deniz Turizmi (Antalya / Muğla)", plakas: ["07","48"] },
      ],
    },

  },
};
