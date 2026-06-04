"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { clsx } from "clsx";
import { ButtonLink } from "@/components/ui/Button";
import { DataFlag } from "@/components/ui/DataFlag";
import { useTrackEvent } from "@/components/analytics/AnalyticsProvider";
import { inquiryTypes } from "@/data/site";

type InquiryId = (typeof inquiryTypes)[number]["id"];

const followUp: Record<InquiryId, string> = {
  investor: "We'll route this to the founder and follow up with a data-room link.",
  partner: "We'll connect you with the program team on specs and route economics.",
  press: "We'll send the media kit and arrange any interviews.",
  careers: "We'll be in touch as roles open. Tell us how you want to contribute.",
  general: "We'll get your message to the right person.",
};

export function ContactForm() {
  const params = useSearchParams();
  const initial = (params.get("type") as InquiryId) || "investor";
  const valid = inquiryTypes.some((t) => t.id === initial);

  const [type, setType] = useState<InquiryId>(valid ? initial : "investor");
  const [sent, setSent] = useState(false);
  const track = useTrackEvent();

  if (sent) {
    return (
      <div className="rounded-2xl border border-amber/30 bg-amber/5 p-8 text-center">
        <p className="font-serif text-2xl text-cream">Thank you.</p>
        <p className="mx-auto mt-3 max-w-md text-pretty text-cream/70">
          {followUp[type]}
        </p>
        <p className="mt-6 text-xs text-cream/40">
          (Demo only: no message was sent. Wire this form to an inbox before
          launch.)
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        track("contact_form_submit", { inquiry_type: type });
        setSent(true);
      }}
      className="space-y-8"
    >
      <fieldset>
        <legend className="text-xs font-medium uppercase tracking-eyebrow text-cream/50">
          I&apos;m reaching out as a…
        </legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {inquiryTypes.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setType(t.id)}
              className={clsx(
                "rounded-full border px-4 py-2 text-sm transition-colors",
                type === t.id
                  ? "border-amber bg-amber/15 text-amber"
                  : "border-cream/15 text-cream/70 hover:border-cream/40",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-cream/50">
          {inquiryTypes.find((t) => t.id === type)?.blurb}
        </p>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" required />
        <Field label="Email" name="email" type="email" required />
        <Field label="Organization" name="org" className="sm:col-span-2" />
      </div>

      <label className="block">
        <span className="text-xs font-medium uppercase tracking-eyebrow text-cream/50">
          Message
        </span>
        <textarea
          name="message"
          rows={5}
          required
          className="mt-2 w-full rounded-xl border border-cream/15 bg-navy/40 px-4 py-3 text-cream placeholder:text-cream/30 focus:border-amber focus:outline-none"
          placeholder="Tell us a little about why you're getting in touch."
        />
      </label>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-amber px-6 py-3 text-sm font-medium text-navy transition-colors hover:bg-saffron"
        >
          Send message
        </button>
        <span className="flex items-center gap-2 text-xs text-cream/50">
          <DataFlag>No backend</DataFlag>
          Routing inboxes not yet wired.
        </span>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={clsx("block", className)}>
      <span className="text-xs font-medium uppercase tracking-eyebrow text-cream/50">
        {label}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        className="mt-2 w-full rounded-xl border border-cream/15 bg-navy/40 px-4 py-3 text-cream placeholder:text-cream/30 focus:border-amber focus:outline-none"
      />
    </label>
  );
}
