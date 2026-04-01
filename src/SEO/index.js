

export const siteMetadata = {
  metadataBase: new URL('https://www.jobchaser.org/'),
  title: {
    default: 'Job x Chaser | AI-Powered Resume Builder & Job Finder',
    template: '%s | Job x Chaser',
  },
  verification: {
    google: 'google8c4702097ffc8dc4.html',
  },
  description: 'Create professional resumes in minutes with our AI-powered builder. Find your next job, track applications, and get ahead in your career with Job x Chaser.',
  keywords: ['resume builder', 'job finder', 'career tools', 'AI resume', 'job search', 'job tracker', 'cv builder', 'professional resume', 'free resume builder'],
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
      '@type': 'Organization',
      'name': 'Job x Chaser',
      'url': 'https://www.jobchaser.org/',
      'logo': 'https://www.jobchaser.org/logo.png',
      'sameAs': [
        'https://www.linkedin.com/in/jayasimhareddy27/'
      ]
    },
    {
      '@type': 'WebSite',
      'name': 'Job x Chaser',
      'url': 'https://www.jobchaser.org/',
      'potentialAction': {
        '@type': 'SearchAction',
        'target': 'https://www.jobchaser.org/search?q={search_term_string}',
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