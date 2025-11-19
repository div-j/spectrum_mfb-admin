import { NextRequest, NextResponse } from "next/server";
import { admins } from "@/lib/mock-data";

// ✅ GET /admin/api/administrator/profile
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get("adminId");

    let admin;
    if (adminId) {
      admin = admins.find((a) => a.id === adminId);
    } else {
      // For demo, return the first admin
      admin = admins[0];
    }

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: { admin },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
