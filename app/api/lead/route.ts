// app/api/lead/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone } = body;

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Name is required (min 2 characters).' },
        { status: 400 }
      );
    }

    if (!email && !phone) {
      return NextResponse.json(
        { error: 'At least one of email or phone is required.' },
        { status: 400 }
      );
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
      }

      const existing = await prisma.lead.findFirst({ where: { email } });
      if (existing) {
        return NextResponse.json(
          { message: "You're already on the list! We'll be in touch." },
          { status: 200 }
        );
      }
    }

    const lead = await prisma.lead.create({
      data: {
        name: name.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "You're on the list! Early access coming soon.",
        id: lead.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[POST /api/lead] Error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}
