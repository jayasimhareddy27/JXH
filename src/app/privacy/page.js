import React from "react";
import TermsPage from "../terms/page";

export default function PrivacyPage() {
  const lastUpdated = "March 29, 2026";

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 text-slate-800 leading-relaxed">
      <h1 className="text-5xl font-bold mb-3">Privacy Policy</h1>
      <p className="text-sm text-slate-500 mb-10">
        Last Updated: {lastUpdated}
      </p>

      <section className="mb-10">
        <p>
          At <strong>Job x Chaser</strong>, accessible from{" "}
          <a href="https://www.jobchaser.org/" className="text-blue-600 underline">
            https://www.jobchaser.org/
          </a>, we are fully committed to protecting your privacy.
          This Privacy Policy explains how we collect, use, store, and protect your information in compliance with GDPR, CCPA, and global privacy standards.
        </p>
      </section>

      {/* Data Collection */}
      <section className="mb-10">
        <h2 className="text-3xl font-semibold mb-4">1. Data We Collect</h2>
        <p className="mb-4">
          We only collect the minimum amount of data necessary to provide our services.
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li><strong>User Input Data:</strong> Name, email, LinkedIn, resume content, job details, and career information you provide.</li>
          <li><strong>Application Data:</strong> Job applications, saved jobs, and related interactions.</li>
          <li><strong>Local Storage Data:</strong> Data stored in your browser using localStorage to enhance performance and persistence.</li>
          <li><strong>Technical Data:</strong> Device, browser type, and interaction data strictly for functionality and debugging.</li>
        </ul>
      </section>

      {/* Usage */}
      <section className="mb-10">
        <h2 className="text-3xl font-semibold mb-4">2. How We Use Your Data</h2>

        <p className="mb-4">
          Your data is used only to provide and improve your experience, making your workflow significantly faster and more efficient.
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>Generate resumes, cover letters, and job-related content</li>
          <li>Automate job tracking and application workflows</li>
          <li>Provide personalized outputs based on your input</li>
          <li>Improve performance and user experience</li>
        </ul>
      </section>

      {/* Sharing */}
      <section className="mb-10">
        <h2 className="text-3xl font-semibold mb-4">3. Data Sharing & Third Parties</h2>

        <p className="mb-4">
          We do <strong>not sell, rent, or share your personal data</strong> with any third parties.
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>No data is sold or monetized</li>
          <li>No advertising or tracking networks are used</li>
          <li>No third-party access to your personal data</li>
        </ul>
      </section>

      {/* AI */}
      <section className="mb-10">
        <h2 className="text-3xl font-semibold mb-4">4. AI Processing (User Controlled)</h2>

        <ul className="list-disc pl-6 space-y-2">
          <li>AI features are <strong>fully optional</strong> and user-triggered</li>
          <li>You may use your own API keys or local AI models</li>
          <li>AI systems used are <strong>stateless</strong> and do not store your data</li>
          <li>No AI provider receives your data unless you explicitly choose to send it</li>
        </ul>
      </section>

      {/* Local Storage */}
      <section className="mb-10">
        <h2 className="text-3xl font-semibold mb-4">5. Local Storage</h2>

        <p className="mb-4">
          We use your browser’s <strong>localStorage</strong> to store your data locally on your device.
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>Data remains on your device</li>
          <li>No external tracking or monitoring</li>
          <li>You can delete stored data anytime via browser settings</li>
          <li>No third-party access to stored data</li>
        </ul>
      </section>

      {/* Rights */}
      <section className="mb-10">
        <h2 className="text-3xl font-semibold mb-4">6. Your Rights</h2>

        <ul className="list-disc pl-6 space-y-2">
          <li>Access your data</li>
          <li>Edit your data</li>
          <li>Delete your data</li>
          <li>Export your data</li>
          <li>Withdraw consent at any time</li>
        </ul>
      </section>

      {/* Security */}
      <section className="mb-10">
        <h2 className="text-3xl font-semibold mb-4">7. Security</h2>

        <p>
          We use industry-standard security practices to protect your data.
          While no system is 100% secure, we continuously work to improve protection and safeguard your information.
        </p>
      </section>

      {/* Children */}
      <section className="mb-10">
        <h2 className="text-3xl font-semibold mb-4">8. Children’s Privacy</h2>

        <p>
          Our services are not intended for users under the age of 13.
          We do not knowingly collect data from children.
        </p>
      </section>

      {/* Changes */}
      <section className="mb-10">
        <h2 className="text-3xl font-semibold mb-4">9. Changes to This Policy</h2>

        <p>
          We may update this Privacy Policy periodically. Updates will be posted on this page with a revised date.
        </p>
      </section>

      {/* Contact */}
      <section className="p-6 border rounded-lg bg-slate-50">
        <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
        <p>Email: jayasimhareddy27@gmail.com</p>
        <p>
          Creator:{" "}
          <a href="https://www.linkedin.com/in/jayasimhareddy27/" className="text-blue-600 underline">
            Jayasimha Reddy
          </a>
        </p>
      </section>
      <TermsPage />
    </div>
  );
}