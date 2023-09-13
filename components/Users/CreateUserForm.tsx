import { Form, Input, Select, Button, notification } from 'antd';
import axios from 'axios';

const { Option } = Select;


const CreateUserForm = (props: any) => {

    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 },
    };

    const validateMessages = {
        required: '${label} is required!',
        types: {
            email: '${label} is not a valid email!',
            number: '${label} is not a valid number!',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    };
    /* eslint-enable no-template-curly-in-string */

    const onFinish = async (values: any) => {
        //console.log("Create user form values: ", values);
        const response = await createUser(values);
        //console.log("After creating user: ", response);
    };

    const createUser = async (payload: any) => {
        try {
            const response = await axios.post("/api/users", payload.user);
            //console.log("Create User Response: ", response.data);
            if(response.data.success){
                notification.success({
                    message: "User Created Successfuly",
                    duration: 10
                })
            } else {
                notification.error({
                    message: "Failure",
                    description: "Failed to create user",
                    duration: 10
                })
            }
            return response.data;
        } catch (error) {
            notification.error({
                message: "Error",
                description: JSON.stringify(error),
                duration: 10
            })
            console.error(error)
        }
    }

    return <Form
        {...layout}
        name="nest-messages"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
        validateMessages={validateMessages}
    >
        <Form.Item name={['user', 'id']} label="Id" rules={[{ required: true }]}>
            <Input size="large" />
        </Form.Item>
        <Form.Item name={['user', 'name']} label="Name" rules={[{ required: true }]}>
            <Input size="large" />
        </Form.Item>
        <Form.Item name={['user', 'email']} label="Email" rules={[{ type: 'email', required: true }]}>
            <Input size="large" />
        </Form.Item>
        <Form.Item name={['user', 'phone']} label="Phone" rules={[{ required: true }]}>
            <Input size="large" type="tel" />
        </Form.Item>
        <Form.Item name={['user', 'password']} label="Password" rules={[{ required: true }]}>
            <Input size="large" type="password" />
        </Form.Item>
        <Form.Item
            name={['user', 'role']}
            label="Role"
            rules={[{ required: true, message: 'Please select role!' }]}
        >
            <Select size="large" placeholder="select a role">
                <Option value="Seeking">Seeking</Option>
                <Option value="Marketing">Marketing</Option>
                <Option value="Sales">Sales</Option>
                <Option value="Admin">Admin</Option>
            </Select>
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
            <Button style={{width:"100%"}} type="primary" htmlType="submit">
                Submit
            </Button>
        </Form.Item>
    </Form>
}

export default CreateUserForm;