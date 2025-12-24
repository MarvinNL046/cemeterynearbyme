# 🛠️ KlusserInDeBuurt - Technical Architecture

## 🏗️ Tech Stack Overview

### **Frontend**
```
Framework: Next.js 14 (App Router)
UI Library: Shadcn/ui + Tailwind CSS
State Management: Zustand
Forms: React Hook Form + Zod
Maps: Mapbox GL (voor service areas)
Real-time: Socket.io / Pusher
PWA: next-pwa (mobile app feel)
```

### **Backend**
```
API: Next.js API Routes + tRPC
Database: PostgreSQL (Supabase)
Auth: Supabase Auth + Clerk (voor admin)
File Storage: Supabase Storage / Cloudinary
Queue: BullMQ + Redis (lead distribution)
Payments: Stripe + Mollie
Email/SMS: Resend + Twilio/MessageBird
```

### **Infrastructure**
```
Hosting: Vercel (frontend) + Supabase (backend)
CDN: Vercel Edge Network
Monitoring: Sentry + Vercel Analytics
Search: Algolia / Meilisearch
Caching: Vercel Edge Cache + Redis
```

---

## 🗄️ Database Schema

### **Core Tables**

```sql
-- Companies (Klussers/Bedrijven)
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  kvk_number VARCHAR(20),
  
  -- Subscription
  subscription_tier ENUM('free', 'bronze', 'silver', 'gold') DEFAULT 'free',
  subscription_ends_at TIMESTAMP,
  credits_remaining INTEGER DEFAULT 0,
  
  -- Profile
  description TEXT,
  logo_url VARCHAR(500),
  cover_image_url VARCHAR(500),
  website VARCHAR(255),
  
  -- Location
  address VARCHAR(255),
  city VARCHAR(100),
  postal_code VARCHAR(10),
  province VARCHAR(50),
  coordinates POINT,
  service_radius_km INTEGER DEFAULT 25,
  
  -- Status
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Services (Diensten die klussers aanbieden)
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(50),
  icon VARCHAR(50),
  average_lead_price DECIMAL(10,2)
);

-- Company Services (Many-to-Many)
CREATE TABLE company_services (
  company_id UUID REFERENCES companies(id),
  service_id UUID REFERENCES services(id),
  is_primary BOOLEAN DEFAULT FALSE,
  is_emergency_available BOOLEAN DEFAULT FALSE,
  price_per_hour DECIMAL(10,2),
  PRIMARY KEY (company_id, service_id)
);

-- Service Areas (Werkgebieden)
CREATE TABLE service_areas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id),
  postal_code VARCHAR(10),
  city VARCHAR(100),
  is_primary BOOLEAN DEFAULT FALSE
);

-- Leads (Klantaanvragen)
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_number VARCHAR(20) UNIQUE,
  
  -- Customer Info
  customer_name VARCHAR(100),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20) NOT NULL,
  
  -- Lead Details
  service_id UUID REFERENCES services(id),
  description TEXT NOT NULL,
  urgency ENUM('immediate', 'today', 'week', 'month') DEFAULT 'week',
  budget_indication VARCHAR(50),
  
  -- Location
  address VARCHAR(255),
  postal_code VARCHAR(10) NOT NULL,
  city VARCHAR(100),
  coordinates POINT,
  
  -- Metadata
  source VARCHAR(50) DEFAULT 'website',
  ip_address INET,
  user_agent TEXT,
  
  -- Status
  status ENUM('new', 'distributed', 'claimed', 'completed', 'cancelled') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Lead Distributions (Welke klusser kreeg welke lead)
CREATE TABLE lead_distributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id),
  company_id UUID REFERENCES companies(id),
  
  -- Distribution Info
  sent_at TIMESTAMP DEFAULT NOW(),
  viewed_at TIMESTAMP,
  claimed_at TIMESTAMP,
  rejected_at TIMESTAMP,
  
  -- Pricing
  price DECIMAL(10,2) NOT NULL,
  is_paid BOOLEAN DEFAULT FALSE,
  paid_at TIMESTAMP,
  
  -- Performance
  response_time_seconds INTEGER,
  
  PRIMARY KEY (lead_id, company_id)
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id),
  lead_id UUID REFERENCES leads(id),
  
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  customer_name VARCHAR(100),
  
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Transactions (Betalingen)
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id),
  
  type ENUM('lead_purchase', 'subscription', 'credit_topup') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  credits INTEGER,
  
  stripe_payment_id VARCHAR(255),
  mollie_payment_id VARCHAR(255),
  
  status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Admin Users
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  role ENUM('super_admin', 'support', 'sales') DEFAULT 'support',
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 👔 Admin Panel Features

### **1. Dashboard Overview**
```typescript
// Real-time metrics
- Active leads today
- Revenue today/week/month
- Top performing klussers
- Lead response times
- Conversion rates
```

### **2. Lead Management**
```typescript
interface LeadManagement {
  // View all leads
  viewLeads(filters: LeadFilters): Lead[]
  
