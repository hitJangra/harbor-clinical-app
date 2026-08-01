import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

function escapeCsvCell(cell: unknown): string {
  if (cell === null || cell === undefined) return '';
  const cellStr = String(cell);
  // If the string contains double quotes, newlines, or commas, wrap it in double quotes and escape internal quotes
  if (cellStr.includes('"') || cellStr.includes(',') || cellStr.includes('\n') || cellStr.includes('\r')) {
    return `"${cellStr.replace(/"/g, '""')}"`;
  }
  return cellStr;
}

export async function GET() {
  const supabase = createClient();

  // 1. Authorize user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || (profile.role !== 'researcher' && profile.role !== 'admin')) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // 2. Fetch all annotations (non-draft) with sample data
  const { data: annotations, error } = await supabase
    .from('annotations')
    .select(`
      id,
      sample_id,
      therapist_id,
      is_appropriate,
      send_without_modifications,
      could_cause_harm,
      validates_without_evidence,
      cognitive_distortions,
      reasoning,
      suggested_improvement,
      rewrite_response,
      samples (
        source,
        problem_category,
        context,
        gold_response
      )
    `)
    .eq('is_draft', false);

  if (error || !annotations) {
    return new NextResponse('Failed to fetch data', { status: 500 });
  }

  // 3. Convert to CSV
  const headers = [
    'Annotation ID', 'Sample ID', 'Therapist ID', 
    'Is Appropriate', 'Send Without Mod', 'Could Cause Harm', 'Validates w/o Evidence', 
    'Cognitive Distortions', 'Reasoning', 'Suggested Improvement', 'Rewrite Response',
    'Source', 'Problem Category', 'Context', 'Gold Response'
  ];

  const csvRows = [];
  csvRows.push(headers.join(','));

  for (const ann of annotations) {
    // Handle Supabase join array/object
    const sampleData = Array.isArray(ann.samples) ? ann.samples[0] : ann.samples;
    
    const row = [
      ann.id,
      ann.sample_id,
      ann.therapist_id,
      ann.is_appropriate,
      ann.send_without_modifications,
      ann.could_cause_harm,
      ann.validates_without_evidence,
      Array.isArray(ann.cognitive_distortions) ? ann.cognitive_distortions.join('; ') : ann.cognitive_distortions,
      ann.reasoning,
      ann.suggested_improvement,
      ann.rewrite_response,
      sampleData?.source || '',
      sampleData?.problem_category || '',
      sampleData?.context || '',
      sampleData?.gold_response || ''
    ];

    csvRows.push(row.map(escapeCsvCell).join(','));
  }

  const csvString = csvRows.join('\n');

  // 4. Return as CSV download
  return new NextResponse(csvString, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="harbor_annotations_export.csv"',
    },
  });
}
