import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Get in touch",
  description: "Investor, partner, press, careers, or general inquiries.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Get in touch"
        title="Let's turn the routes back on."
        intro="Tell us how you'd like to be involved and we'll route your message to the right person."
      />

      <section className="bg-navy py-16">
        <Container className="max-w-2xl">
          <Suspense fallback={<div className="text-cream/50">Loading…</div>}>
            <ContactForm />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