  // Manual distribution
  distributeLead(leadId: string, companyIds: string[]): void
  
  // Edit/moderate leads
  editLead(leadId: string, updates: Partial<Lead>): void
  
  // Refund/cancel
  refundLead(leadId: string, reason: string): void
}
```

### **3. Company Management**
```typescript
interface CompanyAdmin {
  // Verification
  verifyCompany(companyId: string): void
  
  // Subscription management
  upgradeSubscription(companyId: string, tier: Tier): void
  
  // Credit management
  addCredits(companyId: string, amount: number): void
  
  // Performance metrics
  getCompanyMetrics(companyId: string): CompanyMetrics
}
```

### **4. Financial Dashboard**
```typescript
interface FinancialDashboard {
  revenue: {
    daily: ChartData
    monthly: ChartData
    bySource: PieChartData
  }
  
  payouts: {
    pending: Transaction[]
    completed: Transaction[]
  }
  
  invoicing: {
    generateInvoice(companyId: string, period: DateRange): PDF
    bulkInvoicing(): void
  }
}
```

---

## 🏢 Klusser Portal Features

### **1. Lead Inbox**
```typescript
// Real-time lead notifications
interface LeadInbox {
  newLeads: Lead[]        // Nieuwe leads
  myLeads: Lead[]         // Geclaimed leads
  archivedLeads: Lead[]   // Historie
  
  // Quick actions
  claimLead(leadId: string): Promise<void>
  rejectLead(leadId: string, reason: string): void
  contactCustomer(leadId: string): void
}
```

### **2. Profile Management**
```typescript
interface CompanyProfile {
  // Basic info
  updateProfile(updates: ProfileUpdate): void
  
  // Service areas
  addServiceArea(postalCode: string): void
  removeServiceArea(postalCode: string): void
  
  // Services & pricing
  updateServices(services: ServiceConfig[]): void
  setEmergencyAvailability(available: boolean): void
  
  // Portfolio
  uploadPhotos(files: File[]): void
  addProjectCase(project: ProjectCase): void
}
```

### **3. Analytics Dashboard**
```typescript
interface CompanyAnalytics {
  // Performance metrics
  leadStats: {
    received: number
    claimed: number
    conversionRate: number
    avgResponseTime: number
  }
  
  // Financial
  financial: {
    spent: number
    leadsPerEuro: number
    roi: number
  }
  
  // Reviews
  reviewStats: {
    average: number
    total: number
    recent: Review[]
  }
}
```

### **4. Billing & Credits**
```typescript
interface Billing {
  // Current balance
  credits: number
  subscription: Subscription
  
  // Top-up credits
  purchaseCredits(amount: number): void
  
  // Auto-refill
  setAutoRefill(threshold: number, amount: number): void
  
