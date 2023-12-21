import { useEffect, useState, useCallback } from 'react';
import { Button, Card, Col, Row, Modal, Form, Input, message, Space } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState({ title: '', content: '', imageUrl: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const fetchBlogs = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/api/blog`);
      if (!response.ok) {
        throw new Error('Failed to fetch blogs');
      }
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      message.error(error.message);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleEdit = (blog) => {
    setCurrentBlog({ ...blog, imageUrl: blog.imageUrl || defaultImageUrl });
    setIsModalOpen(true);
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

  const validateForm = () => {
    if (!currentBlog.title.trim()) {
      message.error("Title is required");
      return false;
    }
    if (!currentBlog.content.trim()) {
      message.error("Content is required");
      return false;
    }
    return true;
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const method = currentBlog._id ? 'PUT' : 'POST';
    const endpoint = currentBlog._id ? `${apiUrl}/api/blog/${currentBlog._id}` : `${apiUrl}/api/blog`;

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentBlog),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${currentBlog._id ? 'update' : 'add'} blog`);
      }
      message.success(`Blog ${currentBlog._id ? 'updated' : 'added'} successfully`);
      setIsModalOpen(false);
      fetchBlogs();
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleInputChange = e => {
    setCurrentBlog({ ...currentBlog, [e.target.name]: e.target.value });
  };

  const handleEditorChange = (content) => {
    setCurrentBlog({ ...currentBlog, content: content });
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const truncateText = (text, length = 700) => {
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };
  const toggleExpanded = (id) => {
    if (expandedId === id) {
      setExpandedId(null); // Collapse if it's already expanded
    } else {
      setExpandedId(id); // Expand the clicked one
    }
  };
  const defaultImageUrl = 'https://i.pinimg.com/originals/cb/3d/fc/cb3dfcc4a38c5f240486eefd0cc935fc.jpg';

  // Modal açıldığında ve imageUrl boş olduğunda default değeri ata
  useEffect(() => {
    if (isModalOpen && !currentBlog.imageUrl) {
      setCurrentBlog({ ...currentBlog, imageUrl: defaultImageUrl });
    }
  }, [isModalOpen, currentBlog, setCurrentBlog]);

  // handleEdit fonksiyonunu düzenle
 
  return (
    <>
      <Space style={{ marginBottom: 20 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleEdit({ title: '', content: '', imageUrl: '' })}>Add Blog</Button>
        <Input placeholder="Search blogs" prefix={<SearchOutlined />} onChange={e => setSearchTerm(e.target.value)} />
      </Space>
      <Row gutter={[10, 10]}>
        {filteredBlogs.map(blog => (
          <Col span={12} key={blog._id}>
            <Card
              actions={[
                <EditOutlined key="edit" onClick={() => handleEdit(blog)} />,
                <DeleteOutlined key="delete" onClick={() => handleDelete(blog._id)} />
              ]}
            >
            <Card.Meta
  title={blog.title}
  description={
    <div>
      <div
        dangerouslySetInnerHTML={{
          __html: expandedId === blog._id ? blog.content : truncateText(blog.content)
        }}
      />
      {blog.content.length > 1000 && (
        <Button type="link" onClick={() => toggleExpanded(blog._id)}>
          {expandedId === blog._id ? 'Read Less' : 'Read More'}
        </Button>
      )}
    </div>
  }
/>
          </Card>
          </Col>
        ))}
      </Row>
      <Modal
        title={`${currentBlog._id ? 'Edit' : 'Add'} Blog`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={1000}
      >
        <Form
          key={currentBlog._id ? currentBlog._id : 'new'}
          initialValues={currentBlog}
          onFinish={handleFormSubmit}
          layout="vertical"
        >
          <Form.Item name="imageUrl" label="imageUrl" rules={[{ required: true }]}>
            <Input name="imageUrl" value={currentBlog.imageUrl} onChange={handleInputChange} 
             placeholder="https://images.pexels.com/photos/1193743/pexels-photo-1193743.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
          </Form.Item>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input name="title" value={currentBlog.title} onChange={handleInputChange} />
          </Form.Item>
          <Form.Item name="content" label="Content" rules={[{ required: true }]}>
            <Editor
              apiKey='b7qyuoavbecq0fgj7chnq1dbk51eg8yuz99ui7662jio6pgv'
              init={{
                plugins: 'mentions anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed permanentpen footnotes advtemplate advtable advcode editimage tableofcontents mergetags powerpaste tinymcespellchecker autocorrect a11ychecker typography inlinecss',
                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
              }}
              value={currentBlog.content}
              onEditorChange={handleEditorChange}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            {currentBlog._id ? 'Update' : 'Add'} Blog
          </Button>
        </Form>
      </Modal>

    </>

  );
};

export default BlogPage;
