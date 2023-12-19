import { useEffect, useState } from 'react';
import { Button, Space, Table, message, Modal, Form, Input ,Typography} from 'antd';
import { useCallback } from 'react';

const BlogPage = () => {
  const [blog, setblog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { Text } = Typography;
  const [contentModalVisible, setContentModalVisible] = useState(false);
  const [editableContent, setEditableContent] = useState('');

  const truncateText = (text, length) => {
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };
  const showContentModal = (content) => {
    setEditableContent(content);
    setContentModalVisible(true);
  };

  const saveContentChanges = () => {
    // Logic to save the updated content
    // You can call handleFormSubmit or a similar function here
    setContentModalVisible(false);
    // Refresh the blogs list if needed
  };
  const fetchblog = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/blog`);
      if (response.ok) {
        const data = await response.json();
        setblog(data);
      } else {
        throw new Error('Failed to fetch blog');
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchblog();
  }, [fetchblog]);

  const handleEdit = (blog) => {
    setCurrentBlog(blog);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/api/blog/${id}`, { method: 'DELETE' });
      if (response.ok) {
        message.success('Blog deleted successfully');
        fetchblog();
      } else {
        throw new Error('Failed to delete blog');
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleFormSubmit = async (values) => {
    const method = currentBlog ? 'PUT' : 'POST';
    const endpoint = currentBlog ? `${apiUrl}/api/blog/${currentBlog._id}` : `${apiUrl}/api/blog`;

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success(`Blog ${currentBlog ? 'updated' : 'added'} successfully`);
        setIsModalOpen(false);
        fetchblog();
      } else {
        throw new Error(`Failed to ${currentBlog ? 'update' : 'add'} blog`);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const columns = [
    {
        title: 'Image',
        dataIndex: 'imageUrl',
        key: 'imageUrl',
        render: (imageUrl) => (
          imageUrl ? <img src={imageUrl} alt="Blog" style={{ width: 100, height: 'auto' }} /> : 'No image'
        ),
      },  
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        render: title => <Text>{truncateText(title, 50)}</Text>, // Truncate long titles
      },
      {
        title: 'Content',
        dataIndex: 'content',
        key: 'content',
        render: (_, record) => (
          <Button onClick={() => showContentModal(record.content)}>View Content</Button>
        ),
      },
      {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record._id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <>
    <Button type="primary" onClick={() => { setCurrentBlog(null); setIsModalOpen(true); }}>
      Add New Blog
    </Button>
    <Table dataSource={blog} columns={columns} rowKey="_id" loading={loading} />
    <Modal
      title={`${currentBlog ? 'Edit' : 'Add'} Blog`}
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
      width={1000}

    >
      <Form
        initialValues={currentBlog || { title: '', content: '', imageUrl: '' }} // Added imageUrl to initialValues
        onFinish={handleFormSubmit}
        layout="vertical"
      >
        <Form.Item name="imageUrl" label="Image URL" rules ={[{ required: true }]}> 
          <Input />
        </Form.Item>
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="content" label="Content" rules={[{ required: true }]}>
          <Input.TextArea 
          rows={11} />
        </Form.Item>
        
        <Button type="primary" htmlType="submit">
          {currentBlog ? 'Update' : 'Add'} Blog
        </Button>
      </Form>
    </Modal>
    <Modal
        title="Edit Blog Content"
        open={contentModalVisible}
        onCancel={() => setContentModalVisible(false)}
        onOk={saveContentChanges}
        okText="Save"
        width={1000}

      >
        <Input.TextArea 
          rows={21} 
          value={editableContent} 
          onChange={e => setEditableContent(e.target.value)}
        
        />
      </Modal>
  </>
);
};


export default BlogPage;
