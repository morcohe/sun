import '../styles/globals.css';
import 'antd/dist/antd.css';
import Layout from '../layout';
import type { AppProps } from 'next/app';



function InnerCloud({ Component, pageProps }: AppProps) {
  return <Layout><Component {...pageProps} /></Layout>
}



export default InnerCloud;
