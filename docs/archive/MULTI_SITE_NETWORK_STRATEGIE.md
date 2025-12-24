# 🏗️ Multi-Site Directory Network Strategie

## 🎯 Concept: Specialized Niche Directories

In plaats van één algemene "klusser" site, bouw je **10-20 ultra-specifieke sites** die allemaal draaien op **één codebase** met **één centraal admin dashboard**.

---

## 🌐 Domein Portfolio

### **Kern Diensten (Hoogste Volume)**
```
🔌 elektricienindebuurt.nl     (60K+ zoekvol/maand)
🚰 loodgieterindebuurt.nl      (50K+ zoekvol/maand)
🎨 schilderindebuurt.nl        (40K+ zoekvol/maand)
🏠 dakdekkerindebuurt.nl       (20K+ zoekvol/maand)
🔨 timmermanindebuurt.nl       (15K+ zoekvol/maand)
```

### **Specialistische Diensten**
```
🗝️ slotenmakerindebuurt.nl    (Hoge urgentie = €€€)
🌡️ cv-monteurindebuurt.nl      (Winter = piek)
🪟 glaszettterindebuurt.nl     (Spoed + verzekering)
🧱 stukadoorindebuurt.nl       (Grote projecten)
🏡 hovenierindebuurt.nl        (Seizoensgebonden)
🧹 schoorsteenvegerindebuurt.nl (Verplicht onderhoud)
⚡ zonnepanelenmonteur.nl       (Trending ↑)
🚪 kozijnspecialist.nl         (Subsidies)
```

### **Service Diensten**
```
🧹 schoonmakerindebuurt.nl
🚛 verhuizerindebuurt.nl
💨 aircomonteurindebuurt.nl
🐜 ongediertebestrijder.nl
```

---

## 💻 Technical Architecture

### **1. Single Codebase, Multiple Brands**

```typescript
// app/[domain]/layout.tsx
export default function DomainLayout({ 
  params: { domain } 
}: { 
  params: { domain: string } 
}) {
  const config = getDomainConfig(domain);
  
  return (
    <html>
      <head>
        <title>{config.title}</title>
        <meta name="theme-color" content={config.primaryColor} />
      </head>
      <body className={config.className}>
        {children}
      </body>
    </html>
  );
}

// Domain configuration
const DOMAIN_CONFIGS = {
  'elektricienindebuurt.nl': {
    title: 'Vind een Betrouwbare Elektricien',
    primaryColor: '#FFB800', // Geel
    icon: '🔌',
    services: ['elektricien'],
    urgencyMultiplier: 1.5,
    averageLeadPrice: 35
  },
  'loodgieterindebuurt.nl': {
    title: 'Vind een Loodgieter - 24/7 Spoed',
    primaryColor: '#2196F3', // Blauw
    icon: '🚰',
    services: ['loodgieter', 'cv-monteur'],
    urgencyMultiplier: 2.0,
    averageLeadPrice: 45
  },
  // etc...
};
```

### **2. Shared Database, Domain Filtering**

```sql
-- Single companies table, multiple domains
ALTER TABLE companies ADD COLUMN domains TEXT[];

-- Example: A company can be on multiple sites
UPDATE companies 
SET domains = ARRAY[
  'elektricienindebuurt.nl',
  'loodgieterindebuurt.nl'
] 
WHERE services @> ARRAY['elektricien', 'loodgieter'];

-- Domain-specific queries
SELECT * FROM companies 
WHERE domains @> ARRAY['elektricienindebuurt.nl']
AND is_active = true;
```

### **3. Centralized Admin Dashboard**

```typescript
// admin.alledienstenmanager.nl

interface AdminDashboard {
  // Overview all sites
  sites: {
    domain: string
    leads_today: number
    revenue_today: number
    active_companies: number
  }[]
  
  // Manage companies across sites
  companies: {
    manageCompany(companyId: string): {
      activeDomains: string[]
      toggleDomain(domain: string): void
      setDomainPricing(domain: string, price: number): void
    }
  }
  
  // Unified lead management
  leads: {
    viewAllLeads(filters?: { domain?: string }): Lead[]
    routeLead(leadId: string, domains: string[]): void
  }
}
```

---

## 💰 Revenue Multiplication Strategy

### **Waarom Dit Werkt:**

1. **Hogere Conversie**
   - Elektricien zoekt → elektricienindebuurt.nl = 8% conversie
   - Elektricien zoekt → klusserindebuurt.nl = 2% conversie

2. **Betere SEO**
   - Exact match domains
   - Hyper-relevant content
   - Niche authority

3. **Premium Pricing**
   - Specialist lead = €40-60
   - Generalist lead = €15-25

4. **Cross-sell Mogelijkheden**
   ```
   Klant op loodgieterindebuurt.nl heeft lekkage
   → Ook cv-monteur nodig?
   → Ook elektricien voor nieuwe boiler?
   ```

---

## 🚀 Rollout Strategy

### **Phase 1: Top 5 (Maand 1)**
Start met hoogste volume + urgentie:
1. elektricienindebuurt.nl
2. loodgieterindebuurt.nl
3. slotenmakerindebuurt.nl
4. schilderindebuurt.nl
5. dakdekkerindebuurt.nl

