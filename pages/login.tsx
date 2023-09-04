import type { NextPage } from 'next';
import { Form, Input, Button, notification } from 'antd';
import { useRouter } from 'next/router';
import { auth } from '../src/AccessControl';
import mFetcher from '../src/Fetch/Fetcher';


export async function getServerSideProps({ req }: any) {
  return await auth("Login", req);
}



const Login: NextPage = () => {

  const router = useRouter();

  const onFinish = async (credentials: any) => {
    try {

      if (typeof window !== 'undefined') {
        const response = await mFetcher.fetch({ 'url': `/api/auth`, method: "POST", isOutboundRequest: true, data: credentials });
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
        router.push("/dashboard");
        return response.data;
      }

    } catch (error) {
      notification.error({
        message: "Login Failed",
        description: "Wrong credentials"
      })
      console.error(error);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (<div style={{ width: "100%", margin: "auto", textAlign: "center", display: "flex", justifyContent: "center" }}>
    <div style={{ height: "50%", marginTop: "10%" }}>
      <div style={{ border: "1px solid lightgray", borderRadius: "20px", padding: "50px" }}>
        <img src="/images/sun-real-estate-logo.png" />
        <div style={{ display: "flex", gap: "25px", flexDirection: "column", marginTop: "20px" }}>
          <Form
            name="login"
            style={{ textAlign: "center", margin: "auto" }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Username"
              name="email"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item style={{ width: "100%" }}>
              <Button style={{ width: "100%" }} type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>




  </div>
  )
}

export default Login;
