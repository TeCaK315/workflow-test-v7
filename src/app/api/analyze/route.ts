import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';

const DEMO_MODE = !process.env.OPENAI_API_KEY;

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

const SYSTEM_PROMPT = `Analyze this JSON log and suggest a patch for the integration error\\n\\nYour purpose: AI analyzes the JSON log and suggests fixes\\n\\nValue you provide: Automated Integration Error Solutions\\n\\nYour key capabilities:\\n- Automated JSON Log Analysis\\n- Suggested Fixes for Errors\\n\\nYour advantage: Quick and reliable automated patches with real-time solutions\\n\\nOUTPUT INSTRUCTIONS:\\nYou must PRODUCE the actual product output — not analyze or describe it.\\nFor example: if you are a quiz maker, CREATE actual quiz questions.\\nIf you are a business plan generator, WRITE the actual business plan.\\nIf you are a fitness coach app, GENERATE the actual workout plan.\\n\\nALWAYS respond in English.\\n\\nReturn a JSON object with this structure:\\n{\\n  "title": "Title of the generated output",\\n  "executive_summary": "Brief 1-2 sentence summary of what was produced",\\n  "sections": [\\n    {\\n      "heading": "Section name",\\n      "content": "Detailed content for this section",\\n      "key_points": ["Important detail 1", "Important detail 2"]\\n    }\\n  ],\\n  "conclusion": "Summary or total / final note",\\n  "recommendations": ["Next step 1", "Next step 2"]\\n}\\n\\nMake the sections SPECIFIC to the actual product output.\\nUse as many sections as needed to fully represent the result.\\nBe detailed, professional, and immediately useful.`;

// Build a contextual demo response using actual user input
function buildDemoResponse(body: Record<string, any>): Record<string, any> {
  const inputSummary = `${body['error_log'] || 'N/A'}`;
  return {
    title: `workflow-test-v7 — ${inputSummary}`,
    executive_summary: `Your Integration Patch has been generated based on: ${inputSummary}. Automated Integration Error Solutions. This is a demo preview — connect your OpenAI API key for AI-powered results.`,
    sections: [
      {
        heading: 'Automated JSON Log Analysis',
        content: `Automated analysis of JSON logs to identify issues quickly. Based on your input: error_log: ${body['error_log'] || 'N/A'}.`,
        key_points: [`${body['error_log'] ? 'error_log: ' + body['error_log'] : 'error_log: pending'}`],
      },
      {
        heading: 'Suggested Fixes for Errors',
        content: `Provide clear, actionable recommendations for fixing integration errors. Based on your input: error_log: ${body['error_log'] || 'N/A'}.`,
        key_points: [`${body['error_log'] ? 'error_log: ' + body['error_log'] : 'error_log: pending'}`],
      },
      {
        heading: 'User-Friendly Interface',
        content: `Simple drag-and-drop interface for uploading error logs. Based on your input: error_log: ${body['error_log'] || 'N/A'}.`,
        key_points: [`${body['error_log'] ? 'error_log: ' + body['error_log'] : 'error_log: pending'}`],
      }
    ],
    conclusion: `Your Integration Patch for ${inputSummary} is ready. Connect an OpenAI API key in your environment variables for full AI-powered generation.`,
    recommendations: ['Add OPENAI_API_KEY to your environment variables for real AI output', 'Review all sections above', 'Export or share your results'],
  };
}

export async function POST(req: NextRequest) {
  try {
    // ─── Optional auth: works with or without Supabase ───
    let userId: string | null = null;
    try {
      const { createClient } = await import('@/lib/supabase/server');
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id || null;

      if (userId) {
        try {
          const { checkUsageLimit } = await import('@/lib/usage');
          const hasCapacity = await checkUsageLimit(userId, 'analyses');
          if (!hasCapacity) {
            return NextResponse.json(
              { error: 'Usage limit reached. Please upgrade your plan.' },
              { status: 429 }
            );
          }
        } catch {}
      }
    } catch {
      // Supabase not configured — continue without auth
    }

    const body = await req.json();
    const input = body.input || body.q || '';
    
    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'Input is required' },
        { status: 400 }
      );
    }

    // ─── DEMO MODE: return contextual results using actual input ───
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1500));

      return NextResponse.json({
        success: true,
        analysis: buildDemoResponse(body),
        output_format: 'report',
        demo: true,
      });
    }

    // ─── LIVE MODE: call OpenAI ───
    
    const contentToAnalyze = input;

    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Process the following input and produce the result:\n\n${contentToAnalyze}` },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    });

    const resultText = completion.choices[0]?.message?.content || '{}';

    let analysis;
    try {
      analysis = JSON.parse(resultText);
    } catch {
      analysis = { summary: resultText };
    }

    // ─── Save to DB if Supabase is available ───
    if (userId) {
      try {
        const { createClient } = await import('@/lib/supabase/server');
        const supabase = await createClient();
        const { incrementUsage } = await import('@/lib/usage');

        await incrementUsage(userId, 'analyses');

        await supabase.from('analyses').insert({
          user_id: userId,
          input: typeof input === 'string' ? input : JSON.stringify(body),
          input_type: 'file',
          result: analysis,
          tokens_used: completion.usage?.total_tokens || 0,
          created_at: new Date().toISOString(),
        });

        await supabase
          .from('profiles')
          .update({ last_analysis_at: new Date().toISOString() })
          .eq('id', userId);
      } catch {
        // DB save failed — not critical, analysis still returned
      }
    }

    return NextResponse.json({
      success: true,
      analysis,
      output_format: 'report',
    });
  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Analysis failed' },
      { status: 500 }
    );
  }
}
