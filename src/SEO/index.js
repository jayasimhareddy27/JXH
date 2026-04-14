

export const siteMetadata = {
  metadataBase: new URL('https://www.jobchaser.org/'),
  title: {
    default: 'Job x Chaser | AI-Powered Resume Builder & Job Finder',
    template: '%s | Job x Chaser',
  },

description: 'Master your job search with Job x Chaser. Build AI-optimized resumes, calculate your real-time ATS match score, and automate applications with our Chrome extension. Bridge the gap between your skills and the perfect role today.',
  keywords: ['AI Resume Builder', 'ATS Resume Checker', 'Job x Chaser extension','autofill job applications', 'Resume Match Score', 'Job Tracker', 'how to beat ATS', 'resume keyword optimization', 'AI CV builder', 'automated job search', 'career automation tools'],
  authors: [{ name: 'Jayasimha Reddy', url: 'https://www.linkedin.com/in/jayasimhareddy27/' }],
  creator: 'Jayasimha Reddy',
  publisher: 'Job x Chaser',
  applicationName: 'Job x Chaser',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  
  openGraph: {
    title: 'Job x Chaser: AI-Powered Resume Builder & Job Finder',
    description: 'Build a standout resume and land your dream job with our intelligent career platform.',
    url: 'https://www.jobchaser.org/',
    siteName: 'Job x Chaser',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Job x Chaser AI Resume Builder and Job Finder',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Job x Chaser: AI-Powered Resume Builder & Job Finder',
    description: 'Build a standout resume and land your dream job with our intelligent career platform.',
    creator: '@jayareddy',
    images: ['/twitter-image.png'],
  },
  sitemap: 'https://www.jobchaser.org/sitemap.xml',
};



export const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication', // Better for SEO than just Organization
      'name': 'Job x Chaser',
      'operatingSystem': 'Web, Chrome',
      'applicationCategory': 'BusinessApplication, EducationalApplication',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      },
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.9',
        'reviewCount': '1250'
      }
    },
    {
      '@type': 'Organization',
      'name': 'Job x Chaser',
      'url': 'https://www.jobchaser.org/',
      'logo': 'https://www.jobchaser.org/logo.png',
      'sameAs': ['https://www.linkedin.com/in/jayasimhareddy27/']
    }
  ]
};
export const siteviewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F0F4FF' },
    { media: '(prefers-color-scheme: dark)', color: '#0A1F44' },
  ],
}