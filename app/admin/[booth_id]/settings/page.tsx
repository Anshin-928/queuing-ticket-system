import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import SettingsClient from './SettingsClient'

interface PageProps {
  params: Promise<{ booth_id: string }>
}

export default async function SettingsPage({ params }: PageProps) {
  const { booth_id } = await params

  const { data: booth } = await supabase.from('booths').select('*').eq('id', booth_id).single()
  if (!booth) notFound()

  return <SettingsClient booth={booth} />
}
