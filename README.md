# Spiral: Alışkanlık Takip Uygulaması 🚀

Bu uygulama, normalde "MOTA" ismiyle geliştirdiğim projenin "Spiral" adıyla sunulmuş halidir.

Spiral, alışkanlıklarınızı kolayca takip etmenizi ve yönetmenizi sağlayan modern bir web uygulamasıdır. Kullanıcı dostu arayüzü, görsel grafik desteği ve kategori bazlı filtreleme özellikleri ile alışkanlıklarınızı daha verimli bir şekilde izlemenize olanak tanır. Proje, `HTML`, `CSS` ve `JavaScript` kullanılarak geliştirilmiştir ve tüm verileri tarayıcınızın yerel depolama alanında (`localStorage`) saklar.

---

## ✨ Özellikler

* **Alışkanlık Yönetimi:** Yeni alışkanlıklar ekleyin, mevcut olanları düzenleyin veya silin.
* **Haftalık Takip:** Her alışkanlık için haftanın 7 gününü ayrı ayrı işaretleyin ve ilerlemenizi anlık olarak görün.
* **İlerleme Analizi:** Her alışkanlık için haftalık tamamlama oranını (% olarak) ve tamamlanan gün sayısını (`X/7`) görüntüleyin.
* **Kategoriye Göre Filtreleme:** Alışkanlıklarınızı "Spor", "Kitap Okuma", "Sağlık" gibi kategorilere ayırın ve ana sayfada bu kategorilere göre filtreleyin.
* **Arama Fonksiyonu:** Kayıtlı alışkanlıklarınız arasında isme göre hızlıca arama yapın.
* **Etkileşimli Takvim Sayfası:** Takvim görünümünde her gün kaç adet alışkanlığın tamamlandığını görün ve günlere tıklayarak alışkanlıkları doğrudan güncelleyin.
* **Görsel Raporlar:** `Chart.js` kütüphanesi kullanılarak oluşturulan dinamik çubuk grafiklerle haftalık performansınızı görsel olarak analiz edin.
    * Ana sayfa genel başarı grafiği.
    * Kategori sayfasına özel filtrelenmiş grafik.
    * Takvim sayfasına özel genel grafik.
* **Karanlık/Aydınlık Tema:** Göz zevkinize uygun tema geçişi yapın. Tema tercihiniz tarayıcıda saklanır.
* **Veri Depolama:** Tüm alışkanlık verileriniz tarayıcınızın `localStorage`'ında saklanır, böylece sayfayı yenilediğinizde verileriniz kaybolmaz.

---

## ⚙️ Kullanılan Teknolojiler

* **Frontend:** `HTML5`, `CSS`, `JavaScript`
* **Grafik Kütüphanesi:** `Chart.js`
* **Veri Depolama:** Tarayıcı `LocalStorage` API'si
