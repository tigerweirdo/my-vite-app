import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';

const SliderManager = () => {
    const [sliders, setSliders] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingSlider, setEditingSlider] = useState(null);
    const [loading, setLoading] = useState(false);
    const apiUrl = import.meta.env.VITE_API_BASE_URL || "YOUR_DEFAULT_API_URL"; // Add a default URL or ensure the environment variable is set

    // Fetch sliders from the backend
    useEffect(() => {
        setLoading(true);
        fetch(`${apiUrl}/api/slider`) // Template literal for apiUrl
            .then(response => response.json())
            .then(data => setSliders(data))
            .finally(() => setLoading(false));
    }, [apiUrl]); // apiUrl as a dependency

    const showModal = (slider = null) => {
        setEditingSlider(slider); // Null for new slider, object for editing
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingSlider(null);
    };
    const handleDelete = async (id) => {
        setLoading(true);
        fetch(`${apiUrl}/api/slider/${id}`, {
            method: 'DELETE'
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(() => {
            // Remove the deleted slider from the sliders state
            setSliders(sliders.filter(slider => slider._id !== id));
            message.success('Slider deleted successfully!');
        })
       
        .finally(() => setLoading(false));
    };


    const handleSubmit = async (values) => {
        setLoading(true);
        const method = editingSlider ? 'PUT' : 'POST';
        const url = editingSlider ? `${apiUrl}/api/slider/${editingSlider._id}` : `${apiUrl}/api/slider`;

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(() => {
            setIsModalVisible(false);
            setEditingSlider(null);
            message.success(`Slider ${editingSlider ? 'updated' : 'created'} successfully!`);
            // Optionally: Update the sliders state locally instead of refetching from the backend
        })
       
    };

    // Define your Table columns here
    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <span>
                <Button onClick={() => showModal(record)} style={{ marginRight: 8 }}>Edit</Button>
                <Button onClick={() => handleDelete(record._id)} danger type="primary">Delete</Button>
            </span>
            ),
        },
    ];

    return (
        <div>
            <Button type="primary" onClick={() => showModal()} loading={loading}>Add New Slider</Button>
            <Table dataSource={sliders} rowKey="_id" columns={columns} loading={loading} />
                        <Modal title={editingSlider ? "Edit Slider" : "Add New Slider"} visible={isModalVisible} onCancel={handleCancel} footer={null} width={1000}>
                <Form initialValues={editingSlider} onFinish={handleSubmit} layout="vertical">
                    <Form.Item label="Image URL" name="imageUrl" rules={[{ required: true, message: 'Please input the image URL!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please input the title!' }]}>
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
                    <Button type="primary" htmlType="submit" loading={loading}>{editingSlider ? "Update" : "Create"}</Button>
                </Form>
            </Modal>
        </div>
    );
};

export default SliderManager;
