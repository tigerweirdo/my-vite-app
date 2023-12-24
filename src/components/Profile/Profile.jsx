import { useState, useEffect } from 'react';
import { Form,Button,Input, Card, Divider, Descriptions, message, Typography } from 'antd';
import { EditOutlined, UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function UserProfile() {
    const [userInfo, setUserInfo] = useState({
      _id: '',
      username: '',
      email: '',
      phone: '',
      addressLine1: '',
      city: '',
      state: '',
      name: '',
    });
    const [editMode, setEditMode] = useState(false);
    const apiUrl = import.meta.env.VITE_API_BASE_URL; // Ensure this is defined in your .env file
  
    useEffect(() => {
      const fetchData = async () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
       
        // Prevent fetch if userId is null
        if (!userId) {
          message.error('No user ID found. Please ensure you are logged in.');
          return;
        }
  
        try {
          const response = await fetch(`${apiUrl}/api/profile/${userId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
  
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
  
          const data = await response.json();
          setUserInfo(data);
        } catch (error) {
          console.error("Error fetching user data", error);
          message.error('Failed to fetch user data.');
        }
      };
  
      fetchData();
    }, [apiUrl]);
  
  const handleUpdate = async (updatedInfo) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    console.log(`Token: ${token}, UserId: ${userId}`);

    
    try {
      const response = await fetch(`${apiUrl}/api/profile/${userId}`, {
        method: 'PUT', // Should be PUT to match the route
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedInfo)
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`); // Improve error handling
      }

      const data = await response.json();
      setUserInfo(data); // Update local state with updated data
      message.success('Profile updated successfully!');
    } catch (error) {
      console.error("Error updating user data", error);
      message.error('Failed to update profile.');
    }
  };

  // Handle form submission
  const onFinish = (values) => {
    handleUpdate(values);
    setEditMode(false); // Turn off edit mode after update
  };

  

  return (
    <Card bordered={false} style={{ maxWidth: 800, margin: '20px auto', padding: '20px' }}>
      <Title level={2} style={{ textAlign: 'center' }}><UserOutlined /> User Profile</Title>
      <Divider />
      {!editMode ? (
        <div>
          <Descriptions title="User Info" bordered column={1}>
            <Descriptions.Item label="Name"><strong>{userInfo.name}</strong></Descriptions.Item>
            <Descriptions.Item label="Email"><MailOutlined /> {userInfo.email}</Descriptions.Item>
            <Descriptions.Item label="Phone"><PhoneOutlined /> {userInfo.phone}</Descriptions.Item>
          </Descriptions>
          <Divider>Address</Divider>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Address Line 1"><HomeOutlined /> {userInfo.addressLine1}</Descriptions.Item>
            <Descriptions.Item label="City">{userInfo.city}</Descriptions.Item>
            <Descriptions.Item label="State">{userInfo.state}</Descriptions.Item>
          </Descriptions>
          <Button icon={<EditOutlined />} type="primary" onClick={() => setEditMode(true)} style={{ marginTop: '20px' }}>Edit Profile</Button>
        </div>
      ) : (
        <Form name="userProfile" initialValues={userInfo} onFinish={onFinish} layout="vertical">
           <Divider>Profile</Divider>
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input />
          </Form.Item>
          <Form.Item label="Address Line 1" name="addressLine1">
            <Input />
          </Form.Item>
          <Form.Item label="City" name="city">
            <Input />
          </Form.Item>

          <Form.Item label="Country" name="country">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Save Changes</Button>
            <Button style={{ marginLeft: 8 }} onClick={() => setEditMode(false)}>Cancel</Button>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
}

