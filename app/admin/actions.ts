// app/admin/actions.ts
'use server'

import { supabase } from '@/lib/supabase'

export async function createBooth(name: string): Promise<{ id: string }> {
  const { data, error } = await supabase
    .from('booths')
    .insert({ name, status: 'empty', capacity: 0 })
    .select('id')
    .single()

  if (error) throw new Error(error.message)
  return data
}

