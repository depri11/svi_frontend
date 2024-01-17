import React, { useEffect } from 'react';
import { Form, Input, message, Button, Layout, Menu } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { useLocation, useNavigate } from 'react-router-dom';
import TextArea from 'antd/es/input/TextArea';
import axios from 'axios';

const EditPost = () => {
    const nav = useNavigate();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const location = useLocation();
    const dataState = location.state;

    useEffect(() => {
        if (dataState === null) {
            nav('/');
        }
        form.setFieldsValue(dataState);
    }, []);

    const updateArticle = async (status: string) => {
        try {
            await form.validateFields();

            let body = dataState;

            body.title = form.getFieldValue('title');
            body.content = form.getFieldValue('content');
            body.category = form.getFieldValue('category');
            body.status = status;

            let response = await axios.put('http://localhost:9000/article/' + body.id, body);

            form.resetFields();

            messageApi.open({
                type: 'success',
                content: 'Article has been updated',
            });

            return response;
        } catch (error) {
            console.log(error);
            messageApi.open({
                type: 'error',
                content: 'An error occurred, please try again',
            });
        }
    };

    const items = [
        {
            key: '1',
            label: 'Home',
            onClick: () => {
                nav('/');
            },
        },
        {
            key: '2',
            label: 'Add New',
            onClick: () => {
                nav('/add');
            },
        },
        {
            key: '3',
            label: 'Preview',
            onClick: () => {
                nav('/preview');
            },
        },
    ];

    return (
        <>
            {contextHolder}
            <Layout style={{ minHeight: '100hv' }}>
                <Header style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="demo-logo" />
                    <Menu theme="dark" mode="horizontal" items={items} style={{ margin: 'auto', minWidth: 0 }} />
                </Header>
                <div style={{ width: '70%', margin: 'auto', display: 'flex', justifyContent: 'center', marginTop: '30px', height: '100vh' }}>
                    <Form form={form} name="basic" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} style={{ minWidth: 600 }} autoComplete="off">
                        <Form.Item
                            label="Title"
                            name="title"
                            rules={[
                                { required: true, message: 'Please input Title!' },
                                { min: 20, message: 'Title must be at least 20 characters long' },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Content"
                            name="content"
                            rules={[
                                { required: true, message: 'Please input your Content!' },
                                { min: 200, message: 'Content must be at least 200 characters long' },
                            ]}
                        >
                            <TextArea style={{ height: '100px' }} />
                        </Form.Item>

                        <Form.Item
                            label="Category"
                            name="category"
                            rules={[
                                { required: true, message: 'Please input your Category!' },
                                { min: 3, message: 'Category must be at least 3 characters long' },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button type="primary" htmlType="submit" onClick={() => updateArticle('publish')}>
                                Publish
                            </Button>
                            <Button type="default" htmlType="submit" onClick={() => updateArticle('draft')} style={{ marginLeft: '10px' }}>
                                Draft
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Layout>
        </>
    );
};

export default EditPost;
