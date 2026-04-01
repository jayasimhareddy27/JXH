import React from "react";

export default function TermsPage() {
  const lastUpdated = "March 29, 2026";

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 text-slate-800 leading-relaxed">
      <h1 className="text-5xl font-bold mb-3">Terms & Conditions</h1>
      <p className="text-sm text-slate-500 mb-10">
        Last Updated: {lastUpdated}
      </p>

      {/* Agreement */}
      <section className="mb-10">
        <h2 className="text-3xl font-semibold mb-4">1. Agreement to Terms</h2>
        <p>
          By accessing or using Job x Chaser, you agree to be bound by these Terms.
          If you do not agree, you must discontinue use of the platform.
        </p>
      </section>

      {/* Use */}
      <section className="mb-10">
        <h2 className="text-3xl font-semibold mb-4">2. Use of Service</h2>
        <p className="mb-4">
          You agree to use this platform only for lawful purposes related to job searching and career development.
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>No illegal or abusive use</li>
          <li>No reverse engineering or exploitation</li>
          <li>No attempts to disrupt system functionality</li>
        </ul>
      </section>

      {/* Account */}
      <section className="mb-10">
        <h2 className="text-3xl font-semibold mb-4">3. Account Responsibility</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account and all activities under your account.
        </p>
      </section>

      {/* AI */}
      <section className="mb-10">
        <h2 className="text-3xl font-semibold mb-4">4. AI Disclaimer</h2>
        <p className="mb-4">
          AI-generated outputs are provided as assistance only.
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>No guarantee of accuracy or completeness</li>
          <li>No guarantee of job placement</li>
          <li>User is responsible for final decisions</li>
        </ul>
      </section>

      {/* Liability */}
      <section className="mb-10">
        <h2 className="text-3xl font-semibold mb-4">5. Limitation of Liability</h2>
        <p>
          Job x Chaser is not liable for any direct or indirect damages arising from the use of the platform.
        </p>
      </section>

      {/* IP */}
      <section className="mb-10">
        <h2 className="text-3xl font-semibold mb-4">6. Intellectual Property</h2>
        <p>
          All platform content, branding, and features are owned by Job x Chaser unless otherwise stated.
        </p>
      </section>

      {/* Changes */}
      <section className="mb-10">
        <h2 className="text-3xl font-semibold mb-4">7. Changes to Terms</h2>
        <p>
          We may update these Terms at any time. Continued use of the platform indicates acceptance of the updated Terms.
        </p>
      </section>

      {/* Termination */}
      <section className="mb-10">
        <h2 className="text-3xl font-semibold mb-4">8. Termination</h2>
        <p>
          We reserve the right to terminate or suspend access if misuse or violations are detected.
        </p>
      </section>

      {/* Contact */}
      <section className="p-6 border rounded-lg bg-slate-50">
        <h2 className="text-2xl font-semibold mb-3">Contact</h2>
        <p>Email: jayasimhareddy27@gmail.com</p>
        <p>
          Creator:{" "}
          <a href="https://www.linkedin.com/in/jayasimhareddy27/" className="text-blue-600 underline">
            Jayasimha Reddy
          </a>
        </p>
      </section>
    </div>
  );
}