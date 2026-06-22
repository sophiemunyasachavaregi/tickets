import { createClient } from '@supabase/supabase-js'
import HomeClient from './HomeClient'

type InventoryRow = {
  event_date: string
  ticket_category: string
  total_quantity: number
  sold_quantity: number
}

async function getInventory() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data } = await supabase.from('ticket_inventory').select('*')
  const map: Record<string, Record<string, { total: number; sold: number }>> = {}
  ;((data as InventoryRow[]) ?? []).forEach(row => {
    if (!map[row.event_date]) map[row.event_date] = {}
    map[row.event_date][row.ticket_category] = {
      total: row.total_quantity,
      sold: row.sold_quantity,
    }
  })
  return map
}

export default async function HomePage() {
  const inventory = await getInventory()
  return <HomeClient inventory={inventory} />
}
