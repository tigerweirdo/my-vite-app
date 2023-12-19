import { useState, useEffect } from "react";
import { Form, Input, Button, Spin, message } from "antd";
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const UpdateContactPage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success("Contact bilgileri başarıyla güncellendi.");
      } else {
        message.error("Contact bilgileri güncellenirken bir hata oluştu.");
      }
    } catch (error) {
      console.log("Güncelleme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContactInfo = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/contact`);

      if (response.ok) {
        const data = await response.json();
        form.setFieldsValue(data);
      } else {
        message.error("Contact bilgilerini getirme başarısız.");
      }
    } catch (error) {
      console.log("Veri hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactInfo();
  }, [apiUrl, form, fetchContactInfo]); // fetchContactInfo fonksiyonunu bağımlılık dizisine ekleyin

  return (
    <Spin spinning={loading}>
      <Form
        form={form}
        name="basic"
        layout="vertical"
        autoComplete="off"
        onFinish={onFinish}
      >
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
          Güncelle
        </Button>
      </Form>
    </Spin>
  );
};

export default UpdateContactPage;
