

export const siteMetadata = {
  metadataBase: new URL('https://jxh-ly7o57diw-jayasimhareddy27s-projects.vercel.app/'),
  title: {
    default: 'JobxChaser | AI-Powered Resume Builder & Job Finder',
    template: '%s | JobxChaser',
  },
  verification: {
    google: 'google8c4702097ffc8dc4.html',
  },
  description: 'Create professional resumes in minutes with our AI-powered builder. Find your next job, track applications, and get ahead in your career with JobxChaser.',
  keywords: ['resume builder', 'job finder', 'career tools', 'AI resume', 'job search', 'job tracker', 'cv builder', 'professional resume', 'free resume builder'],
  authors: [{ name: 'Jayasimha Reddy', url: 'https://www.linkedin.com/in/jayasimhareddy27/' }],
  creator: 'Jayasimha Reddy',
  publisher: 'JobxChaser',
  applicationName: 'JobxChaser',
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
    title: 'JobxChaser: AI-Powered Resume Builder & Job Finder',
    description: 'Build a standout resume and land your dream job with our intelligent career platform.',
    url: 'https://jxh-ly7o57diw-jayasimhareddy27s-projects.vercel.app/',
    siteName: 'JobxChaser',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'JobxChaser AI Resume Builder and Job Finder',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JobxChaser: AI-Powered Resume Builder & Job Finder',
    description: 'Build a standout resume and land your dream job with our intelligent career platform.',
    creator: '@jayareddy',
    images: ['/twitter-image.png'],
  },
  sitemap: 'https://jxh-ly7o57diw-jayasimhareddy27s-projects.vercel.app/sitemap.xml',
};



export const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      'name': 'JobxChaser',
      'url': 'https://jxh-ly7o57diw-jayasimhareddy27s-projects.vercel.app/',
      'logo': 'https://jxh-ly7o57diw-jayasimhareddy27s-projects.vercel.app/logo.png',
      'sameAs': [
        'https://www.linkedin.com/in/jayasimhareddy27/'
      ]
    },
    {
      '@type': 'WebSite',
      'name': 'JobxChaser',
      'url': 'https://jxh-ly7o57diw-jayasimhareddy27s-projects.vercel.app/',
      'potentialAction': {
        '@type': 'SearchAction',
        'target': 'https://jxh-ly7o57diw-jayasimhareddy27s-projects.vercel.app/search?q={search_term_string}',
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