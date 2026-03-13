import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Americans for Opportunity Foundation',
  description:
    'Americans for Opportunity Foundation is a 501(c)(3) charitable organization dedicated to education and charitable activities.',
  openGraph: {
    title: 'Americans for Opportunity Foundation',
    description:
      'Americans for Opportunity Foundation is a 501(c)(3) charitable organization dedicated to education and charitable activities.',
  },
  alternates: {
    canonical: '/foundation',
  },
}

export default function FoundationLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="foundation-site min-h-screen flex flex-col" data-site="foundation">
      {children}
    </div>
  )
}
