# EXPAT LEGAL VIETNAM - Website Project

## Mô tả project
Website conversion-focused cho dịch vụ tư vấn pháp lý dành cho expat tại Việt Nam. Mục tiêu: chuyển expat từ đọc content miễn phí sang đặt lịch tư vấn trả phí. 80% traffic từ mobile (Facebook groups).

## Tech stack
- **Astro** - Static site generator. Lý do: output HTML thuần, load cực nhanh (<2s), không ship JS thừa, hỗ trợ component-based development, dễ deploy lên bất kỳ hosting nào (Kimi, Vercel, Netlify, Cloudflare Pages).
- **Tailwind CSS** - Utility-first CSS. Lý do: consistent spacing/color system theo blueprint, purge CSS không dùng, responsive mobile-first built-in.
- **Vanilla JS** - Cho interactive elements (mobile menu, FAQ accordion, reading progress bar). Không cần React/Vue cho static content site.
- **Google Fonts** - Source Serif 4 (headings), DM Sans (body), JetBrains Mono (pricing/numbers).

## Failure modes (Lớp 1 - Inversion)
1. User click từ Facebook, trang load chậm -> bounce ngay. Giải pháp: Astro static HTML, lazy load images, preload fonts, target <2s load.
2. User đọc xong guide nhưng không book call -> không convert. Giải pháp: CTA xuất hiện ở 3 điểm mỗi trang (đầu, giữa, cuối). Sticky CTA bar trên mobile.
3. User không tin tưởng vì site trông như template. Giải pháp: Typography-driven design, không stock photo, testimonial thật (ẩn cho đến khi có), credential rõ ràng.
4. User cần giúp GẤP nhưng phải đọc bài dài -> bỏ. Giải pháp: Mỗi pillar page có "Need help now?" CTA ngay sau opening hook, trước content dài.
5. SEO yếu, Google không index -> không có organic traffic. Giải pháp: SSG output clean HTML, proper meta tags, schema markup, sitemap, semantic HTML.

## Kiểm tra kinh tế
1. **Ai dùng, bao lâu một lần?** Expat gặp vấn đề pháp lý tại VN. Frequency thấp (1-2 lần/năm) nhưng urgency cao và willingness to pay cao khi gặp vấn đề. Pillar pages thu hút traffic SEO liên tục.
2. **Giải pháp miễn phí đã có?** Facebook groups (rời rạc, không đáng tin), diễn đàn expat (outdated), Google search (kết quả tiếng Việt). App này hơn ở: content tiếng Anh có cấu trúc + path rõ ràng từ thông tin -> hành động (book call).
3. **Tính năng cắt được?** Blog, Resources/Downloads page, newsletter có thể làm sau. Core value là 5 pillar pages + booking flow.

## Milestones

### Milestone 1: Foundation + Homepage
- Setup Astro project, Tailwind config, color/font system
- Layout component (Nav + Footer)
- Homepage: tất cả 5 sections (Hero, Pain Points, Differentiators, Testimonials placeholder, Final CTA)
- Mobile responsive + SEO meta tags
- Demo được: Homepage hoàn chỉnh, click được navigation

### Milestone 2: Pillar Page Template + Renting page
- Tạo pillar page layout component (breadcrumb, TOC sticky, reading progress bar, lead magnet box, related guides, bottom CTA)
- Build trang /renting dùng template này với full content outline
- Demo được: Trang /renting hoàn chỉnh, TOC click scroll, responsive

### Milestone 3: Remaining Pillar Pages
- /family, /visa, /business, /documents
- Dùng lại template từ M2, chỉ thay content
- Demo được: Tất cả 5 pillar pages hoạt động

### Milestone 4: How It Works + About + Book
- /how-it-works (steps timeline, pricing cards, FAQ accordion)
- /about (profile layout, credentials, personal quote)
- /book (Calendly placeholder embed)
- Demo được: Full service flow từ learn -> understand pricing -> book

