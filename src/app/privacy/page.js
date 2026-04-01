import React from 'react';

const PrivacyPolicy = () => {
  const lastUpdated = "March 29, 2026";

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 text-slate-800 dark:text-slate-200">
      <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
        Last Updated: {lastUpdated}
      </p>

      <section className="mb-8">
        <p className="leading-relaxed">
          At <strong>Job x Chaser</strong>, accessible from <a href="https://www.jobchaser.org/" className="text-blue-600 hover:underline">https://www.jobchaser.org/</a>, 
          the privacy of our visitors is one of our main priorities. This Privacy Policy document contains types of 
          information that is collected and recorded by Job x Chaser and how we use it.
        </p>
      </section>

      <hr className="my-8 border-slate-200 dark:border-slate-800" />

      <div className="space-y-10">
        {/* Section 1 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">1. Information We Collect</h2>
          <p className="mb-4">To provide our AI-powered career tools, we collect the following types of data:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Personal Information:</strong> Name, email address, and LinkedIn profile URL when you register.</li>
            <li><strong>Resume & Career Data:</strong> Work history, education, skills, and contact details you input into our AI builder.</li>
            <li><strong>Job Application Data:</strong> Records of jobs you track or apply for using our platform.</li>
            <li><strong>Technical Data:</strong> IP address, browser type, and interaction logs (via cookies and Redux persistence).</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">2. How We Use Your Information</h2>
          <p className="mb-4">We use your information to power the core features of Job x Chaser:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>AI Content Generation:</strong> Processing data to create optimized resumes and cover letters.</li>
            <li><strong>Data Persistence:</strong> Saving your progress across devices via our persistence layers (Auth, Resumes, Jobs).</li>
            <li><strong>Personalization:</strong> Providing job recommendations tailored to your career profile.</li>
            <li><strong>Communication:</strong> Sending account updates, security alerts, and support responses.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">3. Data Sharing & Third Parties</h2>
          <p className="mb-4">We do not sell your personal data. We only share data with third parties to perform specific tasks:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>AI Service Providers:</strong> Secure APIs (like Google Gemini) process your text to generate career content. This data is not used to train public models.</li>
            <li><strong>Analytics:</strong> Standard tools like Google Analytics to help us understand site usage.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">4. Your Rights & Data Control</h2>
          <p className="mb-4">
            You have full control over your career data. You may access, edit, or permanently delete your resumes and account information at any time through your dashboard.
            If you are located in the EU (GDPR) or California (CCPA), you have additional rights regarding data portability and the "right to be forgotten."
          </p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">5. Security</h2>
          <p>
            We implement industry-standard security measures to protect your professional data. However, please remember that no method of transmission over the internet is 100% secure.
          </p>
        </section>

        {/* Contact Section */}
        <section className="p-6 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">6. Contact Us</h2>
          <p className="mb-2">If you have questions about this policy, please reach out:</p>
          <ul className="space-y-1">
            <li>Email: <span className="text-blue-600">support@Job x Chaser.com</span></li>
            <li>Creator: <a href="https://www.linkedin.com/in/jayasimhareddy27/" className="text-blue-600 hover:underline">Jayasimha Reddy</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;