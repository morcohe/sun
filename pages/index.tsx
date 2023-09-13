import type { NextPage } from 'next';


export async function getServerSideProps({ req }: any) {
  return { redirect: { destination: "/login", permanent: false, }, }
}


const Home: NextPage = () => {
  return null;
}

export default Home
