// AdminPanel.jsx

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input } from 'antd';

const SliderManager = () => {
    const [sliders, setSliders] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingSlider, setEditingSlider] = useState(null);

    // Fetch sliders from the backend
    useEffect(() => {
        fetch('/api/sliders')
            .then(response => response.json())
            .then(data => setSliders(data));
    }, []);

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
        const url = editingSlider ? `/api/sliders/${editingSlider._id}` : '/api/sliders';

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
            return fetch('/api/sliders')
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
            <Modal title={editingSlider ? "Edit Slider" : "Add New Slider"}         width={1000}
 visible={isModalVisible} onCancel={handleCancel} footer={null}>
                <Form initialValues={editingSlider} onFinish={handleSubmit} layout="vertical">
                    <Form.Item label="Image URL" name="imageUrl">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Title" name="Title">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Description" name="Description">
                        <Input />
                    </Form.Item>
                    <Form.Item label="ButonText" name="ButonText">
                        <Input />
                    </Form.Item>
                    <Form.Item label="ButonLink" name="ButonLink">
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
