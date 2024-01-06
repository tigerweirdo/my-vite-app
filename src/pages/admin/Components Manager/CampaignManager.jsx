import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';

const CampaignManager = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState(null);
    const [loading, setLoading] = useState(false);
    const apiUrl = import.meta.env.VITE_API_BASE_URL || "YOUR_DEFAULT_API_URL"; // Ensure the environment variable is set

    // Fetch campaigns from the backend
    useEffect(() => {
        setLoading(true);
        fetch(`${apiUrl}/api/campaign`)
            .then(response => response.json())
            .then(data => setCampaigns(data))
            .finally(() => setLoading(false));
    }, [apiUrl]);

    const showModal = (campaign = null) => {
        setEditingCampaign(campaign);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingCampaign(null); // Clear the form
    };

    const handleDelete = async (id) => {
        setLoading(true);
        fetch(`${apiUrl}/api/campaign/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(() => {
            setCampaigns(campaigns.filter(campaign => campaign._id !== id));
            message.success('Campaign deleted successfully!');
        })
        .catch(error => {
            console.error('Delete Error:', error);
            message.error('Failed to delete campaign');
        })
        .finally(() => setLoading(false));
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        const method = editingCampaign ? 'PUT' : 'POST';
        const url = editingCampaign ? `${apiUrl}/api/campaign/${editingCampaign._id}` : `${apiUrl}/api/campaign`;
    
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((updatedCampaign) => {
            if(editingCampaign){
                // Updating an existing campaign
                setCampaigns(campaigns.map(campaign => campaign._id === editingCampaign._id ? updatedCampaign : campaign));
            } else {
                // Adding a new campaign
                setCampaigns([...campaigns, updatedCampaign]);
            }
            setIsModalVisible(false);
            setEditingCampaign(null);
            message.success(`Campaign ${editingCampaign ? 'updated' : 'created'} successfully!`);
        })
        .catch(error => {
            console.error('Submit Error:', error);
            message.error(`Failed to ${editingCampaign ? 'update' : 'create'} campaign`);
        })
        .finally(() => setLoading(false));
    };
    
    function truncate(str, num) {
        if (str.length > num) {
            return str.slice(0, num) + "...";
        } else {
            return str;
        }
    }

    const columns = [
        {
            title: 'Image',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            width: 150, // Set a specific width for the image column
            render: text => <img src={text} alt="campaign" style={{ maxWidth: "100px", height: "auto" }} />,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            width: 200,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 600, // Set a specific width for the description column
            render: text => truncate(text, 200),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button onClick={() => showModal(record)} style={{ marginRight: 8 }}>
                        Edit
                    </Button>
                    <Button onClick={() => handleDelete(record._id)} danger type="primary">
                        Delete
                    </Button>
                </span>
            ),
        },
    ];

    return (
        <div>
            <Button type="primary" onClick={() => showModal()} loading={loading}>Add New Campaign</Button>
            <Table dataSource={campaigns} columns={columns} rowKey="_id" loading={loading} />
            <Modal title={editingCampaign ? "Edit Campaign" : "Add New Campaign"} visible={isModalVisible} onCancel={handleCancel} footer={null} width={1000}>
                <Form key={editingCampaign?._id || 'new'} // Ensure it rerenders with new initial values
                initialValues={editingCampaign} 
                onFinish={handleSubmit} 
                layout="vertical">
                    <Form.Item label="Image URL" name="imageUrl" rules={[{ required: true, message: 'Please input the image URL!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please input the title!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Description" name="description">
                        <Input />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>{editingCampaign ? "Update" : "Create"}</Button>
                </Form>
            </Modal>
        </div>
    );
};

export default CampaignManager;