  // Invoices
  invoices: Invoice[]
  downloadInvoice(invoiceId: string): PDF
}
```

---

## 🔄 Lead Distribution Algorithm

```typescript
class LeadDistributor {
  async distributeLead(lead: Lead) {
    // 1. Find eligible companies
    const eligibleCompanies = await this.findEligibleCompanies({
      service: lead.service_id,
      postalCode: lead.postal_code,
      urgency: lead.urgency
    });
    
    // 2. Score and rank companies
    const scoredCompanies = eligibleCompanies
      .map(company => ({
        company,
        score: this.calculateScore(company, lead)
      }))
      .sort((a, b) => b.score - a.score);
    
    // 3. Select top 3 (or based on tier)
    const selectedCompanies = scoredCompanies
      .slice(0, 3)
      .map(item => item.company);
    
    // 4. Send notifications
    for (const company of selectedCompanies) {
      await this.notifyCompany(company, lead);
      await this.createDistribution(lead, company);
    }
    
    // 5. Start claim timer (first come, first serve)
    this.startClaimTimer(lead, selectedCompanies);
  }
  
  calculateScore(company: Company, lead: Lead): number {
    let score = 0;
    
    // Subscription tier bonus
    score += company.tier === 'gold' ? 100 : 
             company.tier === 'silver' ? 50 : 
             company.tier === 'bronze' ? 25 : 0;
    
    // Distance penalty
    const distance = calculateDistance(company.coordinates, lead.coordinates);
    score -= distance * 2;
    
    // Response time bonus
    score += (100 - company.avg_response_time_seconds / 60);
    
    // Review score bonus
    score += company.average_rating * 20;
    
    // Specialization bonus
    if (company.primary_service === lead.service_id) {
      score += 50;
    }
    
    return score;
  }
}
```

---

## 🔐 Security & Authentication

### **Multi-level Authentication**
```typescript
// Customer: No auth needed for lead submission
// Klusser: Supabase Auth + 2FA optional
// Admin: Clerk Auth + mandatory 2FA

middleware.ts:
- /api/leads/* - Public
- /api/company/* - Requires company auth
- /api/admin/* - Requires admin auth
- /dashboard/* - Company portal
- /admin/* - Admin panel
```

### **API Rate Limiting**
```typescript
const rateLimits = {
  leadSubmission: '5 per hour per IP',
  companyAPI: '100 per minute per company',
  publicAPI: '20 per minute per IP'
};
```

---

## 📱 Mobile Responsiveness

### **Progressive Web App**
```typescript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

// Features:
- Push notifications for new leads
- Offline capability for viewing claimed leads
- One-tap claim from notification
- Camera access for uploading work photos
```

---

## 🚀 Development Phases

### **Phase 1: MVP (Week 1-2)**
- Basic lead submission form
- Simple admin panel
- Manual lead distribution
- Basic company profiles

### **Phase 2: Automation (Week 3-4)**
- Automated lead distribution
- Payment integration
- SMS/Email notifications
- Company self-service portal

### **Phase 3: Scale (Month 2)**
- Advanced matching algorithm
- Review system
- Mobile apps
- API for partners

### **Phase 4: AI Features (Month 3)**
- Lead quality scoring
- Price optimization
- Demand forecasting
- Chatbot for customers

---

## 💰 Monetization Implementation

### **Credit System**
```typescript
const CREDIT_PACKAGES = {
  starter: { credits: 10, price: 99, bonus: 0 },
  professional: { credits: 25, price: 199, bonus: 5 },
  enterprise: { credits: 60, price: 399, bonus: 15 }
};

const LEAD_COSTS = {
  standard: 1, // 1 credit
  urgent: 2,   // 2 credits
  project: 3   // 3 credits (>€1000)
};
```

### **Subscription Tiers**
```typescript
const SUBSCRIPTIONS = {
  bronze: {
    price: 29,
    features: ['10_leads_month', 'basic_profile', 'email_support']
  },
  silver: {
    price: 49,
    features: ['25_leads_month', 'enhanced_profile', 'priority_support', 'analytics']
  },
  gold: {
    price: 99,
    features: ['unlimited_leads', 'premium_profile', '24_7_support', 'api_access', 'first_priority']
  }
};
```

---

*"Een platform dat vanaf dag 1 schaalbaar is. Van 10 tot 10.000 klussers zonder architectuur changes."*