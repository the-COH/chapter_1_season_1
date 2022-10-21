import { Layout } from "../components/layout";
import type { NextPage } from "next";

const About: NextPage = () => {
  return (
    <>
      <Layout>
        <div className="flex-row justify-center text-center">
          <h2 className=" m-2">We are Canto Name Service</h2>
          <br />
          <h1>more to come...</h1>
        </div>
      </Layout>
    </>
  );
};

export default About;
