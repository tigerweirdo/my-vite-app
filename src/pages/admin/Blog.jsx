import { useEffect, useState, useCallback } from 'react';
import { Button, Space, Table, message, Modal, Form, Input, Typography } from 'antd';




const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { Text } = Typography;
  const [contentModalVisible, setContentModalVisible] = useState(false);
  const [editableContent, setEditableContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/blog`);
      if (!response.ok) {
        throw new Error('Failed to fetch blogs');
      }
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleEdit = (blog) => {
    setCurrentBlog(blog);
    setIsModalOpen(true);
  };
  const showContentModal = (content) => {
    setEditableContent(content);
    setContentModalVisible(true);
  };
  const saveContentChanges = () => {
    // Burada güncellenen içeriği kaydetmek için bir API çağrısı yapılabilir
    setContentModalVisible(false);
  };
    

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/api/blog/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete blog');
      }
      message.success('Blog deleted successfully');
      fetchBlogs();
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

      if (!response.ok) {
        throw new Error(`Failed to ${currentBlog ? 'update' : 'add'} blog`);
      }
      message.success(`Blog ${currentBlog ? 'updated' : 'added'} successfully`);
      setIsModalOpen(false);
      fetchBlogs();
    } catch (error) {
      message.error(error.message);
    }
  };

  const truncateText = (text, length) => text.length > length ? `${text.substring(0, length)}...` : text;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Tarih bilinmiyor" : date.toLocaleDateString();
  };
  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value); // Kullanıcının girdiği URL'yi imageUrl state'ine kaydet
  };
  const renderImagePreview = () => {
    if (imageUrl) {
      return <img src={imageUrl} alt="Blog Preview" style={{ maxWidth: '100%', maxHeight: 300 }} />;
    }
    return null;
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl) => imageUrl ? <img src={imageUrl} alt="Blog" style={{ width: 100, height: 'auto' }} /> : 'No image',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title) => <Text>{truncateText(title, 50)}</Text>,
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
      render: (_, record) => <Button onClick={() => showContentModal(record.content)}>View Content</Button>,
    },
    {
      title: 'Oluşturulma Tarihi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => <Text>{formatDate(createdAt)}</Text>,
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
      <Table dataSource={blogs} columns={columns} rowKey="_id" loading={loading} />
      <Modal
        title={`${currentBlog ? 'Edit' : 'Add'} Blog`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={1000}
      >
        <Form
  key={currentBlog ? currentBlog._id : 'new'} // Her düzenleme için unique key
  initialValues={currentBlog || { title: '', content: '', imageUrl: '' }}
  onFinish={handleFormSubmit}
  layout="vertical"
><Form.Item name="imageUrl" label="Image URL">
            <Input value={imageUrl} onChange={handleImageUrlChange} />
          </Form.Item>
          {renderImagePreview()}
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="content" label="Content" rules={[{ required: true }]}>
            <Input.TextArea rows={11} />
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
          onChange={(e) => setEditableContent(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default BlogPage;
