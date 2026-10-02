# React + Ruby on Rails Proje Yol Haritası

Bu belge, portföy için birlikte geliştirilecek 5 projenin fikir ve mimari özetini içerir. Her proje React (frontend) + Ruby on Rails (API backend) + bir AI servisinin (OpenAI/Anthropic/Google Vision vb.) API key ile entegrasyonunu kapsar.

---

## 1. AI Destekli Kod İnceleme / PR Asistanı

**Problem:** Geliştiriciler PR incelemelerinde güvenlik açığı, kod kalitesi ve best-practice konularında insan gözünün gözden kaçırdığı noktaları kaçırabiliyor.

**Stack:** Rails API + React dashboard + GitHub OAuth + Sidekiq + Anthropic/OpenAI API

**Özellikler:**
- GitHub repo bağlama, açık PR'ları listeleme
- GitHub webhook ile PR event'lerini dinleme
- Diff'i AI'ya gönderip güvenlik/kod kalitesi/best-practice analizi üretme (async job ile)
- React'te diff viewer + satır satır AI yorumları gösteren arayüz

**Zorluk/değer noktası:** Webhook + async job mimarisi, gerçek bir dev-tool problemi, GitHub API entegrasyonu.

---

## 2. AI Destekli Finansal Belge Analizi / Bütçe Asistanı

**Problem:** Fiş/fatura takibi manuel ve zaman alıcı; harcama kategorize etmek sıkıcı.

**Stack:** Rails API + React + OCR API (Google Vision/Tesseract) + LLM API + Active Storage + PostgreSQL

**Özellikler:**
- Fiş/fatura fotoğrafı yükleme
- OCR ile metin çıkarma → LLM ile kategori/tutar/tarih etiketleme (structured output)
- Aylık harcama trendleri ve kategori dağılımı için grafikli dashboard

**Zorluk/değer noktası:** Multi-step AI pipeline (OCR → LLM parse → structured data), dosya yönetimi, gerçek dünya problemi.

---

## 3. RAG Tabanlı Kurumsal Destek Chatbot Platformu

**Problem:** Şirketlerin kendi dokümanlarına dayalı, güncel ve doğru cevap veren bir destek botu kurması zor ve pahalı.

**Stack:** Rails API + React embeddable widget + pgvector (PostgreSQL) + Embedding API + LLM API

**Özellikler:**
- PDF/markdown doküman yükleme → chunk'lama → embedding üretme → pgvector'de saklama
- Soru sorulduğunda benzer chunk'ları çekme (similarity search) → LLM'e context olarak verme → cevap üretme
- Herhangi bir siteye gömülebilen React widget (iframe/script)

**Zorluk/değer noktası:** RAG mimarisi (günümüzün en talep edilen AI becerisi), vector search, embeddable component tasarımı.

---

## 4. AI Destekli İş İlanı / CV Eşleştirme Platformu

**Problem:** İşe alım sürecinde CV-ilan eşleştirmesi genelde kelime bazlı ve yüzeysel; neden eşleştiği/eşleşmediği açıklanamıyor.

**Stack:** Rails API + React + Devise (iki rol: employer/candidate) + Embedding API + LLM API

**Özellikler:**
- İşveren ilan girişi, aday CV yükleme
- CV ve ilan metinlerini embedding'e çevirip cosine similarity ile skorlama
- LLM ile "neden eşleşti/eşleşmedi" açıklaması üretme (açıklanabilirlik katmanı)
- Employer ve candidate için ayrı dashboard'lar

**Zorluk/değer noktası:** İki rollü SaaS mantığı, embedding tabanlı skorlama + LLM ile açıklanabilirlik.

---

## 5. AI Destekli İçerik/SEO Üretim ve Yayın Platformu (Mini SaaS)

**Problem:** İçerik üretimi zaman alıcı; SEO optimizasyonu ayrı bir uzmanlık gerektiriyor.

**Stack:** Rails API + React + Stripe + LLM API

**Özellikler:**
- Konu/anahtar kelime girişiyle AI taslak içerik üretimi (blog/sosyal medya)
- SEO skoru hesaplama ve düzenleme önerileri
- Stripe ile ücretli plan/kota sistemi (kullanım bazlı limitleme)
- Token kullanımı loglama ve maliyet takibi

**Zorluk/değer noktası:** Production-level SaaS detayları (abonelik, kota, rate limiting, maliyet yönetimi), sadece "AI çağır, metni göster" değil.

---

## Genel Notlar

- API key'leri **asla** GitHub'a commit etme: `.env` (frontend) + `rails credentials:edit` (Rails) kullan, `.gitignore`'a ekle.
- Her projede README'ye mimari diyagramı ve "neden bu AI entegrasyonu" açıklaması ekle.
- Sıralama önerisi: 1 → 2 → 4 → 5 → 3 (zorluk kademeli artacak şekilde; RAG projesi en karmaşık olanı olduğu için en sona bırakılabilir, ama bu tartışılabilir).

## Sonraki Adım

Hangi projeden başlayacağımıza karar verip o proje için:
- Rails API + React proje iskeletini kurma
- Veritabanı şeması tasarımı
- AI servis entegrasyon noktalarının planlanması

üzerinde çalışabiliriz.
