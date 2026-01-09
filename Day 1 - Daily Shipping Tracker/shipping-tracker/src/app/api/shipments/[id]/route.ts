import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const statuses = ["CREATED", "IN_TRANSIT", "DELIVERED", "ISSUE"] as const;
const isStatus = (value: string) =>
  statuses.includes(value as (typeof statuses)[number]);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const body = (await request.json()) as {
    status?: string;
    note?: string | null;
  };

  const status = body.status?.trim() ?? "";
  const note = body.note?.trim();

  if (!status || !isStatus(status)) {
    return NextResponse.json(
      { error: "Status must be CREATED, IN_TRANSIT, DELIVERED, or ISSUE." },
      { status: 400 },
    );
  }

  try {
    const shipment = await prisma.shipment.update({
      where: { id },
      data: { status, ...(note !== undefined ? { note } : {}) },
    });

    return NextResponse.json(shipment);
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2025"
    ) {
      return NextResponse.json({ error: "Shipment not found." }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to update shipment." },
      { status: 500 },
    );
  }
}

