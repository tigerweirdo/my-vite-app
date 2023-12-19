import { Button, Space, Table, message, Modal, Form, Input, Tooltip } from 'antd';
import { useCallback, useEffect, useState } from 'react';

const ContactPage = () => {
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Google Maps URL',
      dataIndex: 'googleMapsUrl',
      key: 'googleMapsUrl',
      render: url => (
        <Tooltip title={url}>
          {url.length > 50 ? `${url.substring(0, 50)}...` : url}
        </Tooltip>
      ),
    },
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

  const fetchContactInfo = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/contact`);
      if (response.ok) {
        const data = await response.json();
        setContactInfo([data]);
      } else {
        throw new Error('Failed to fetch contact info');
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchContactInfo();
  }, [fetchContactInfo]);

  const handleUpdate = async (values) => {
    try {
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        const updatedInfo = await response.json();
        setContactInfo([updatedInfo]);
        message.success('Contact info updated successfully');
        setIsModalVisible(false);
      } else {
        throw new Error('Failed to update contact info');
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <>
      <Table
        dataSource={contactInfo}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={false}
      />
      <Modal
        title="Edit Contact Info"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          initialValues={contactInfo ? contactInfo[0] : {}}
          onFinish={handleUpdate}
        >
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input />
          </Form.Item>
          <Form.Item name="googleMapsUrl" label="Google Maps URL">
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

export default ContactPage;