### **Phase 2: Expand (Maand 2-3)**
Voeg specialisten toe:
6. cv-monteurindebuurt.nl
7. glaszettterindebuurt.nl
8. timmermanindebuurt.nl
9. stukadoorindebuurt.nl
10. hovenierindebuurt.nl

### **Phase 3: Long Tail (Maand 4-6)**
Niche diensten:
- schoorsteenvegerindebuurt.nl
- zonnepanelenmonteur.nl
- ongediertebestrijder.nl
- etc.

---

## 📊 Business Model Per Site

### **Elektricienindebuurt.nl Example**

```yaml
Zoekvolume: 60,500/maand
Gemiddelde CPC: €4.50
Lead conversie: 8%

Monetization:
- Lead price: €35-45 (standaard)
- Spoed lead: €75 (avond/weekend)
- Subscription: €149/maand unlimited leads in postcode

Projected (Year 1):
- Traffic: 20,000/maand
- Leads: 1,600/maand
- Revenue: €56,000/maand
- Costs: €8,000/maand
- Profit: €48,000/maand
```

---

## 🎯 Competitive Advantages

### **1. Niche Authority**
"DE site voor elektriciens" vs "Een van de vele klusser sites"

### **2. Trust & Conversion**
- Dedicated support team per niche
- Specialized content
- Industry-specific features

### **3. Pricing Power**
- Loodgieter betaalt €45/lead op dedicated site
- Zelfde loodgieter betaalt €20/lead op general site

### **4. SEO Dominantie**
- Rank #1 voor "elektricien [stad]" (alle 350 gemeenten)
- Featured snippets
- Local pack dominantie

---

## 🔧 Technical Implementation

### **Multi-Domain Setup (Vercel)**

```javascript
// vercel.json
{
  "rewrites": [
    {
      "source": "/:path*",
      "destination": "https://app.allservices.nl/:path*"
    }
  ],
  "domains": [
    "elektricienindebuurt.nl",
    "loodgieterindebuurt.nl",
    "schilderindebuurt.nl"
  ]
}
```

### **Domain Detection Middleware**

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host');
  const domain = hostname?.replace('www.', '');
  
  // Add domain to request
  request.headers.set('x-domain', domain);
  
  // Domain-specific logic
  if (domain === 'slotenmakerindebuurt.nl') {
    // Enable 24/7 mode
    request.headers.set('x-urgent-mode', 'true');
  }
  
  return NextResponse.next();
}
```

### **Shared Components, Domain Styling**

```typescript
// components/HeroSection.tsx
export function HeroSection() {
  const domain = useDomain();
  const config = DOMAIN_CONFIGS[domain];
  
  return (
    <section 
      className="hero"
      style={{ backgroundColor: config.primaryColor }}
    >
      <h1>
        Vind een Betrouwbare {config.profession} 
        in {city}
      </h1>
      <LeadForm 
        services={config.services}
        urgencyEnabled={config.urgencyEnabled}
      />
    </section>
  );
}
```

---

## 💎 Premium Features Per Niche

### **Slotenmakerindebuurt.nl**
- Live tracker ("Slotenmaker onderweg")
- Verzekering check
- Politie rapport upload

### **Dakdekkerindebuurt.nl**
- Drone inspectie booking
- Storm schade meldingen
- Verzekering afhandeling

### **CV-monteurindebuurt.nl**
- Onderhoudscontracten
- Storingsdienst 24/7
- Energie labels

---

## 📈 Financial Projections

### **Network Effect (20 sites)**

```
Per site average:
- Revenue: €30,000/maand
- Costs: €5,000/maand
- Profit: €25,000/maand

Total Network:
- Revenue: €600,000/maand
- Costs: €100,000/maand
- Profit: €500,000/maand
- Yearly: €6M profit

Valuation: 3-5x revenue = €21-36M
```

---

## 🎯 Exit Strategy

### **Strategic Buyers:**
1. **Werkspot/Zoofy** - Eliminate competition
2. **Angie's List** (US) - European entry
3. **Private Equity** - Roll-up play
4. **Individual Sales** - Sell sites separately

### **Why This Works:**
- Each site is a standalone business
- Proven model × 20
- Diversified risk
- Multiple exit options

---

## ✅ Action Plan

### **Week 1: Domain Shopping**
```bash
Registreer NU (voor iemand anders het doet):
□ elektricienindebuurt.nl
□ loodgieterindebuurt.nl
□ slotenmakerindebuurt.nl
□ schilderindebuurt.nl
□ dakdekkerindebuurt.nl

Budget: €250 (voor 20 domeinen)
```

### **Week 2: Build Core**
- Multi-domain routing
- Shared components
- Domain configurations
- Admin dashboard

### **Week 3: Launch First 3**
- elektricienindebuurt.nl (hoogste volume)
- loodgieterindebuurt.nl (hoogste urgentie)
- slotenmakerindebuurt.nl (hoogste marge)

### **Month 2-3: Scale**
- Add 2-3 sites per week
- Optimize based on data
- Hire VA voor content

---

*"Why build one €100K business when you can build twenty €50K businesses with the same effort?"*