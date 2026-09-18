"use client";

import { useState } from "react";
import { Link2, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
    <path d="M13.5 21v-7.5h2.5l.5-3H13.5V8.25c0-.87.24-1.46 1.5-1.46h1.6V4.14C16.3 4.1 15.32 4 14.17 4c-2.4 0-4.05 1.46-4.05 4.15V10.5H7.6v3h2.52V21z" />
  </svg>
);

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — no-op
    }
  }

  // Rendered unconditionally (no `typeof navigator` check) to avoid a
  // server/client hydration mismatch — feature-detect only inside the handler.
  async function handleShareClick() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled the native share sheet — respect that, don't also copy
      }
      return;
    }
    await handleCopy();
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Compartir artículo">
      <Button asChild variant="outline" size="icon" aria-label="Compartir en WhatsApp">
        <a href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="size-4" />
        </a>
      </Button>
      <Button asChild variant="outline" size="icon" aria-label="Compartir en Facebook">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FacebookIcon />
        </a>
      </Button>
      <Button asChild variant="outline" size="icon" aria-label="Compartir en X">
        <a href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`} target="_blank" rel="noopener noreferrer">
          <XIcon />
        </a>
      </Button>
      <Button variant="outline" size="icon" aria-label="Compartir" onClick={handleShareClick}>
        <Share2 className="size-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={handleCopy}>
        <Link2 className="size-4" />
        {copied ? "¡Copiado!" : "Copiar enlace"}
      </Button>
    </div>
  );
}
