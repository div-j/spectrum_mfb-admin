import { mockMetrics } from '@/lib/mock-data'

export async function GET() {
  return new Response(JSON.stringify({ data: mockMetrics }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
