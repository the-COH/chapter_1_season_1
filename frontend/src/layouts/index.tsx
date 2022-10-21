import Head from 'next/head'
import Header from '~/layouts/Header'

type Props = {
  title: string
  description: string
  children: React.ReactNode
}

const Layout = ({ title, description, children }: Props) => {
  const heading = title + ' | ' + 'Thoth'

  return (
    <>
      <Head>
        <title>{heading}</title>
        <meta name="description" content={description} key="description" />
        {/* TODO: ADD */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest"></link>
      </Head>
      <div className="bg-brand-600 min-h-screen">
        <Header />
        {children}
      </div>
    </>
  )
}

export default Layout
