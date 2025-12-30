'use client';

export default function ContactPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-background-primary)] px-4">
      <h1 className="text-4xl font-bold mb-6 text-[var(--color-text-primary)]">Contact Us</h1>
      <p className="text-lg mb-4 text-[var(--color-text-secondary)]">We would love to hear from you</p>
      <form className="w-full max-w-md bg-[var(--color-card-bg)] p-6 rounded-2xl shadow-modal border border-[var(--color-border-primary)]">
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium mb-1 text-[var(--color-text-primary)]"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your Name"
            required
            className="form-input"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-1 text-[var(--color-text-primary)]"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Your Email"
            required
            className="form-input"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="message"
            className="block text-sm font-medium mb-1 text-[var(--color-text-primary)]"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Your Message"
            required
            className="form-input resize-none"
          ></textarea>
        </div>
        <button
          type="submit"
          className="form-button w-full py-3"
        >
          Send Message
        </button>
      </form>
      <p className="mt-6 text-sm text-[var(--color-text-secondary)]">
        We will get back to you as soon as possible.
      </p>
    </div>
  );
}
