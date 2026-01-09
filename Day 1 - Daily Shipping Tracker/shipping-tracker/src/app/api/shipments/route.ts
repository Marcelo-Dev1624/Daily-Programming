import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const carriers = ["DHL", "FedEx", "UPS", "Correos"] as const;
const statuses = ["CREATED", "IN_TRANSIT", "DELIVERED", "ISSUE"] as const;

const isCarrier = (value: string) =>
  carriers.includes(value as (typeof carriers)[number]);

const isStatus = (value: string) =>
  statuses.includes(value as (typeof statuses)[number]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  if (status && !isStatus(status)) {
    return NextResponse.json(
      { error: "Invalid status filter." },
      { status: 400 },
    );
  }

  const shipments = await prisma.shipment.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(shipments);
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    carrier?: string;
    trackingNumber?: string;
    status?: string;
    note?: string | null;
  };
  

  const carrier = body.carrier?.trim() ?? "";
  const trackingNumber = body.trackingNumber?.trim() ?? "";
  const status = body.status?.trim() ?? "";
  const note = body.note?.trim() ?? null;

  if (!carrier || !isCarrier(carrier)) {
    return NextResponse.json(
      { error: "Carrier must be DHL, FedEx, UPS, or Correos." },
      { status: 400 },
    );
  }

  if (trackingNumber.length < 5) {
    return NextResponse.json(
      { error: "Tracking number must be at least 5 characters." },
      { status: 400 },
    );
  }

  if (!status || !isStatus(status)) {
    return NextResponse.json(
      { error: "Status must be CREATED, IN_TRANSIT, DELIVERED, or ISSUE." },
      { status: 400 },
    );
  }

  try {
    const shipment = await prisma.shipment.create({
      data: {
        carrier,
        trackingNumber,
        status,
        note: note || null,
      },
    });

    return NextResponse.json(shipment, { status: 201 });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        {
          error:
            "This carrier + tracking number already exists. Try a different one.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create shipment." },
      { status: 500 },
    );
  }

  
}

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
