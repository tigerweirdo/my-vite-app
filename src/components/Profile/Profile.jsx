import { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Divider, List, message } from 'antd';

export default function UserProfile() {
    const [userInfo, setUserInfo] = useState({
      _id: '',
      name: '',
      email: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
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
      setUserInfo(data); // Update the local user info with the response
      message.success('Profile updated successfully!'); // Provide user feedback
    } catch (error) {
      console.error("Error updating user data", error);
      message.error('Failed to update profile.'); // Provide user feedback
    }
  };

  const onFinish = (values) => {
    console.log('Received values of form:', values);
    handleUpdate(values); // Call the handleUpdate function here with the updated values
    setEditMode(false);
  };


  return (
    <Card style={{ maxWidth: 800, margin: '0 auto' }}>
      <h1>User Profile</h1>
      {!editMode ? (
        <>
          <p><strong>Name:</strong> {userInfo.name}</p>
          <p><strong>Email:</strong> {userInfo.email}</p>
          <p><strong>Phone:</strong> {userInfo.phone}</p>
          <Divider>Address</Divider>
          <List>
            <List.Item><strong>Address Line 1:</strong> {userInfo.addressLine1}</List.Item>
            <List.Item><strong>Address Line 2:</strong> {userInfo.addressLine2}</List.Item>
            <List.Item><strong>City:</strong> {userInfo.city}</List.Item>
            <List.Item><strong>State:</strong> {userInfo.state}</List.Item>
            <List.Item><strong>Zip Code:</strong> {userInfo.zipCode}</List.Item>
            <List.Item><strong>Country:</strong> {userInfo.country}</List.Item>
          </List>
          <Button type="primary" onClick={() => setEditMode(true)}>Edit Profile</Button>
        </>
      ) : (
        <Form name="userProfile" initialValues={userInfo} onFinish={onFinish} layout="vertical">
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input />
          </Form.Item>
          <Divider>Profile</Divider>
          <Form.Item label="Address Line 1" name="addressLine1">
            <Input />
          </Form.Item>
          <Form.Item label="Address Line 2" name="addressLine2">
            <Input />
          </Form.Item>
          <Form.Item label="City" name="city">
            <Input />
          </Form.Item>
          <Form.Item label="State" name="state">
            <Input />
          </Form.Item>
          <Form.Item label="Zip Code" name="zipCode">
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
