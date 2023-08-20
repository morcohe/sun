import { Form, Input, Select, Button, notification } from 'antd';
import axios from 'axios';

const { Option } = Select;


const CreatePropertyForm = (props: any) => {

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
        console.log("Create property form values: ", values);
        const response = await createProperty(values);
        console.log("After creating property: ", response);
    };

    const createProperty = async (payload: any) => {
        try {
            const response = await axios.post("/api/properties", payload.property);
            console.log("Create Property Response: ", response.data);
            if(response.data.success){
                notification.success({
                    message: "Property Created Successfuly",
                    duration: 10
                })
            } else {
                notification.error({
                    message: "Failure",
                    description: "Failed to create property",
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
        name="create-property-form"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
        validateMessages={validateMessages}
    >
        <Form.Item name={['property', 'code']} label="Code" rules={[{ required: true }]}>
            <Input size="large" />
        </Form.Item>
        <Form.Item name={['property', 'condo']} label="Condo" rules={[{ required: false }]}>
            <Input size="large" />
        </Form.Item>
        <Form.Item name={['property', 'owner']} label="Owner" rules={[{ required: false }]}>
            <Input size="large" />
        </Form.Item>
        <Form.Item name={['property', 'phone']} label="Phone" rules={[{ required: false }]}>
            <Input size="large" type="tel" />
        </Form.Item>
        <Form.Item name={['property', 'line']} label="Line" rules={[{ required: false }]}>
            <Input size="large" />
        </Form.Item>
        
        <Form.Item name={['property', 'provice']} label="Provice" rules={[{ required: false }]}>
            <Input size="large" />
        </Form.Item>


        <Form.Item name={['property', 'area']} label="Area" rules={[{ required: false }]}>
            <Input size="large" />
        </Form.Item>
        <Form.Item name={['property', 'size']} label="Size" rules={[{ required: false }]}>
            <Input size="large" />
        </Form.Item>
        <Form.Item name={['property', 'floor']} label="Floor" rules={[{ required: false }]}>
            <Input size="large" />
        </Form.Item>
        <Form.Item name={['property', 'tower']} label="Tower" rules={[{ required: false }]}>
            <Input size="large"/>
        </Form.Item>

        <Form.Item
            name={['property', 'type']}
            label="Type"
            rules={[{ required: false, message: 'Please select role!' }]}
        >
            <Select size="large" placeholder="select a role">
                <Option value="Studio">Studio</Option>
                <Option value="Duplex">Duplex</Option>
                <Option value="Penthouse">Penthouse</Option>
                <Option value="2Bed 2Bath">2Bed 2Bath</Option>
                <Option value="3Bed 2Bath">3Bed 2Bath</Option>
            </Select>
        </Form.Item>

        <Form.Item name={['property', 'priceRent']} label="Rent Price" rules={[{ required: false }]}>
            <Input size="large" />
        </Form.Item>
        
        <Form.Item name={['property', 'pricePostForSale']} label="Price Post For Sale" rules={[{ required: false }]}>
            <Input size="large" />
        </Form.Item>

        <Form.Item name={['property', 'netPrice']} label="Net Price" rules={[{ required: false }]}>
            <Input size="large" />
        </Form.Item>
        <Form.Item name={['property', 'transferOwnership']} label="Transfer Ownership" rules={[{ required: false }]}>
            <Input size="large" />
        </Form.Item>
        <Form.Item name={['property', 'mark']} label="Mark" rules={[{ required: false }]}>
            <Input size="large" />
        </Form.Item>
        <Form.Item name={['property', 'status']} label="Status" rules={[{ required: false }]}>
            <Input size="large"/>
        </Form.Item>

        <Form.Item name={['property', 'dateForUpdate']} label="Date For Update" rules={[{ required: false }]}>
            <Input size="large" />
        </Form.Item>
        <Form.Item name={['property', 'propertyHub']} label="Property Hub" rules={[{ required: false }]}>
            <Input size="large" />
        </Form.Item>
        

        
        
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
            <Button style={{width:"100%"}} type="primary" htmlType="submit">
                Submit
            </Button>
        </Form.Item>
    </Form>
}

export default CreatePropertyForm;