// app/admin/[booth_id]/layout.tsx
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import BoothAdminLayout from './BoothAdminLayout'

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ booth_id: string }>
}

export default async function BoothScopedLayout({ children, params }: LayoutProps) {
  const { booth_id } = await params

  const { data: booth, error } = await supabase
    .from('booths')
    .select('id, name')
    .eq('id', booth_id)
    .single()

  if (error || !booth) notFound()

  return (
    <BoothAdminLayout boothId={booth.id} boothName={booth.name}>
      {children}
    </BoothAdminLayout>
  )
}
