import { useEffect, useState } from 'react';

import { message, Tabs, Table, Space, Button, Layout, Menu } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Content, Header } from 'antd/es/layout/layout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { TabPane } = Tabs;

const AllPosts = () => {
    const nav = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [dataPublished, setDataPublished] = useState([]);
    const [dataDrafts, setDataDrafts] = useState([]);
    const [dataTrashed, setDataTrashed] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const fetchArticle = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get('http://localhost:9000/article/100/0');
            if (res.status !== 200) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const draftArticles = res.data.data.filter((e: any) => e.status.toLowerCase() === 'draft');
            setDataDrafts(draftArticles);

            const publishedArticles = res.data.data.filter((e: any) => e.status.toLowerCase() === 'publish');
            setDataPublished(publishedArticles);

            const trashedArticles = res.data.data.filter((e: any) => e.status.toLowerCase() === 'thrash');
            setDataTrashed(trashedArticles);
        } catch (error) {
            console.error('Error during fetchArticle:', error);
            messageApi.open({
                type: 'error',
                content: 'An error occurred, please try again',
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchArticle();
    }, []);

    const handleTrash = async (record: any) => {
        try {
            record.status = 'thrash';
            let res = await axios.put('http://localhost:9000/article/' + record.id, record);

            if (res.status !== 200) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            messageApi.open({
                type: 'success',
                content: 'Successfully moved to thrash',
            });
            fetchArticle();
        } catch (error) {
            console.log(error);
            messageApi.open({
                type: 'error',
                content: 'An error occurred, please try again',
            });
        }
    };

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            width: '60%',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text: any, record: any) => (
                <Space size="middle">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => {
                            console.log(record);
                            nav('/edit', { state: record });
                        }}
                    />
                    <Button type="link" icon={<DeleteOutlined />} onClick={() => handleTrash(record)} />
                </Space>
            ),
        },
    ];

    const items = [
        {
            key: '1',
            label: 'Home',
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
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} items={items} style={{ margin: 'auto', minWidth: 0 }} />
                </Header>
                <div style={{ width: '70%', margin: 'auto', height: '100vh' }}>
                    <Content style={{ padding: '0 48px' }}>
                        <Tabs defaultActiveKey="1" centered>
                            <TabPane tab="Published" key="1">
                                <Table loading={isLoading} columns={columns} dataSource={dataPublished} />
                            </TabPane>
                            <TabPane tab="Drafts" key="2">
                                <Table loading={isLoading} columns={columns} dataSource={dataDrafts} />
                            </TabPane>
                            <TabPane tab="Trashed" key="3">
                                <Table loading={isLoading} columns={columns} dataSource={dataTrashed} />
                            </TabPane>
                        </Tabs>
                    </Content>
                </div>
            </Layout>
        </>
    );
};

export default AllPosts;
