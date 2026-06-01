import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";

// ============================================================
// Clerk Webhook Handler
// ============================================================
// Endpoint ini menerima webhook dari Clerk setiap kali ada
// event yang terjadi (user baru mendaftar, user dihapus, dll).
//
// Clerk menandatangani setiap request menggunakan library Svix.
// Kita WAJIB memverifikasi signature sebelum memproses data
// agar tidak ada pihak ketiga yang bisa memalsukan event.
//
// Setup di Clerk Dashboard:
// 1. Buka https://dashboard.clerk.com → Webhooks
// 2. Tambahkan endpoint: https://your-domain.com/api/webhooks/clerk
// 3. Subscribe ke events: user.created, user.deleted
// 4. Salin "Signing Secret" → taruh di .env sebagai CLERK_WEBHOOK_SECRET
// ============================================================

const INITIAL_CREDITS = 15; // Saldo awal gratis untuk setiap user baru

export async function POST(req: Request) {
  // --- 1. Ambil signing secret dari env ---
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET is not set.");
    return NextResponse.json(
      { error: "Webhook secret not configured." },
      { status: 500 }
    );
  }

  // --- 2. Ambil header yang diperlukan untuk verifikasi Svix ---
  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: "Missing svix headers." },
      { status: 400 }
    );
  }

  // --- 3. Ambil raw body ---
  const body = await req.text();

  // --- 4. Verifikasi signature ---
  const wh = new Webhook(WEBHOOK_SECRET);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let event: any;

  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json(
      { error: "Invalid webhook signature." },
      { status: 400 }
    );
  }

  // --- 5. Handle events ---
  const eventType = event.type as string;

  switch (eventType) {
    // ────────────────────────────────────────────
    // USER CREATED — Buat record user di database
    // ────────────────────────────────────────────
    case "user.created": {
      const { id, email_addresses } = event.data;
      const primaryEmail =
        email_addresses?.[0]?.email_address ?? "unknown@example.com";

      try {
        await prisma.user.create({
          data: {
            id: id as string,
            email: primaryEmail,
            credits: INITIAL_CREDITS,
          },
        });
        console.log(`[Webhook] User created: ${id} (${primaryEmail})`);
      } catch (error) {
        // Jika user sudah ada (misal webhook retry), skip error
        console.error("[Webhook] Failed to create user:", error);
      }

      break;
    }

    // ────────────────────────────────────────────
    // USER DELETED — Hapus record user dari database
    // ────────────────────────────────────────────
    case "user.deleted": {
      const { id } = event.data;

      try {
        await prisma.user.delete({
          where: { id: id as string },
        });
        console.log(`[Webhook] User deleted: ${id}`);
      } catch (error) {
        console.error("[Webhook] Failed to delete user:", error);
      }

      break;
    }

    default:
      console.log(`[Webhook] Unhandled event type: ${eventType}`);
  }

  return NextResponse.json({ received: true });
}
