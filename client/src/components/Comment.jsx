import moment from 'moment';
import { useEffect, useState, useRef } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react';
import io from 'socket.io-client';

// Connect socket outside the component
const socket = io('https://swagatom-backend.onrender.com'); // Replace with your backend URL

export default function Comment({ comment, onLike, onEdit, onDelete }) {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [likes, setLikes] = useState(comment.numberOfLikes ?? comment.likes?.length ?? 0);

  const { currentUser } = useSelector((state) => state.user);
  const liked = comment.likes?.includes(currentUser?._id);
  const clickTimeout = useRef(null);

  useEffect(() => {
    if (comment.user) {
      setUser(comment.user);
    } else if (comment.userId) {
      const getUser = async () => {
        try {
          const res = await fetch(`/api/user/${comment.userId}`);
          const data = await res.json();
          if (res.ok && data?.user?.username) {
            setUser(data.user);
          }
        } catch (error) {
          console.error('Error fetching user:', error.message);
        }
      };
      getUser();
    }
  }, [comment]);

  // Real-time likes via socket
  useEffect(() => {
    const handleLikeUpdate = ({ commentId, numberOfLikes }) => {
      if (commentId === comment._id) {
        setLikes(numberOfLikes);
      }
    };

    socket.on('commentLiked', handleLikeUpdate);
    return () => socket.off('commentLiked', handleLikeUpdate);
  }, [comment._id]);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSaveClick = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editedContent }),
      });
      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.error('Edit failed:', error.message);
    }
  };

  const handleLikeClick = () => {
    if (!currentUser) return;

    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
      onLike(comment._id, 'decrement');
    } else {
      clickTimeout.current = setTimeout(() => {
        onLike(comment._id, 'increment');
        clickTimeout.current = null;
      }, 250);
    }
  };

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={
            user.profilePicture ||
            'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
          }
          alt={user.username || 'Anonymous'}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user.username ? `@${user.username}` : 'anonymous user'}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>

        {isEditing ? (
          <>
            <Textarea
              className="mb-2"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={3}
              maxLength={200}
            />
            <div className="flex gap-3">
              <Button size="xs" onClick={handleSaveClick}>
                Save
              </Button>
              <Button
                color="gray"
                size="xs"
                onClick={() => {
                  setIsEditing(false);
                  setEditedContent(comment.content);
                }}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <p className="mb-2 whitespace-pre-wrap">{comment.content}</p>
        )}

        <div className="flex items-center gap-3 text-xs">
          <Button
            size="xs"
            onClick={handleLikeClick}
            color={liked ? 'purple' : 'gray'}
            outline
            pill
            aria-pressed={liked}
            aria-label={liked ? 'Unlike comment' : 'Like comment'}
            title="Click once to like, double click to unlike"
          >
            <FaThumbsUp className="mr-1 text-sm" />
            {likes}
          </Button>

          {currentUser?._id === comment.userId && !isEditing && (
            <>
              <Button size="xs" onClick={handleEditClick} color="blue" outline pill>
                Edit
              </Button>
              <Button
                size="xs"
                onClick={() => onDelete(comment._id)}
                color="red"
                outline
                pill
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
