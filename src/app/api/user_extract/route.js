import { NextResponse } from 'next/server';
import { fetchfromai } from '@components/ai/llmapi';

export async function POST(req) {
  try {
    const body = await req.json();
    const { prompt,model,ApiKey } = body;
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Missing required parameters: prompt is mandatory.' },
        { status: 400 }
      );
    }

    const rawResponse = await fetchfromai(prompt,ApiKey,model);
    const cleanedResponse = rawResponse.trim().replace(/^```json\s*/, '').replace(/^```/, '').replace(/```$/, '').trim();
    
    try {
      const parsed = JSON.parse(cleanedResponse);
      return NextResponse.json(parsed);
    } catch (err) {
      console.error('JSON parsing failed:', cleanedResponse);
      return NextResponse.json(
        { error: 'Failed to parse LLM output as JSON.', raw: cleanedResponse },
        { status: 502 }
      );
    }

  } catch (err) {
    console.error('[User Extract Error]', err);
    return NextResponse.json(
      { error: 'Internal server error during extraction.' },
      { status: 500 }
    );
  }
}




