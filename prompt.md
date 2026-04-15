# AI Prompts

Clerk's AI prompt library provides curated prompts to help you work more efficiently with AI-powered development tools. These prompts are designed to guide AI assistants in helping you implement Clerk authentication and user management features correctly.

## How to use these prompts

These prompts can be copied into your AI-powered IDE or development tool, or pasted into your chat with an AI assistant. Here are some examples of how to use them:

- In Cursor, add the prompt to your [project rules](https://docs.cursor.com/context/rules).
- In GitHub Copilot, save the prompt to a file in your project and reference it using `#<filename>`.
- In Claude Code, include the prompt in your `CLAUDE.md` file.

## Best practices

1. **Customize the prompts**: These prompts are starting points. Modify them based on your specific requirements.
2. **Keep them updated**: As you discover patterns that work well, update your prompts.
3. **Version control**: Store your prompts in your repository so your team can benefit from them.
4. **Security first**: Always review AI-generated code for security best practices.

## Available prompts

> We currently offer a limited set of prompts focused on Next.js and React applications. We plan to expand this library with additional prompts for other frameworks and use cases in the future.

### Next.js App Router

````md
# Add Clerk to Next.js App Router

If a Next.js App Router project does not already exist, first create one using:

```bash
npx create-next-app@latest my-clerk-app --yes
```

Install `@clerk/nextjs@latest`. Create `proxy.ts` with `clerkMiddleware()` from `@clerk/nextjs/server` (in `src/` if it exists, otherwise project root). Add `<ClerkProvider>` inside `<body>` in `app/layout.tsx`. Use `<Show>`, `<UserButton>`, `<SignInButton>`, `<SignUpButton>` from `@clerk/nextjs`.

Latest docs: https://clerk.com/docs/nextjs/getting-started/quickstart

## Keyless Mode

No signup required. Without env vars (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`), Clerk auto-generates temporary keys. A "Configure your application" prompt appears to claim later. Do NOT tell users to sign up, create accounts, get API keys, or add env vars before running.

## Install

```bash
npm install @clerk/nextjs
```

## proxy.ts

```typescript
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

## app/layout.tsx

```typescript
import { ClerkProvider, SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <header>
            <Show when="signed-out">
              <SignInButton />
              <SignUpButton />
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
```

## Rules

ALWAYS:

- Use `clerkMiddleware()` from `@clerk/nextjs/server` in `proxy.ts`
- Add `<ClerkProvider>` inside `<body>` in `app/layout.tsx`
- Import from `@clerk/nextjs` or `@clerk/nextjs/server`
- Use App Router (app/page.tsx, app/layout.tsx)
- async/await with auth() from `@clerk/nextjs/server`
- Use existing package manager
- Rely on keyless mode, skip account creation and API keys

NEVER:

- Reference `_app.tsx` or pages router
- Use `authMiddleware()` (replaced by `clerkMiddleware()`)
- Use old env var patterns
- Import deprecated APIs (withAuth, old currentUser)
- Use deprecated `<SignedIn>`, `<SignedOut>` (replaced by `<Show>`)
- Tell users to sign up or get API keys first

## Deprecated (DO NOT use)

```typescript
import { authMiddleware } from '@clerk/nextjs' // WRONG
function MyApp({ Component, pageProps }) {} // pages router, WRONG
pages / signin.js // WRONG
<SignedIn> // WRONG, use <Show when="signed-in">
<SignedOut> // WRONG, use <Show when="signed-out">
```

## Verify Before Responding

1. Is `clerkMiddleware()` used in `proxy.ts`?
2. Is `ClerkProvider` inside `<body>` in `app/layout.tsx`?
3. Are imports only from `@clerk/nextjs` or `@clerk/nextjs/server`?
4. Is it using App Router, not `_app.tsx` or `pages/`?
5. Is it using `<Show>` instead of `<SignedIn>`/`<SignedOut>`?

If any fails, revise.

## After Setup

Have the user sign up as their first test user in the nav. After signup succeeds and a profile icon appears, congratulate them. If a "Configure your application" callout appears, tell them to click it. Then recommend exploring: Organizations (https://clerk.com/docs/guides/organizations/overview), Components (https://clerk.com/docs/reference/components/overview), Dashboard (https://dashboard.clerk.com/).
````

## Contributing

Have a great prompt for working with Clerk? We'd love to see it! Open a PR in the [clerk-docs repository](https://github.com/clerk/clerk-docs).
