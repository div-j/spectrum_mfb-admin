import { mockCompanies } from '@/lib/mock-data'

export async function GET() {
  return new Response(JSON.stringify({ data: mockCompanies }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
