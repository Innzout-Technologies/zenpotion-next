export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // TEMP: remove DB call to confirm build works
    return Response.json({
      success: true,
      data: body,
    });
  } catch (err) {
    return Response.json({ error: 'Failed' }, { status: 500 });
  }
}