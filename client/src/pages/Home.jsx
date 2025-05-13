import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import { PlayCircle } from "lucide-react";
import { FaYoutube } from "react-icons/fa";

export default function Home({ videoId = "dQw4w9WgXcQ" }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/getPosts');
        const data = await res.json();
        setPosts(data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <header className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-60 z-10" />
        <img
          src="https://media-hosting.imagekit.io//9270575bd5b14e90/bg.jpg?Expires=1833779484&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=P6bdFeJdOslj6DEKpByJManmzqifeD0wHxeTBiJSrFWQ3TEHxfSRMWcVzG49kWcyQrduBKBan6xXt-F5Zp3T5syca33-lWLF5ssmO6kH9WzrebYnnU6LzDgdoljR6jpNHqJS1jXOERW7lwPPKVXhsUGHtiS~VRjm-l~OJTyKTag5jZwGhcVYMGKP0DsrhRLT8SI8xVhWjzUOFy3xxKQdbxuDL3gkbhZnICEbFfDvVtsa~EVuQpjCIVQBvGcBZ5l5L-9L6yhCt~XsZjJ8Sp~F9xvzQU3110z5e1cIO1T0ADv~vX3iXHRJRS0I4KNZsEqvVxbrr4NS~c6QWzchm2WkgA__"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Background"
          loading="lazy"
        />
        <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col justify-center h-full text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Welcome to Swagatom World LLP
          </h1>
          <p className="text-lg md:text-xl text-gray-300 lg:text-gray-300 mb-8">
            Discover a new way of learning that combines fun, creativity, and practical skills with our Navarasa-9.
          </p>
          <a href="#programs">
            <button className="bg-yellow-500 text-black px-8 py-3 rounded-full font-semibold hover:bg-yellow-400 transition">
              Know More
            </button>
          </a>
        </div>
      </header>

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
        {loading ? (
          <div className='flex flex-wrap gap-4'>
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className="w-72 h-40 bg-gray-300 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className='flex flex-wrap gap-4'>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
            <Link to={'/search'} className='text-lg text-teal-500 hover:underline text-center w-full'>
              View all posts
            </Link>
          </div>
        ) : (
          <p className='text-center text-gray-400'>No posts available</p>
        )}
      </div>

      <div className='p-3 bg-amber-100 dark:bg-slate-700'>
        <CallToAction />
      </div>

      <section className="animate-on-scroll py-10 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-white flex items-center justify-center gap-2">
            <FaYoutube size={40} color="red" />Watch Our Camp in Action
          </h2>

          <div className="relative aspect-video w-full max-w-3xl mx-auto rounded-lg shadow-lg overflow-hidden">
            {!isPlaying ? (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/60 cursor-pointer"
                onClick={() => setIsPlaying(true)}
              >
                <PlayCircle className="text-white" size={80} />
              </div>
            ) : (
              <iframe
                className="w-full h-full rounded-lg"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&cc_load_policy=1`}
                title="Camp Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            )}
            {!isPlaying && (
              <img
                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                alt="YouTube Thumbnail"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
