"use client";

const FacebookIcon = (props: React.ComponentProps<"svg">) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = (props: React.ComponentProps<"svg">) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedinIcon = (props: React.ComponentProps<"svg">) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = (props: React.ComponentProps<"svg">) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);
import { buttonVariants } from "@/components/ui/button";
import { PlayStoreButton } from "@/components/ui/play-store-button";
import { AppStoreButton } from "@/components/ui/app-store-button";

const footerLinks = [
  {
    title: "Company",
    links: [
      { href: "#", label: "The Linomore Blog" },
      { href: "#", label: "Engineering Blog" },
      { href: "#", label: "Marketplace" },
      { href: "#", label: "What’s New" },
      { href: "#", label: "About" },
      { href: "#", label: "Press" },
      { href: "#", label: "Careers" },
      { href: "#", label: "Link in Bio" },
      { href: "#", label: "Social Good" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "#", label: "Linktree for Enterprise" },
      { href: "#", label: "2023 Creator Report" },
      { href: "#", label: "2022 Creator Report" },
      { href: "#", label: "Charities" },
      { href: "#", label: "What’s Trending" },
      { href: "#", label: "Creator Profile Directory" },
      { href: "#", label: "Explore Templates" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "#", label: "Help Topics" },
      { href: "#", label: "Getting Started" },
      { href: "#", label: "Linoree Pro" },
      { href: "#", label: "Features & How-tos" },
      { href: "#", label: "FAQs" },
      { href: "#", label: "Report a Violation" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "#", label: "Terms & Conditions" },
      { href: "#", label: "Privacy Notice" },
      { href: "#", label: "Cookie Notice" },
      { href: "#", label: "Trust Center" },
      { href: "#", label: "Cookie Preferences" },
      { href: "#", label: "Transparency Report" },
      { href: "#", label: "Law Enforcement Access Policy" },
    ],
  },
];

const socialLinks = [
  { icon: FacebookIcon, href: "#" },
  { icon: InstagramIcon, href: "#" },
  { icon: LinkedinIcon, href: "#" },
  { icon: TwitterIcon, href: "#" },
];

export function Footer2() {
  return (
    <footer className="bg-card/60 border-t">
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        {/* Grid container with headings and links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8">
          {footerLinks.map((item, i) => (
            <div key={i}>
              <h3 className="mb-4 text-xs">{item.title}</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                {item.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="hover:text-foreground">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="h-px bg-border" />
        {/* Social Buttons + App Links */}
        <div className="py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2 items-center">
            {socialLinks.map(({ icon: Icon, href }, i) => (
              <a
                href={href}
                className={buttonVariants({
                  variant: "outline",
                  size: "icon",
                })}
                key={i}
              >
                <Icon className="size-5 text-muted-foreground" />
              </a>
            ))}
          </div>

          <div className="flex gap-4">
            <a href="#">
              <AppStoreButton />
            </a>

            <a href="#">
              <PlayStoreButton />
            </a>
          </div>
        </div>
        <div className="h-px bg-border" />
        <div className="text-center text-xs text-muted-foreground py-4">
          <p>
            © {new Date().getFullYear()}{" "}
            <a
              href="https://x.com/sshahaider"
              className="hover:text-foreground hover:underline"
            >
              sshahaider
            </a>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
