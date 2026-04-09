import { type NextPage } from 'next'
import TicketsClient from './TicketsClient'

interface Props {
  params: Promise<{ booth_id: string }>
}

const TicketsPage: NextPage<Props> = async ({ params }) => {
  const { booth_id } = await params
  return <TicketsClient boothId={booth_id} />
}

export default TicketsPage
