import type { NextPage } from 'next'
import Layout from '~/layouts'
import Create from '~/create'

const Home: NextPage = () => {
  return (
    <Layout title="Create" description="Create a two-party contract.">
      <div className="flex items-center justify-center">
      <Create />
      </div>
    </Layout>
  )
}

export default Home
