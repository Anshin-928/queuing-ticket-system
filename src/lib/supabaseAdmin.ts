// src/lib/supabaseAdmin.ts
// サービスロールキーを使用するサーバー専用クライアント（RLS をバイパス）
import { createClient } from '@supabase/supabase-js'

const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey  = process.env.SUPABASE_SERVICE_ROLE_KEY!

// このクライアントは Server Actions / Route Handlers からのみ使用すること
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)
