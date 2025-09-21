import { useHeader } from '@/hooks'

const DashboardPage = (): React.ReactNode => {
  useHeader([
    { label: 'Dashboard' }
  ])

  return (
    <div>
      hola mundo
    </div>
  )
}

export default DashboardPage
