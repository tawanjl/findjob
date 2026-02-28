import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/axios';
import { useAuthStore } from '../store/authStore';

interface Comment {
    id: number;
    content: string;
    createdAt: string;
    user: { id: number; firstName: string; lastName: string; email: string };
}

interface Post {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    userId: number;
    user: { id: number; firstName: string; lastName: string; email: string };
    comments: Comment[];
}

export const PostDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const fetchPost = () => {
        api.get(`/community/posts/${id}`)
            .then(res => setPost(res.data))
            .catch(() => navigate('/community'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchPost(); }, [id]);

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        setSubmitting(true);
        try {
            await api.post(`/community/posts/${id}/comments`, { content: commentText });
            setCommentText('');
            fetchPost();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeletePost = async () => {
        if (!confirm('Delete this post?')) return;
        await api.delete(`/community/posts/${id}`);
        navigate('/community');
    };

    const handleDeleteComment = async (commentId: number) => {
        if (!confirm('Delete this comment?')) return;
        await api.delete(`/community/comments/${commentId}`);
        fetchPost();
    };

    const getDisplayName = (u: Post['user'] | undefined) => {
        if (!u) return 'Anonymous';
        const name = [u.firstName, u.lastName].filter(Boolean).join(' ');
        return name || u.email;
    };

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto space-y-4">
                <div className="bg-gray-50 rounded-2xl h-48 animate-pulse" />
                <div className="bg-gray-50 rounded-2xl h-24 animate-pulse" />
            </div>
        );
    }

    if (!post) return null;

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Back */}
            <Link to="/community" className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1">
                ← Back to Community
            </Link>

            {/* Post */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900">{post.title}</h1>
                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                            <span>👤 {getDisplayName(post.user)}</span>
                            <span>🕒 {new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    {user && user.id === post.userId && (
                        <button
                            onClick={handleDeletePost}
                            className="text-red-400 hover:text-red-600 text-sm font-medium transition-colors"
                        >
                            Delete post
                        </button>
                    )}
                </div>
                <p className="mt-6 text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
            </div>

            {/* Comments */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">💬 Comments ({post.comments.length})</h2>

                {post.comments.length === 0 ? (
                    <p className="text-gray-400 text-sm">No comments yet. Be the first!</p>
                ) : (
                    post.comments.map(comment => (
                        <div key={comment.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex justify-between items-start gap-4">
                            <div>
                                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                                    <span className="font-semibold text-gray-600">{getDisplayName(comment.user)}</span>
                                    <span>· {new Date(comment.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
                            </div>
                            {user && user.id === comment.user?.id && (
                                <button
                                    onClick={() => handleDeleteComment(comment.id)}
                                    className="text-gray-300 hover:text-red-500 transition-colors shrink-0 mt-1"
                                    title="Delete comment"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Comment Form */}
            {user ? (
                <form onSubmit={handleAddComment} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
                    <h3 className="font-semibold text-gray-800">Leave a comment</h3>
                    <textarea
                        placeholder="Write your comment..."
                        rows={3}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none resize-none"
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                    />
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting || !commentText.trim()}
                            className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
                        >
                            {submitting ? 'Posting...' : 'Comment'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-center text-sm text-gray-500">
                    <Link to="/login" className="text-primary-600 font-medium hover:underline">Sign in</Link> to leave a comment.
                </div>
            )}
        </div>
    );
};
