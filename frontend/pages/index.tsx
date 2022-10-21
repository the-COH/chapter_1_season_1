import type { NextPage } from 'next'
import Layout from '~/layouts'
import Dashboard from '~/dashboard'

const Home: NextPage = () => {
  return (
    <Layout title="Home" description="View your contracts.">
      <Dashboard />
    </Layout>
  )
}

export default Home
