import { Button, Space, Table, message, Modal, Form, Input } from 'antd';
import { useCallback, useEffect, useState } from 'react';

const LayoutSettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const columns = [
    {
      title: 'Site Title',
      dataIndex: 'siteTitle',
      key: 'siteTitle',
    },
    {
      title: 'Logo URL',
      dataIndex: 'logoUrl',
      key: 'logoUrl',
    },
   
    {
      title: 'Contact Phone',
      dataIndex: ['contactInfo', 'phone'], // Nested object için
      key: 'phone',
    },
    {
      title: 'Contact Email',
      dataIndex: ['contactInfo', 'email'], // Nested object için
      key: 'email',
    },
    {
      title: 'Facebook URL',
      dataIndex: ['socialMediaLinks', 'facebook'], // Nested object için
      key: 'facebook',
    },
    {
      title: 'Twitter URL',
      dataIndex: ['socialMediaLinks', 'twitter'], // Nested object için
      key: 'twitter',
    },
    // İhtiyaç duyduğunuz diğer sosyal medya linkleri veya alanlar
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/layout`);
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      } else {
        throw new Error('Failed to fetch settings');
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleUpdate = async (values) => {
    // Burada güncelleme işlemlerini gerçekleştirin
    // Örnek olarak, ilk ayarı güncelleyebilirsiniz:
    try {
      const response = await fetch(`${apiUrl}/api/layout/${settings[0]._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        const updatedSettings = await response.json();
        setSettings([updatedSettings]);
        message.success('Settings updated successfully');
        setIsModalVisible(false);
      } else {
        throw new Error('Failed to update settings');
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <>
      <Table
        dataSource={settings}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={false}
      />
      <Modal
        title="Edit Layout Settings"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          initialValues={settings ? settings[0] : {}}
          onFinish={handleUpdate}
        >
           <Form.Item name="siteTitle" label="Site Title">
    <Input />
  </Form.Item>
  <Form.Item name="logoUrl" label="Logo URL">
    <Input />
  </Form.Item>
  <Form.Item name="footerText" label="Footer Text">
    <Input />
  </Form.Item>
  <Form.Item name={['contactInfo', 'phone']} label="Contact Phone">
    <Input />
  </Form.Item>
  <Form.Item name={['contactInfo', 'email']} label="Contact Email">
    <Input />
  </Form.Item>
  <Form.Item name={['socialMediaLinks', 'facebook']} label="Facebook URL">
    <Input />
  </Form.Item>
  <Form.Item name={['socialMediaLinks', 'twitter']} label="Twitter URL">
    <Input />
  </Form.Item>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default LayoutSettingsPage;