### Milestone 5: Blog Template + Resources + Polish
- /blog listing page + blog post template
- /resources (lead magnets download page, email capture placeholder)
- Global: reading progress bar, back-to-top button, smooth scroll
- Performance audit (Lighthouse > 90)
- Generate sitemap.xml, robots.txt
- Schema markup (LegalService structured data)
- Demo được: Complete site, ready for content + deploy

## Cấu trúc thư mục
```
expat-legal-vn/
├── CLAUDE.md
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── og-image.png          # Open Graph default image
├── src/
│   ├── layouts/
│   │   ├── BaseLayout.astro   # HTML head, fonts, analytics placeholder
│   │   ├── PageLayout.astro   # Nav + Footer wrapper
│   │   └── PillarLayout.astro # Pillar page template (TOC, progress bar, CTA)
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── PainPoints.astro
│   │   ├── Differentiators.astro
│   │   ├── Testimonials.astro
│   │   ├── CtaSection.astro
│   │   ├── CtaBar.astro       # Sticky mobile CTA
│   │   ├── PricingCard.astro
│   │   ├── FaqAccordion.astro
│   │   ├── LeadMagnet.astro
│   │   ├── ReadingProgress.astro
│   │   ├── BackToTop.astro
│   │   ├── TableOfContents.astro
│   │   └── Breadcrumb.astro
│   ├── pages/
│   │   ├── index.astro        # Homepage
│   │   ├── renting.astro
│   │   ├── family.astro
│   │   ├── visa.astro
│   │   ├── business.astro
│   │   ├── documents.astro
│   │   ├── how-it-works.astro
│   │   ├── about.astro
│   │   ├── book.astro
│   │   ├── resources.astro
│   │   └── blog/
│   │       ├── index.astro    # Blog listing
│   │       └── [slug].astro   # Blog post template
│   ├── content/
│   │   └── blog/              # Markdown blog posts
│   │       └── sample-post.md
│   ├── styles/
│   │   └── global.css         # Tailwind imports + custom utilities
│   └── data/
│       ├── testimonials.json  # Toggle visibility khi có review thật
│       ├── faq.json
│       └── services.json
```

## Coding conventions

### General
- File < 150 dòng. Tách component nếu dài hơn.
- Tên file: kebab-case cho pages, PascalCase cho components
- Comment tiếng Anh trong code
- Error messages cho end user: tiếng Anh (target audience là expat)

### Astro/HTML
- Semantic HTML: `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`
- Mỗi section có `id` để deep link và TOC
- Accessibility: proper heading hierarchy (h1 > h2 > h3), alt text, aria labels
- Images: lazy loading, width/height attributes, WebP format

### Tailwind
Custom colors trong `tailwind.config.mjs` (không hardcode hex trong template):
```js
navy:       '#1B3A5C'
amber:      '#E8913A'
surface:    '#FFFFFF'
background: '#FAFAF8'
text-primary: '#2D2D2D'
text-muted: '#6B7280'
success:    '#059669'
border:     '#E5E7EB'
```
- Breakpoints: mobile-first (default), `md:` (768px), `lg:` (1024px), `xl:` (1280px)
- Max content width: `max-w-3xl` (720px) cho reading, `max-w-6xl` (1152px) cho page

### JavaScript
- Vanilla JS only, no framework
- `<script>` tag trong Astro component (scoped)
- Progressive enhancement: site phải hoạt động không có JS

### SEO
- Mỗi page: unique `<title>`, `<meta description>`, Open Graph tags
- Schema markup: LegalService trên homepage
- Canonical URLs
- Sitemap auto-generated bởi `@astrojs/sitemap`

### Content
- Placeholder text dùng content từ blueprint (đã có sẵn)
- Testimonials: section ẩn mặc định, bật bằng flag trong `testimonials.json`
- Pricing: dùng data file, dễ update không cần sửa code
- "Last updated" date trên mỗi pillar page

## Design tokens
| Token         | Value                              |
|---------------|------------------------------------|
| Border radius | `rounded-xl` (12px) cho cards, `rounded-lg` (8px) cho buttons |
| Shadow        | `shadow-sm` mặc định, `shadow-md` hover |
| Transition    | `transition-all duration-200` cho hover effects |
| Section spacing | `py-20` mobile, `lg:py-30` desktop |
