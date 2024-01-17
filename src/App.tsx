import { Routes, Route } from 'react-router-dom';
import AllPosts from './page/AllPosts';
import AddNew from './page/AddNew';
import Preview from './page/Preview';
import EditPost from './page/EditPost';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<AllPosts />} />
            <Route path="add" element={<AddNew />} />
            <Route path="preview" element={<Preview />} />
            <Route path="edit" element={<EditPost />} />
        </Routes>
    );
};

export default App;
