import { Companyname } from '@/globalvar/companydetails';
import Link from 'next/link';

export default async function HomePage() {
  const steps = [
    { title: 'Set Up Your Profile', desc: 'Quickly add your professional details and resume.', href: '/userextraction' },
    { title: 'Edit Your Resume', desc: 'Use our AI to tailor your resume for the job.', href: '/resume-editor' },
    { title: 'Download & Automate', desc: 'Get our extension for live scoring as you browse.', href: '/chrome-extension' }
  ];

  const features = [
    { title: 'Resume Templates', desc: 'Choose from beautifully designed resume templates for any role.', href: '/template02' },
    { title: 'ATS Match Score', desc: 'Check how well your resume matches the job description.', href: '/ats-score' },
    { title: 'Job Tracker', desc: 'Keep track of your job applications, deadlines, and progress.', href: '/job-tracker' }
  ];

  return (
    <main className="font-sans bg-[var(--color-background-primary)] text-[var(--color-text-primary)]">
      <h1 className="text-4xl lg:text-5xl font-bold text-[var(--color-text-secondary)] tracking-tight text-center">
        {Companyname} - Your Job Search Companion
      </h1>

      {/* === HERO SECTION === */}
      <section id="score" className="py-20 md:py-28 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Text */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-[var(--color-text-primary)]">
              Optimize Your Resume, Instantly.
            </h1>
            <p className="text-lg mb-10 max-w-xl mx-auto lg:mx-0 text-[var(--color-text-secondary)]">
              Stop guessing. Our AI platform gives you a precise match score and actionable feedback against any job description.
            </p>
            <Link
              href="/dashboard/myresumes"
              className="inline-block rounded-lg py-4 px-8 font-bold 
                         bg-[var(--color-cta-bg)] text-[var(--color-cta-text)] 
                         shadow-md transition-all duration-300
                         hover:bg-[var(--color-cta-hover-bg)] hover:shadow-lg hover:-translate-y-0.5">
              Check Your Score Now
            </Link>
          </div>

          {/* Right Card */}
          <div className="bg-[var(--color-background-secondary)] p-8 rounded-2xl shadow-lg border border-[var(--color-border-primary)]">
            <h3 className="text-2xl font-bold mb-6 text-center text-[var(--color-text-primary)]">
              Get Your ATS Score in 3 Steps
            </h3>
            <ul className="space-y-5">
              {steps.map((step, i) => (
                <li key={i}>
                  <Link href={step.href} className="block">
                    <div className="flex items-start gap-4 p-3 rounded-lg 
                                    hover:bg-[var(--color-background-tertiary)] 
                                    hover:text-[var(--color-text-primary)] 
                                    transition cursor-pointer">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full 
                                      bg-[var(--color-button-secondary-bg)] 
                                      flex items-center justify-center font-bold 
                                      text-[var(--color-text-primary)]">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold">{step.title} ↗️</h4>
                        <p className="text-sm text-[var(--color-text-secondary)]">{step.desc}</p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* === FEATURES SECTION === */}
      <section className="max-w-7xl mx-auto py-20 px-6 border-t border-b border-[var(--color-border-primary)]">
        <h2 className="text-center text-3xl font-bold text-[var(--color-text-primary)] mb-12">
          Explore More Features
        </h2>
        <div className="grid gap-8 md:grid-cols-3 text-center">
          {features.map((feature, i) => (
            <Link
              key={i}
              href={feature.href}
              className="block bg-[var(--color-card-bg)] shadow-xl rounded-xl p-8 
                         transition-all duration-300
                         hover:bg-[var(--color-card-hover-bg)] 
                         hover:text-[var(--color-text-primary)] hover:shadow-lg hover:-translate-y-0.5">
              <h3 className="text-xl font-bold mb-2">{feature.title} ↗️</h3>
              <p className="text-[var(--color-text-secondary)]">{feature.desc}</p>
            </Link>
          ))}
        </div>
      </section>

<section id="login" className="max-w-7xl mx-auto p-6">
  <div className="rounded-3xl p-12 lg:p-20 text-center
                  bg-[var(--color-cta-bg)]/30 text-[var(--color-cta-text)] 
                  shadow-lg ring-4 ring-[var(--color-cta-bg)]/20
                  transition-transform duration-300 hover:scale-[1.03]">
    <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
      Ready to Land Your Dream Job?
    </h2>
    <p className="text-xl mb-10 max-w-xl mx-auto opacity-90">
      Start optimizing for free. No credit card required.
    </p>
    <Link
      href="/login"
      className="inline-block rounded-full py-5 px-14 font-bold 
                 bg-[var(--color-button-primary-bg)] text-[var(--color-text-on-primary)] 
                 shadow-lg transition-colors duration-300
                 hover:bg-[var(--color-button-primary-hover-bg)] hover:shadow-xl">
      Sign Up For Free
    </Link>
  </div>
</section>

    </main>
  );
}
