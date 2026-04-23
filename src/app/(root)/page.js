import { Companyname } from '@/globalvar/companydetails';
import Link from 'next/link';

export default async function HomePage() {
  const steps = [
    { title: 'Profile Setup', desc: 'Construct your professional foundation with our intuitive profile builder.', href: '/dashboard/profile' },
    { title: 'AI-Driven Optimization', desc: 'Align your unique achievements with specific job requirements using neural insights.', href: '/dashboard/myresumes' },
    { title: 'Job X Chaser', desc: 'Deploy our browser extension for live scoring and automation on any job board.', href: '/chrome-extension' }
  ];

  const comparisons = [
    { feature: "Feedback", manual: "Vague or None", chaser: "Actionable & Instant" },
    { feature: "ATS Keywords", manual: "Guesswork", chaser: "Data-Driven Matching" },
    { feature: "Time Spent", manual: "Hours per App", chaser: "Minutes with AI" },
  ];

  const faq = [
    { q: "How does the ATS Match Score work?", a: "Our AI parses your resume exactly like a corporate Applicant Tracking System, scanning for keyword density, structural compatibility, and semantic relevance to the job description." },
    { q: "Is Job X Chaser free to use?", a: "Yes, you can start auditing your resume for free. We also offer advanced AI features for candidates looking to deeply personalize their bullet points and cover letters." },
    { q: "Which job boards does the extension support?", a: "Job X Chaser works natively on major platforms like LinkedIn, Indeed, Glassdoor, and most Greenhouse or Lever-hosted career pages." }
  ];

  return (
    <main className=" min-h-screen bg-[var(--color-background-primary)] text-[var(--color-text-primary)] selection:bg-[var(--color-cta-bg)] selection:text-[var(--color-cta-text)] transition-colors duration-300">
      
      {/* === STICKY HEADER === */}
      <header className="sticky top-0 z-50 border-b border-[var(--color-border-primary)] bg-[var(--color-background-primary)]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-black tracking-tighter text-[var(--color-text-primary)]">
              {Companyname} 
            </span>
          </div>
          <nav className="flex items-center gap-4 sm:gap-8">
            <Link href="/atsscore" className="hidden sm:block text-sm font-medium hover:text-[var(--color-cta-bg)] transition-colors">ATS Score</Link>
            <Link href="/chrome-extension" className="btn-primary text-xs !py-2 !px-4 rounded-full">
              Get Extension
            </Link>
          </nav>
        </div>
      </header>

      {/* === HERO SECTION === */}
      <section className="max-w-7xl mx-auto pt-12 md:pt-24 pb-16 px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6 md:space-y-8 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-tight text-[var(--color-text-primary)]">
              Land More <br className="hidden sm:block" />
              <span className="text-[var(--color-cta-bg)]">Interviews.</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-[var(--color-text-secondary)] max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {Companyname} empowers your search. Leverage <strong>Job X Chaser</strong> to audit your resume against <strong>Applicant Tracking Systems</strong> in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/atsscore" className="btn-primary !py-4 !px-10 text-center shadow-lg">
                Check My Score
              </Link>
              <Link href="/chrome-extension" className="btn-secondary !py-4 !px-10 text-center">
                Get Job X Chaser
              </Link>
            </div>
          </div>

          {/* Workflow Card */}
          <div className="card p-6 sm:p-10 border border-[var(--color-border-primary)] shadow-modal">
            <h3 className="text-xs font-bold mb-8 opacity-50 uppercase tracking-widest text-center text-[var(--color-text-primary)]">The Workflow</h3>
            <div className="space-y-8 md:space-y-10">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-4 sm:gap-6 group">
                  <span className="text-2xl sm:text-3xl font-black text-[var(--color-cta-bg)] opacity-30 group-hover:opacity-100 transition-opacity">
                    0{i + 1}
                  </span>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold mb-1 text-[var(--color-text-primary)]">
                      <Link href={step.href} className="hover:underline decoration-2 underline-offset-4">{step.title} ↗</Link>
                    </h4>
                    <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* === COMPARISON SECTION === */}
      <section className="py-16 md:py-24 px-4 sm:px-6 bg-[var(--color-background-secondary)]/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center text-[var(--color-text-primary)]">Manual Search vs. {Companyname}</h2>
          <div className="overflow-x-auto rounded-2xl md:rounded-3xl border border-[var(--color-border-primary)] bg-[var(--color-background-secondary)] shadow-sm">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-[var(--color-border-primary)] bg-[var(--color-background-tertiary)]/50">
                  <th className="p-4 md:p-6 font-bold text-xs uppercase tracking-widest opacity-60">Feature</th>
                  <th className="p-4 md:p-6 font-bold text-xs uppercase tracking-widest opacity-60">Manual Effort</th>
                  <th className="p-4 md:p-6 font-bold text-xs uppercase tracking-widest text-[var(--color-cta-bg)]">With {Companyname}</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((item, i) => (
                  <tr key={i} className="border-b border-[var(--color-border-primary)] last:border-none hover:bg-[var(--color-card-hover-bg)] transition-colors">
                    <td className="p-4 md:p-6 font-bold text-sm md:text-base text-[var(--color-text-primary)]">{item.feature}</td>
                    <td className="p-4 md:p-6 text-sm md:text-base text-[var(--color-text-secondary)]">{item.manual}</td>
                    <td className="p-4 md:p-6 text-sm md:text-base font-semibold text-[var(--color-text-primary)]">{item.chaser} ✨</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* === LIVE ANALYSIS FEATURES === */}
      <section className="max-w-7xl mx-auto py-16 md:py-24 px-4 sm:px-6 border-b border-[var(--color-border-primary)]">
        <div className="text-center mb-12 md:text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Real-Time Intelligence</h2>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-sm md:text-base">Our specialized algorithms understand the semantic gap between your resume and your dream job.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {[
            { icon: "⚡", title: "Instant Parsing", desc: "Experience zero-lag analysis. As soon as you paste a job description, we calculate your score." },
            { icon: "🧠", title: "Neural Keywords", desc: "We identify the 'hidden' skills recruiters want that aren't explicitly mentioned." },
            { icon: "📄", title: "Format Audit", desc: "Ensure your resume structure won't break the ATS. We check tables, fonts, and headers." }
          ].map((feature, i) => (
            <div key={i} className="card p-8 border border-[var(--color-border-primary)] space-y-4">
              <div className="text-3xl">{feature.icon}</div>
              <h4 className="font-bold text-lg">{feature.title}</h4>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* === OPTIMIZATION PRO-TIPS === */}
      <section className="max-w-7xl mx-auto py-16 md:py-24 px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">Optimization Pro-Tips</h2>
            <p className="text-[var(--color-text-secondary)] leading-relaxed text-sm md:text-base">
              Success is a science. Use these strategies alongside <strong>Job X Chaser</strong> to maximize callbacks:
            </p>
            <ul className="space-y-4">
              <li className="flex gap-4 p-4 rounded-2xl border border-[var(--color-border-primary)] hover:border-[var(--color-cta-bg)] transition-colors">
                <span className="text-[var(--color-cta-bg)] flex-shrink-0">💡</span>
                <p className="text-sm"><strong className="text-[var(--color-text-primary)]">Quantify Impact:</strong> Use numbers like "Increased revenue by 20%."</p>
              </li>
              <li className="flex gap-4 p-4 rounded-2xl border border-[var(--color-border-primary)] hover:border-[var(--color-cta-bg)] transition-colors">
                <span className="text-[var(--color-cta-bg)] flex-shrink-0">💡</span>
                <p className="text-sm"><strong className="text-[var(--color-text-primary)]">Standard Job Titles:</strong> Use "Software Engineer" rather than "Code Ninja."</p>
              </li>
            </ul>
          </div>
          <div className="p-6 md:p-10 bg-[var(--color-button-secondary-bg)]/30 rounded-3xl border border-[var(--color-border-primary)]">
            <h3 className="text-lg md:text-xl font-bold mb-4 text-[var(--color-text-primary)]">Why 75% of Resumes Fail</h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6">
              Recruiters spend 6 seconds on a resume. If your keyword density is off or your format is incompatible, the <strong>ATS</strong> automatically archives you.
            </p>
            <Link href="/atsscore" className="text-sm font-bold text-[var(--color-cta-bg)] hover:underline underline-offset-4">
              Run an Instant Audit Now →
            </Link>
          </div>
        </div>
      </section>

      {/* === FAQ SECTION === */}
      <section className="max-w-4xl mx-auto py-16 md:py-24 px-4 sm:px-6 border-t border-[var(--color-border-primary)]">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 md:mb-12 text-center underline decoration-[var(--color-cta-bg)] decoration-4 underline-offset-8">Common Questions</h2>
        <div className="space-y-6 md:space-y-8">
          {faq.map((item, i) => (
            <div key={i} className="group">
              <h3 className="font-bold text-base md:text-lg mb-2 text-[var(--color-text-primary)] group-hover:text-[var(--color-cta-bg)] transition-colors">Q: {item.q}</h3>
              <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* === FINAL CALL TO ACTION === */}
      <section className="py-16 md:py-24 text-center px-4 sm:px-6 bg-[var(--color-background-tertiary)]/20 border-t border-[var(--color-border-primary)]">
        <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">Stop Guessing. Start Winning.</h2>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)]">Join thousands of candidates using {Companyname} to demystify the hiring process.</p>
          <Link
            href="/login"
            className="inline-block text-lg md:text-xl font-bold underline underline-offset-8 decoration-[var(--color-cta-bg)] decoration-4 hover:opacity-70 transition-opacity"
          >
            Create your free account today
          </Link>
        </div>
      </section>

    </main>
  );
}