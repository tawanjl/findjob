import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/axios';
import { useAuthStore } from '../store/authStore';

interface Post {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    user: { id: number; firstName: string; lastName: string; email: string };
    comments: { id: number }[];
}

export const Community = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { user } = useAuthStore();

    const fetchPosts = () => {
        api.get('/community/posts')
            .then(res => setPosts(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchPosts(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;
        setSubmitting(true);
        try {
            await api.post('/community/posts', { title, content });
            setTitle('');
            setContent('');
            fetchPosts();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to create post');
        } finally {
            setSubmitting(false);
        }
    };

    const getDisplayName = (post: Post) => {
        const name = [post.user?.firstName, post.user?.lastName].filter(Boolean).join(' ');
        return name || post.user?.email || 'Anonymous';
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900">ชุมชน</h1>
                <p className="text-gray-500 mt-1">แชร์ไอเดีย เคล็ดลับ และข้อมูลเชิงลึกกับเพื่อนผู้หางานและนายจ้าง</p>
            </div>

            {/* Create Post Form */}
            {user ? (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                    <h2 className="font-bold text-gray-800">สร้างโพสต์</h2>
                    <input
                        type="text"
                        placeholder="หัวข้อ"
                        className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        maxLength={150}
                    />
                    <textarea
                        placeholder="หางาน ที่ใช่ หรือ จ้างงาน ที่ใช่ โพสต์ที่นี่"
                        rows={4}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none resize-none"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                    />
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting || !title.trim() || !content.trim()}
                            className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
                        >
                            {submitting ? 'กำลังโพสต์...' : 'โพสต์'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
                    <p className="text-gray-600">
                        <Link to="/login" className="text-primary-600 font-medium hover:underline">เข้าสู่ระบบ</Link> เพื่อสร้างโพสต์และเข้าร่วมการสนทนา
                    </p>
                </div>
            )}

            {/* Post List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(n => <div key={n} className="bg-gray-50 rounded-2xl h-28 animate-pulse" />)}
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center text-gray-500 py-16">ยังไม่มีโพสต์. มาเป็นคนแรกที่แชร์อะไรบางอย่างกันเถอะ! </div>
            ) : (
                <div className="space-y-4">
                    {posts.map(post => (
                        <Link key={post.id} to={`/community/${post.id}`} className="block group">
                            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-gray-200 transition-all">
                                <h2 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{post.title}</h2>
                                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{post.content}</p>
                                <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
                                    <span> {getDisplayName(post)}</span>
                                    <span> {post.comments?.length ?? 0} ความคิดเห็น</span>
                                    <span> {new Date(post.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};
