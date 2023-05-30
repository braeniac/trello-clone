import './globals.css'

export const metadata = {
  title: 'Trello',
  description: 'Created by Maninder',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
