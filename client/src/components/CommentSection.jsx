import { Alert, Button, Modal, Textarea } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate = useNavigate();

  // Fetch comments on mount or postId change
  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        if (!res.ok) throw new Error('Failed to fetch comments');
        const data = await res.json();
        if (data.success && Array.isArray(data.comments)) {
          const normalized = data.comments.map((c) => ({
            ...c,
            likes: Array.isArray(c.likes) ? c.likes : [],
          }));
          setComments(normalized);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchComments();
  }, [postId]);

  // Add new comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) return;

    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch('/api/comment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to post comment');

      // Add new comment to top of list
      setComments((prev) => [
        {
          ...data,
          likes: Array.isArray(data.likes) ? data.likes : [],
        },
        ...prev,
      ]);
      setComment('');
      setCommentError(null);
    } catch (err) {
      setCommentError(err.message);
    }
  };

  // Toggle like/unlike for a comment
  const handleLike = async (commentId, action) => {
    try {
      if (!currentUser) {
        navigate('/login');
        return;
      }

      // Call backend API to update like based on action type
      // The backend should handle adding/removing user ID from likes array
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }), // send 'increment' or 'decrement'
      });

      if (res.ok) {
        const data = await res.json();
        const likes = Array.isArray(data.likes) ? data.likes : [];
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                ...comment,
                likes: likes,
                numberOfLikes: likes.length,
              }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  // Edit comment content locally (You may want to sync with backend here)
  const handleEdit = (commentId, editedContent) => {
    setComments((prev) =>
      prev.map((c) => (c._id === commentId ? { ...c, content: editedContent } : c))
    );
  };

  // Delete comment
  const handleDelete = async (commentId) => {
    setShowModal(false);
    if (!currentUser) {
      navigate('/login');
      return;
    }
    try {
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete comment');
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt={currentUser.username}
          />
          <Link
            to={'/dashboard?tab=profile'}
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to comment.
          <Link className="text-blue-500 hover:underline" to={'/login'}>
            Sign In
          </Link>
        </div>
      )}

      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            placeholder="Add a comment..."
            rows={3}
            maxLength={200}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">{200 - comment.length} characters remaining</p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}

      {comments.length === 0 ? (
        <p className="text-sm my-5">No comments yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment
              key={comment._id} // ✅ Add this line
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => handleDelete(commentToDelete)}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
