// app/admin/[booth_id]/checkin/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'

export type CheckinResult =
  | { type: 'direct' }
  | { type: 'crowded'; ticketNumber: number }
  | { type: 'error'; message: string }

export async function issueTicket(boothId: string, partySize: number): Promise<CheckinResult> {
  const { data: booth, error: boothError } = await supabase
    .from('booths')
    .select('status')
    .eq('id', boothId)
    .single()

  if (boothError || !booth) {
    return { type: 'error', message: 'ブース情報の取得に失敗しました。' }
  }

  if (booth.status === 'empty') {
    // 直行モード：direct ログを INSERT
    const { data: maxRow } = await supabase
      .from('tickets')
      .select('ticket_number')
      .eq('booth_id', boothId)
      .order('ticket_number', { ascending: false })
      .limit(1)
      .single()

    const nextNumber = maxRow ? maxRow.ticket_number + 1 : 1

    const { error } = await supabase.from('tickets').insert({
      booth_id: boothId,
      ticket_number: nextNumber,
      party_size: partySize,
      status: 'direct',
    })

    if (error) return { type: 'error', message: '発券処理に失敗しました。' }

    revalidatePath(`/admin/${boothId}`)
    revalidatePath(`/admin/${boothId}/checkin`)
    return { type: 'direct' }
  } else {
    // 整理券モード
    // まず unissued（QR印刷済み）チケットを優先して使う
    const { data: unissuedTicket } = await supabase
      .from('tickets')
      .select('id, ticket_number')
      .eq('booth_id', boothId)
      .eq('status', 'unissued')
      .order('ticket_number', { ascending: true })
      .limit(1)
      .single()

    if (unissuedTicket) {
      // unissued チケットを waiting に更新
      const { error } = await supabase
        .from('tickets')
        .update({
          status: 'waiting',
          party_size: partySize,
          updated_at: new Date().toISOString(),
        })
        .eq('id', unissuedTicket.id)

      if (error) return { type: 'error', message: '発券処理に失敗しました。' }

      revalidatePath(`/admin/${boothId}`)
      revalidatePath(`/admin/${boothId}/checkin`)
      return { type: 'crowded', ticketNumber: unissuedTicket.ticket_number }
    }

    // unissued がない場合は番号を採番して新規 waiting を作成
    // （後でPDF生成した際にこの番号のQRが自動的に紐づく）
    const { data: maxRow } = await supabase
      .from('tickets')
      .select('ticket_number')
      .eq('booth_id', boothId)
      .order('ticket_number', { ascending: false })
      .limit(1)
      .single()

    const nextNumber = maxRow ? maxRow.ticket_number + 1 : 1

    const { error } = await supabase.from('tickets').insert({
      booth_id: boothId,
      ticket_number: nextNumber,
      party_size: partySize,
      status: 'waiting',
    })

    if (error) return { type: 'error', message: '発券処理に失敗しました。' }

    revalidatePath(`/admin/${boothId}`)
    revalidatePath(`/admin/${boothId}/checkin`)
    return { type: 'crowded', ticketNumber: nextNumber }
  }
}
