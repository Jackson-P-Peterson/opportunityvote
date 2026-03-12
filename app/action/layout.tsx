import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Americans for Opportunity Action',
  description:
    'Americans for Opportunity Action is a 501(c)(4) social welfare organization dedicated to civic engagement and advocacy.',
  openGraph: {
    title: 'Americans for Opportunity Action',
    description:
      'Americans for Opportunity Action is a 501(c)(4) social welfare organization dedicated to civic engagement and advocacy.',
  },
  alternates: {
    canonical: '/action',
  },
}

export default function ActionLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="action-site min-h-screen flex flex-col" data-site="action">
      {children}
    </div>
  )
}
