import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// ============================================================
// GET /api/history
// ============================================================
// Endpoint ini mengembalikan daftar gambar yang pernah
// di-generate oleh user yang sedang login.
// Data diurutkan dari yang terbaru (descending).
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

    const generations = await prisma.generation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50, // Limit agar tidak terlalu berat
      select: {
        id: true,
        style: true,
        originalImage: true,
        resultImage: true,
        cost: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ generations });
  } catch (error) {
    console.error("History API Error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
