// AdminPanel.jsx

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input } from 'antd';

const SliderManager = () => {
    const [sliders, setSliders] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingSlider, setEditingSlider] = useState(null);
    const apiUrl = import.meta.env.VITE_API_BASE_URL; // Ensure this environment variable is set in your .env file

    // Fetch sliders from the backend
    useEffect(() => {
        fetch(`${apiUrl}/api/slider`) // Template literal for apiUrl
            .then(response => response.json())
            .then(data => setSliders(data));
    }, [apiUrl]); // apiUrl as a dependency

    const showModal = (slider = null) => {
        setEditingSlider(slider); // Null for new slider, object for editing
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingSlider(null);
    };

    const handleSubmit = async (values) => {
        const method = editingSlider ? 'PUT' : 'POST';
        const url = editingSlider ? `${apiUrl}/api/slider/${editingSlider._id}` : `${apiUrl}/api/slider`; // Corrected URL and added apiUrl

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        }).then(() => {
            setIsModalVisible(false);
            setEditingSlider(null);
            // Refresh the sliders list
            return fetch(`${apiUrl}/api/slider`) // Template literal for apiUrl
                .then(response => response.json())
                .then(data => setSliders(data));
        });
    };

    return (
        <div>
            <Button type="primary" onClick={() => showModal()}>Add New Slider</Button>
            <Table dataSource={sliders} rowKey="_id">
                {/* Define your Table columns here */}
            </Table>
            <Modal title={editingSlider ? "Edit Slider" : "Add New Slider"} width={1000}
 visible={isModalVisible} onCancel={handleCancel} footer={null}>
                <Form initialValues={editingSlider} onFinish={handleSubmit} layout="vertical">
                    <Form.Item label="Image URL" name="imageUrl">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Title" name="title">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Description" name="description">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Button Text" name="buttonText">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Button Link" name="buttonLink">
                        <Input />
                    </Form.Item>
                    {/* Add other form items for title, description, etc. */}
                    <Button type="primary" htmlType="submit">{editingSlider ? "Update" : "Create"}</Button>
                </Form>
            </Modal>
        </div>
    );
};

export default SliderManager;
