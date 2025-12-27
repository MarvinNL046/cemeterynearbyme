# CemeteryNearMe.com - Improvement Roadmap

## 🔴 Priority 1: Performance (Direct AdSense Impact)

| Task | Impact | Effort | Status |
|------|--------|--------|--------|
| **Reduce Total Blocking Time** | High | Medium | 🟡 In Progress |
| - Defer cookie consent loading | | | ✅ Done |
| - Lazy load below-fold components | | | ✅ Done |
| - Split JS bundles with `next/dynamic` | | | ✅ Done |
| **Fix LCP (Largest Contentful Paint)** | High | Medium | 🔲 Todo |
| - Preload hero images | | | |
| - Move cookie banner out of LCP path | | | |
| **Reduce unused JavaScript** | Medium | Low | 🔲 Todo |
| - Tree-shake unused dependencies | | | |
| - Analyze bundle with `@next/bundle-analyzer` | | | |

---

## 🟠 Priority 2: SEO & Discoverability

| Task | Impact | Effort | Status |
|------|--------|--------|--------|
| **Add metadataBase** to layout.tsx | Medium | Low | ✅ Done |
| **Internal linking optimization** | High | Medium | 🔲 Todo |
| - Add "related cemeteries" to more pages | | | |
| - Cross-link guides ↔ cemetery pages | | | |
| **Rich snippets verbeteren** | Medium | Low | 🔲 Todo |
| - Add FAQ schema to more pages | | | |
| - Add breadcrumb schema consistently | | | |
| **Blog content uitbreiden** | High | High | 🔲 Todo |
| - Add 20+ more articles | | | |
| - Target long-tail keywords | | | |

---

## 🟡 Priority 3: User Features

| Task | Impact | Effort | Status |
|------|--------|--------|--------|
| **Newsletter system implementeren** | Medium | Medium | 🔲 Todo |
| - Backend for email capture | | | |
| - Welcome email flow | | | |
| - Weekly digest of notable deaths | | | |
| **User profiles uitbreiden** | Medium | Medium | 🔲 Todo |
| - Show saved favorites | | | |
| - Show submitted reviews | | | |
| - Contribution badges | | | |
| **"Near Me" geolocation** | High | Medium | 🔲 Todo |
| - Browser geolocation API | | | |
| - PostGIS radius search | | | |
| - "Cemeteries within X miles" | | | |
| **Advanced filters** | Medium | Medium | 🔲 Todo |
| - Filter by rating | | | |
| - Filter by facilities | | | |
| - Filter by year established | | | |

---

## 🟢 Priority 4: Content & Engagement

| Task | Impact | Effort | Status |
|------|--------|--------|--------|
| **Famous Graves verbeteren** | High | Medium | 🔲 Todo |
| - Add photos of famous graves | | | |
| - Add "Visit this grave" guides | | | |
| - Cemetery walking tours | | | |
| **User-generated content** | Medium | High | 🔲 Todo |
| - Allow photo uploads | | | |
| - "I visited this cemetery" stories | | | |
| - Memorial tributes | | | |
| **Seasonal content** | Medium | Low | 🔲 Todo |
| - Memorial Day guide | | | |
| - Veterans Day content | | | |
| - Halloween/spooky cemeteries | | | |

---

## 🔵 Priority 5: Monetization

| Task | Impact | Effort | Status |
|------|--------|--------|--------|
| **AdSense optimalisatie** | High | Low | 🔲 Todo |
| - A/B test ad placements | | | |
| - Add more ad slots strategically | | | |
| **Affiliate partnerships** | High | Medium | 🔲 Todo |
| - Funeral homes directory | | | |
| - Flower delivery services | | | |
| - Genealogy services (Ancestry, FindAGrave) | | | |
| **Premium features** | Medium | High | 🔲 Todo |
| - Cemetery claim/verification service | | | |
| - Featured listings for funeral homes | | | |
| - API access for developers | | | |

---

## 🟣 Priority 6: Technical Improvements

| Task | Impact | Effort | Status |
|------|--------|--------|--------|
| **Database optimization** | Medium | Medium | 🔲 Todo |
| - Add PostGIS for geo queries | | | |
| - Optimize slow queries | | | |
| - Add database indexes | | | |
| **Image optimization** | Medium | Medium | 🔲 Todo |
| - Convert all images to WebP | | | |
| - Add blur placeholders | | | |
| - Optimize placeholder SVGs | | | |
| **Error monitoring** | Medium | Low | 🔲 Todo |
| - Add Sentry for error tracking | | | |
| - Add uptime monitoring | | | |
| **Testing** | Medium | High | 🔲 Todo |
| - Add E2E tests with Playwright | | | |
| - Add unit tests for API routes | | | |

---

## ⚪ Priority 7: Future Features

| Task | Impact | Effort | Status |
|------|--------|--------|--------|
| **Mobile app (PWA verbeteringen)** | Medium | High | 🔲 Todo |
| - Push notifications | | | |
| - Offline cemetery viewing | | | |
| - GPS navigation to cemetery | | | |
| **Virtual cemetery tours** | High | Very High | 🔲 Todo |
| - 360° photo integration | | | |
| - Google Street View embed | | | |
| **Genealogy integration** | High | High | 🔲 Todo |
| - FindAGrave API | | | |
| - BillionGraves integration | | | |
| - Family tree connections | | | |
| **Multi-language** | Medium | Very High | 🔲 Todo |
| - Spanish (large US market) | | | |
| - i18n framework setup | | | |

---

## 📊 Quick Wins (< 1 day each)

- [x] Add `metadataBase` to fix OG image warnings
- [ ] Install bundle analyzer
- [ ] Add preload for hero image
- [x] Defer AdSense loading
- [ ] Add more internal links in footer
- [ ] Create Memorial Day landing page
- [ ] Add "Share" buttons to cemetery pages
- [ ] Improve 404 page with search

---

## 📈 Recommended First Sprint

1. **Performance fixes** → Improve Lighthouse to 80+
2. **Newsletter backend** → Start building email list
3. **Near Me geolocation** → High-value user feature
4. **10 new blog articles** → More SEO traffic

---

## 📅 Changelog

- **2024-12-27**: Initial roadmap created
- **2024-12-27**: Lazy loading implemented for client components
- **2024-12-27**: AdSense deferred to lazyOnload
- **2024-12-27**: Added metadataBase for OG images
