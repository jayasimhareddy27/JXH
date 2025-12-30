

export const siteMetadata = {
  metadataBase: new URL('https://jobxhunter.com'),
  title: {
    default: 'JobxHunter | AI-Powered Resume Builder & Job Finder',
    template: '%s | JobxHunter',
  },
  description: 'Create professional resumes in minutes with our AI-powered builder. Find your next job, track applications, and get ahead in your career with JobxHunter.',
  keywords: ['resume builder', 'job finder', 'career tools', 'AI resume', 'job search', 'job tracker', 'cv builder', 'professional resume', 'free resume builder'],
  authors: [{ name: 'Jayasimha Reddy', url: 'https://www.linkedin.com/in/jayasimhareddy27/' }],
  creator: 'Jayasimha Reddy',
  publisher: 'JobxHunter',
  applicationName: 'JobxHunter',
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
  verification: {
    google: 'your-google-verification-code',
  },
  openGraph: {
    title: 'JobxHunter: AI-Powered Resume Builder & Job Finder',
    description: 'Build a standout resume and land your dream job with our intelligent career platform.',
    url: 'https://jobxhunter.com',
    siteName: 'JobxHunter',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'JobxHunter AI Resume Builder and Job Finder',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JobxHunter: AI-Powered Resume Builder & Job Finder',
    description: 'Build a standout resume and land your dream job with our intelligent career platform.',
    creator: '@jayareddy',
    images: ['/twitter-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  sitemap: 'https://jobxhunter.com/sitemap.xml',
};



export const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      'name': 'JobxHunter',
      'url': 'https://jobxhunter.com',
      'logo': 'https://jobxhunter.com/logo.png',
      'sameAs': [
        'https://www.linkedin.com/in/jayasimhareddy27/'
      ]
    },
    {
      '@type': 'WebSite',
      'name': 'JobxHunter',
      'url': 'https://jobxhunter.com',
      'potentialAction': {
        '@type': 'SearchAction',
        'target': 'https://jobxhunter.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    }
  ]
};

export const siteviewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F0F4FF' },
    { media: '(prefers-color-scheme: dark)', color: '#0A1F44' },
  ],
}