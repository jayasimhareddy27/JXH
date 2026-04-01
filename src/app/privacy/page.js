import React from 'react';

const PrivacyPolicy = () => {
  const lastUpdated = "March 29, 2026";

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 text-slate-800">
      <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-slate-500 mb-8">
        Last Updated: {lastUpdated}
      </p>

      <section className="mb-8">
        <p className="leading-relaxed">
          At <strong>Job x Chaser</strong>, accessible from{" "}
          <a href="https://www.jobchaser.org/" className="text-blue-600 hover:underline">
            https://www.jobchaser.org/
          </a>, your privacy is a core priority. This Privacy Policy explains how we collect,
          use, and protect your information in compliance with applicable laws including GDPR and CCPA.
        </p>
      </section>

      <hr className="my-8 border-slate-200" />

      <div className="space-y-10">
        {/* Section 1 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p className="mb-4">
            We collect only the minimum data necessary to provide our services. All data is securely stored and protected.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>User-Provided Data:</strong> Name, email, LinkedIn profile, resume content, and career-related information you choose to input.</li>
            <li><strong>Application Data:</strong> Jobs you track, apply to, or manage.</li>
            <li><strong>Technical Data:</strong> Browser type, device info, and usage logs for performance and debugging.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">
            Your data is used solely to improve your experience and make your job search workflow up to <strong>10x faster and easier</strong>.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Content Generation:</strong> Create resumes and cover letters.</li>
            <li><strong>Automation:</strong> Streamline job tracking and application processes.</li>
            <li><strong>Personalization:</strong> Provide tailored outputs based only on your input.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Data Sharing & AI Processing</h2>
          <p className="mb-4">
            We do <strong>not sell, rent, or share your personal data with third parties</strong>.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>No Data Selling:</strong> Your data is never sold or used for advertising.</li>
            <li><strong>User-Controlled AI:</strong> AI processing occurs only when you choose to use it.</li>
            <li><strong>Bring Your Own API:</strong> You may use your own API keys or local AI models.</li>
            <li><strong>Stateless Processing:</strong> AI systems process data in real-time and do not store or retain your data.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Legal Basis for Processing (GDPR)</h2>
          <p>
            We process your data based on:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li><strong>Consent:</strong> When you provide data and use features.</li>
            <li><strong>Contractual Necessity:</strong> To deliver requested services.</li>
            <li><strong>Legitimate Interest:</strong> To improve performance and security.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Your Rights (GDPR & CCPA)</h2>
          <p className="mb-4">
            You have full control over your data. Depending on your location, your rights include:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Access:</strong> Request a copy of your data.</li>
            <li><strong>Correction:</strong> Update inaccurate information.</li>
            <li><strong>Deletion:</strong> Request permanent deletion (“Right to be Forgotten”).</li>
            <li><strong>Portability:</strong> Receive your data in a usable format.</li>
            <li><strong>Opt-Out:</strong> California users can opt out of data sale (we do not sell data).</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
          <p>
            We retain your data only as long as necessary to provide services. You may delete your data at any time,
            and we will permanently remove it upon request or account deletion.
          </p>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Security</h2>
          <p>
            We implement industry-standard safeguards to protect your data. While no system is completely secure,
            we continuously improve our security practices to prevent unauthorized access.
          </p>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Cookies & Tracking</h2>
          <p>
            We use minimal cookies only for essential functionality and performance improvements.
            No tracking is used for advertising or selling user data.
          </p>
        </section>

        {/* Section 9 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Children’s Information</h2>
          <p>
            Our services are not intended for individuals under 13. We do not knowingly collect data from children.
          </p>
        </section>

        {/* Section 10 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
          <p>
            We may update this policy periodically. Changes will be reflected on this page with an updated date.
          </p>
        </section>

        {/* Contact */}
        <section className="p-6 bg-slate-50 rounded-lg border border-slate-200">
          <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
          <p className="mb-2">For questions or data requests:</p>
          <ul className="space-y-1">
            <li>Email: <span className="text-blue-600">support@jobchaser.com</span></li>
            <li>
              Creator:{" "}
              <a href="https://www.linkedin.com/in/jayasimhareddy27/" className="text-blue-600 hover:underline">
                Jayasimha Reddy
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;