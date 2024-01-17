import React, { useEffect, useState } from 'react';
import { message, Card, Layout, Menu, Pagination } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Preview = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [publishedArticles, setPublishedArticles] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(1);

    const fetchArticle = async () => {
        try {
            const res = await axios.get(`http://localhost:9000/article/${pageSize}/${(currentPage - 1) * pageSize}`);

            if (res.status !== 200) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            const publishedArticles = res.data.data.filter((e: any) => e.status.toLowerCase() === 'publish');
            setPublishedArticles(publishedArticles);
            setTotalPages(res.data.total);
            return res.data;
        } catch (error) {
            console.error('Error during fetchArticle:', error);
            messageApi.open({
                type: 'error',
                content: 'An error occurred, please try again',
            });
        }
    };

    useEffect(() => {
        fetchArticle();
    }, [currentPage]);

    let nav = useNavigate();

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
        },
    ];

    return (
        <>
            {contextHolder}
            <Layout style={{ minHeight: '100hv' }}>
                <Header style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="demo-logo" />
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['3']} items={items} style={{ margin: 'auto', minWidth: 0 }} />
                </Header>
                <div style={{ width: '50%', margin: 'auto', marginTop: '30px', height: '100vh' }}>
                    {publishedArticles.map((article: any, index) => (
                        <Card key={index} title={article.title} style={{ marginBottom: '20px' }}>
                            <p>{article.content}</p>
                            <p>Category: {article.category}</p>
                        </Card>
                    ))}
                    {publishedArticles.length > 0 && <Pagination current={currentPage} pageSize={pageSize} total={totalPages} onChange={setCurrentPage} />}
                </div>
            </Layout>
        </>
    );
};

export default Preview;
