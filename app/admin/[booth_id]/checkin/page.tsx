// app/admin/[booth_id]/checkin/page.tsx
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import CheckinForm from './CheckinForm'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ booth_id: string }>
}

export default async function CheckinPage({ params }: PageProps) {
  const { booth_id } = await params

  const { data: booth, error } = await supabase
    .from('booths')
    .select('*')
    .eq('id', booth_id)
    .single()

  if (error || !booth) notFound()

  return <CheckinForm booth={booth} />
}
