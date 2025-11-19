import { pendingActions } from '@/lib/mock-data'

export async function GET() {
  return new Response(JSON.stringify({ data: pendingActions }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}