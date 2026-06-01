import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// ============================================================
// GET /api/credits
// ============================================================
// Endpoint ini mengembalikan saldo kredit user yang sedang login.
// Digunakan oleh frontend untuk menampilkan sisa kredit di UI.
// ============================================================
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    if (!user) {
      // User belum ada di database (webhook belum terproses)
      // Buat user secara lazy dengan kredit awal
      const newUser = await prisma.user.create({
        data: {
          id: userId,
          email: "pending@sync.com", // Akan di-update via webhook
          credits: 15,
        },
        select: { credits: true },
      });

      return NextResponse.json({ credits: newUser.credits });
    }

    return NextResponse.json({ credits: user.credits });
  } catch (error) {
    console.error("Credits API Error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
