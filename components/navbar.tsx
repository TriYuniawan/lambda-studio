"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Style", href: "/style" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Privacy", href: "/privacy" },
  { label: "FAQ", href: "/faq" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="navbar-wrapper" id="main-navbar">
      <div className="navbar-inner">
        {/* Left — Logo */}
        <Link href="/" className="navbar-logo" aria-label="Home">
          <Image
            src="/logo4.png"
            alt="Lambda Studio logo"
            width={60}
            height={60}
            priority
            style={{ width: 60, height: "auto" }}
          />

          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span
                className="navbar-brand"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: "20px",
                }}
              >
                Lambda Studio
              </span>
            </div>
            <span
              className="tracking-widest uppercase text-muted-foreground"
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontWeight: 300,
                fontSize: "10px",
                letterSpacing: "0.22em",
                paddingLeft: "2px",
              }}
            >
              AI Image Generator
            </span>
          </div>
        </Link>

        {/* Center — Desktop links */}
        <ul className="navbar-links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="navbar-link">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right — Auth */}
        <div className="navbar-auth">
          <Show when="signed-out">
            <div className="navbar-auth-buttons">
              <SignInButton>
                <button className="navbar-btn navbar-btn-primary">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="navbar-btn navbar-btn-outline">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </Show>
          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "navbar-avatar",
                },
              }}
            />
          </Show>
        </div>

        {/* Mobile hamburger */}
        <button
          className="navbar-hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`navbar-mobile ${mobileOpen ? "open" : ""}`}>
        <ul className="navbar-mobile-links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="navbar-mobile-link"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="navbar-mobile-auth">
          <Show when="signed-out">
            <SignInButton>
              <button className="navbar-btn navbar-btn-primary w-full">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="navbar-btn navbar-btn-outline w-full">
                Sign Up
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "navbar-avatar",
                },
              }}
            />
          </Show>
        </div>
      </div>
    </nav>
  );
}
