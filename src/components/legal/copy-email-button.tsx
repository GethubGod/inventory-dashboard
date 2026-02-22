"use client";

import { useState, useCallback } from "react";
import { Check, Copy } from "lucide-react";

const EMAIL = "babytunalovessushi@gmail.com";

export function CopyEmailButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = EMAIL;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:ring-offset-2"
      aria-label={copied ? "Email address copied" : "Copy email address"}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-emerald-600" />
          <span>Copied</span>
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          <span>Copy Email</span>
        </>
      )}
    </button>
  );
}
