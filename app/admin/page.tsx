// app/admin/page.tsx
import { supabase } from '@/lib/supabase'
import AdminHomeClient from './AdminHomeClient'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const { data: booths, error } = await supabase
    .from('booths')
    .select('*')
    .order('name')

  return (
    <AdminHomeClient
      booths={booths ?? []}
      fetchError={error?.message}
    />
  )
}
