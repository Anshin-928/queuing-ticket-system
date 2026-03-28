// app/reception/[booth_id]/page.tsx
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ReceptionForm from './ReceptionForm'

interface PageProps {
  params: Promise<{ booth_id: string }>
}

export default async function ReceptionPage({ params }: PageProps) {
  const { booth_id } = await params

  const { data: booth, error } = await supabase
    .from('booths')
    .select('*')
    .eq('id', booth_id)
    .single()

  if (error || !booth) notFound()

  return <ReceptionForm booth={booth} />
}
