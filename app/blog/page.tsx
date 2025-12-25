import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, BookOpen, Tag } from 'lucide-react';
import { Card } from '@/components/ui/card';
import LeaderboardAd from '@/components/ads/LeaderboardAd';
import InlineAd from '@/components/ads/InlineAd';
import PremiumContentBanner from '@/components/PremiumContentBanner';
import { blogPosts, categories } from '@/lib/blog-data';
import { getCtaStatsText } from '@/lib/stats-config';

const ctaStatsText = getCtaStatsText();

// Array of real cemetery images from our dataset
const cemeteryImages = [
  'https://lh3.googleusercontent.com/gps-cs-s/AC9h4npOmUScTyyCoKO6eW3IJvktSM3lFUuz2ss6Jx2UgULGY0H-JaXjWmMSR8Jb-0I2ldKROe77xAKiRUofd-IeXkq5tRZZDEl9IDkTHoNhglsm_ITDJ8vV7t9inO9t-HlBhfHCoRGI=w800-h500-k-no',
  'https://lh3.googleusercontent.com/p/AF1QipOFp8k2DdOqKqWJsB_TYlqoXqJquKNL_bvnoCTe=s1360-w1360-h1020',
  'https://lh3.googleusercontent.com/p/AF1QipMRu7nW5t3VOvNdCKNO2UiE0CQOcaHXQ6lBZr8=s1360-w1360-h1020',
  'https://lh3.googleusercontent.com/p/AF1QipNcrVxQ_n_1YwhCTGNi6lKNRJMLT6fFoiqhTMqT=s1360-w1360-h1020',
  'https://lh3.googleusercontent.com/p/AF1QipO0Y4OVAx0BSjO4Db1HjOx5DxvOgjKTl7Y5t0VI=s1360-w1360-h1020',
  'https://lh3.googleusercontent.com/p/AF1QipP7fZCJiJsvC1A-qMGST9_8M6aXKqrfGHY_x-vC=s1360-w1360-h1020',
  'https://lh3.googleusercontent.com/p/AF1QipMYx0fFvQfJa_fdUl2V6_sKaM1_IHnFi0z_DguC=s1360-w1360-h1020',
  'https://lh3.googleusercontent.com/p/AF1QipPRhN9KQYzBRMOBFz-OXnJf8VdcgfPqKGFsJWL1=s1360-w1360-h1020',
  'https://lh3.googleusercontent.com/p/AF1QipNVCpA_UEfGjCQzn_bvO9JVFfj1v0wvvHwL5_D1=s1360-w1360-h1020',
  'https://lh3.googleusercontent.com/p/AF1QipOy9jcP7KQBzE_EQnQnxoZ7I3M_FHJGnvBJKJzw=s1360-w1360-h1020',
  'https://lh3.googleusercontent.com/p/AF1QipP2IbBgVxJ7eMqDJGKNM0Y6vxJ7vJqH7VvbJfVP=s1360-w1360-h1020',
  'https://lh3.googleusercontent.com/p/AF1QipNVyNxE5M8f2vhiJGqzQcjwCYo0eP4Jy-bNLPaF=s1360-w1360-h1020',
  'https://lh3.googleusercontent.com/p/AF1QipOQJsKz7I6lRoJqFLRo7FjFfYUXqQCbGQQrTWd6=s1360-w1360-h1020',
  'https://lh3.googleusercontent.com/p/AF1QipMRu7nW5t3VOvNdCKNO2UiE0CQOcaHXQ6lBZr8=s1360-w1360-h1020',
  'https://lh3.googleusercontent.com/p/AF1QipN0L9EhQh3DRv1JKKgrqKwXKBQ2-hKCOV0K5v2C=s1360-w1360-h1020'
];

// Helper function to get a cemetery image based on post index
function getCemeteryImage(index: number): string {
  return cemeteryImages[index % cemeteryImages.length];
}

