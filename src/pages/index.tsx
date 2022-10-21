import type { NextPage } from "next";
import Head from "next/head";
import Header from "../components/header";
import RegisterNameForm from "../components/registerName/RegisterNameForm";
import { TitleTyping } from "../components/TitleTyping";
import { useAccount } from "wagmi";

const Home: NextPage = () => {
  const { isConnected } = useAccount();
  return (
    <>
      <Header />
      <Head>
        <title>Canto Name Service</title>
        <meta name="description" content="canto name service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto mt-12 flex min-h-screen flex-col  items-center p-4">
        <TitleTyping />
        {isConnected ? (
          <RegisterNameForm />
        ) : (
          <h2 className="m-2 p-2 text-xl font-bold ">
            Connect your wallet above
          </h2>
        )}
      </main>
    </>
  );
};

export default Home;
