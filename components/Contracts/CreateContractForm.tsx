import { Form, Input, Select, Button, notification } from 'antd';
import axios from 'axios';

const { Option } = Select;


const CreateContractForm = (props: any) => {

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
        //console.log("Create contract form values: ", values);
        const response = await createContract(values);
        //console.log("After creating contract: ", response);
    };

    const createContract = async (payload: any) => {
        try {
            const response = await axios.post("/api/contracts", payload.property);
            //console.log("Create contract Response: ", response.data);
            if(response.data.success){
                notification.success({
                    message: "contract Created Successfuly",
                    duration: 10
                })
            } else {
                notification.error({
                    message: "Failure",
                    description: "Failed to create contract",
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
        name="create-contract-form"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
        validateMessages={validateMessages}
    >
        <Form.Item name={['contract', 'moveIn']} label="Move In" rules={[{ required: true }]}>
            <Input size="large" />
        </Form.Item>
        <Form.Item name={['contract', 'moveOut']} label="Move Out" rules={[{ required: false }]}>
            <Input size="large" />
        </Form.Item>
        <Form.Item name={['contract', 'rentalPeriod']} label="Rental Period" rules={[{ required: false }]}>
            <Input size="large" />
        </Form.Item>
        <Form.Item name={['contract', 'rentPrice']} label="Rent Price" rules={[{ required: false }]}>
            <Input size="large" />
        </Form.Item>
        <Form.Item name={['contract', 'sellPrice']} label="Sell Price" rules={[{ required: false }]}>
            <Input size="large" />
        </Form.Item>
        
        <Form.Item name={['contract', 'ageTanant']} label="Age Tanant" rules={[{ required: false }]}>
            <Input size="large" />
        </Form.Item>


        <Form.Item name={['contract', 'phone']} label="Phone" rules={[{ required: false }]}>
            <Input size="large" />
        </Form.Item>
        <Form.Item name={['contract', 'nameOwner']} label="Owner Name" rules={[{ required: false }]}>
            <Input size="large" />
        </Form.Item>
        <Form.Item name={['contract', 'nameCondo']} label="Condo Name" rules={[{ required: false }]}>
            <Input size="large" />
        </Form.Item>
        <Form.Item name={['contract', 'noRoom']} label="No. Room" rules={[{ required: false }]}>
            <Input size="large"/>
        </Form.Item>



        <Form.Item name={['contract', 'location']} label="Location" rules={[{ required: false }]}>
            <Input size="large" />
        </Form.Item>
        
        <Form.Item name={['contract', 'presentBy']} label="Present By" rules={[{ required: false }]}>
            <Input size="large" />
        </Form.Item>

        <Form.Item name={['contract', 'tm30']} label="TM30" rules={[{ required: false }]}>
            <Input size="large" />
        </Form.Item>
        <Form.Item name={['contract', 'contractSing']} label="Contract Sing" rules={[{ required: false }]}>
            <Input size="large" />
        </Form.Item>
        <Form.Item name={['contract', 'furnsihedList']} label="Furnsihed List" rules={[{ required: false }]}>
            <Input size="large" />
        </Form.Item>
        <Form.Item name={['contract', 'draftContract']} label="Draft Contract" rules={[{ required: false }]}>
            <Input size="large"/>
        </Form.Item>

        <Form.Item name={['contract', 'advertFrom']} label="Advert From" rules={[{ required: false }]}>
            <Input size="large" />
        </Form.Item>
        
        
        
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
            <Button style={{width:"100%"}} type="primary" htmlType="submit">
                Submit
            </Button>
        </Form.Item>
    </Form>
}

export default CreateContractForm;