export const metadata: Metadata = {
  title: 'Blog | Cemetery Near Me - Articles about Cemeteries',
  description: 'Read interesting articles about cemeteries in the USA, funeral culture, history, costs, etiquette and practical tips for families.',
  keywords: 'cemetery blog, funeral culture, cemetery usa, cemetery history, headstones, green burial, cremation versus burial',
  authors: [{ name: 'Cemetery Near Me' }],
  openGraph: {
    title: 'Blog - Cemetery Near Me',
    description: 'Interesting articles about cemeteries, funerals and memorial culture in the USA',
    type: 'website',
    siteName: 'Cemetery Near Me',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Cemetery Near Me',
    description: 'Interesting articles about cemeteries and memorial culture in the USA',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <LeaderboardAd />

      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-primary-foreground/70">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li>/</li>
              <li className="text-white">Blog</li>
            </ol>
          </nav>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
            Blog
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl">
            Discover interesting stories, practical tips and historical backgrounds
            about cemeteries in the USA.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-8">
            <div>
              <div className="text-3xl font-bold text-gold-300">{blogPosts.length}</div>
              <div className="text-primary-foreground/70 text-sm">Articles</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gold-300">{categories.length}</div>
              <div className="text-primary-foreground/70 text-sm">Categories</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-4">
            {/* Sidebar */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <Card className="p-6 shadow-soft sticky top-4">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-5 h-5 text-accent" />
                  <h3 className="font-serif font-semibold">Categories</h3>
                </div>
                <ul className="space-y-3">
                  {categories.map((category) => (
                    <li key={category.name}>
                      <button className="text-sm text-muted-foreground hover:text-accent transition-colors flex justify-between w-full group">
                        <span className="group-hover:translate-x-1 transition-transform">{category.name}</span>
                        <span className="text-xs bg-forest-100 text-forest-700 px-2 py-0.5 rounded-full">
                          {category.count}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Blog posts */}
            <div className="lg:col-span-3 space-y-8 order-1 lg:order-2">
              {/* Featured post */}
              <Card className="overflow-hidden shadow-soft border-2 border-transparent hover:border-accent/30 transition-all duration-300">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative bg-muted aspect-video md:aspect-auto">
                    <img
                      src={blogPosts[0].image || getCemeteryImage(0)}
                      alt={blogPosts[0].title}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
                        FEATURED
                      </span>
                    </div>
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <span className="text-xs text-accent font-medium mb-2">{blogPosts[0].category}</span>
                    <h2 className="font-serif text-2xl font-bold mb-3">
                      <Link href={`/blog/${blogPosts[0].slug}`} className="hover:text-accent transition-colors">
                        {blogPosts[0].title}
                      </Link>
                    </h2>
                    <p className="text-muted-foreground mb-4">{blogPosts[0].excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(blogPosts[0].date).toLocaleDateString('en-US')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {blogPosts[0].readTime}
                      </span>
                    </div>
                    <Link
                      href={`/blog/${blogPosts[0].slug}`}
                      className="mt-6 inline-flex items-center gap-2 text-accent font-medium hover:underline"
                    >
                      Read article
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </Card>

              <InlineAd />

              {/* Regular posts grid */}
              <div className="grid gap-6 md:grid-cols-2">
                {blogPosts.slice(1).map((post) => (
                  <Card
                    key={post.id}
                    className="overflow-hidden shadow-soft border-2 border-transparent hover:border-accent/30 transition-all duration-300 group"
                  >
                    <div className="aspect-video relative overflow-hidden bg-muted">
                      <img
                        src={post.image || getCemeteryImage(post.id)}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6">
                      <span className="text-xs text-accent font-medium">{post.category}</span>
                      <h3 className="font-serif text-xl font-semibold mt-2 mb-3">
                        <Link href={`/blog/${post.slug}`} className="hover:text-accent transition-colors">
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.date).toLocaleDateString('en-US')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                          </span>
                        </div>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-accent hover:underline text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Read more
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <InlineAd />

              {/* Premium Content Banner */}
              <PremiumContentBanner />

              {/* Newsletter signup */}
              <Card className="p-8 shadow-soft bg-gradient-to-r from-forest-50 to-gold-50/30 dark:from-forest-900/20 dark:to-gold-900/10 border-forest-100 dark:border-forest-800 text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-serif text-2xl font-semibold mb-3">Stay informed</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Receive monthly interesting articles about cemeteries,
                  history and culture in your inbox.
                </p>
                <form className="max-w-md mx-auto flex gap-2">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-1 px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-accent bg-background"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <h2 className="font-serif text-2xl font-semibold mb-4">
              Looking for a cemetery?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              {ctaStatsText}
            </p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Search cemeteries
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
