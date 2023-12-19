
import { useState } from "react";
import { Form, Input, Button, Spin, message } from "antd";
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const CreateContactPage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success("Contact bilgileri başarıyla oluşturuldu.");
        form.resetFields();
      } else {
        message.error("Contact bilgileri oluşturulurken bir hata oluştu.");
      }
    } catch (error) {
      console.log("Oluşturma hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <Form name="basic" layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Lütfen email adresini girin!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Telefon"
          name="phone"
          rules={[
            {
              required: true,
              message: "Lütfen telefon numarasını girin!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Adres"
          name="address"
          rules={[
            {
              required: true,
              message: "Lütfen adresi girin!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Oluştur
        </Button>
      </Form>
    </Spin>
  );
};

export default CreateContactPage;
