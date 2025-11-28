import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const severity = searchParams.get('severity');
    const status = searchParams.get('status') || 'active';

    const params = new URLSearchParams();
    if (region) params.append('region', region);
    if (severity) params.append('severity', severity);
    params.append('status', status);

    const response = await fetch(`${API_URL}/alerts?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch alerts');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Alerts API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}
