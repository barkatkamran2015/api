import React, { useState, useEffect } from 'react';
import { firestore } from '../Admin/firebaseConfig';
import { collection, query, where, getDocs, orderBy, doc, updateDoc, increment, addDoc, arrayUnion } from 'firebase/firestore';
import '../Home.css';
import SearchBar from '../components/SearchBar';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import imageBlog from '../assets/blog.jpg';
import imagePizza from '../assets/top-pizza.jpg';
import imageRecipe from '../assets/recipe.jpg';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState({ name: '', email: '', comment: '', rating: 0 });
  const [userModal, setUserModal] = useState({ open: false, action: null, postId: null, position: { top: 0, left: 0 } });

  // Fetch posts and comments from Firestore
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const q = query(
          collection(firestore, 'posts'),
          orderBy('timestamp', 'desc'),
          where('timestamp', '>=', sixMonthsAgo)
        );

        const querySnapshot = await getDocs(q);
        const postsArray = [];

        for (let docSnap of querySnapshot.docs) {
          const postData = docSnap.data();
          const postId = docSnap.id;

          // Increment view count when post is viewed
          const postRef = doc(firestore, 'posts', postId);
          await updateDoc(postRef, {
            viewCount: increment(1),
          });

          // Fetch comments for this post
          const commentsRef = collection(firestore, 'posts', postId, 'comments');
          const commentsSnapshot = await getDocs(commentsRef);
          const comments = commentsSnapshot.docs.map((doc) => doc.data()) || [];

          postsArray.push({
            id: postId,
            ...postData,
            comments: comments,
          });
        }

        if (postsArray.length === 0) {
          setError('No posts found from the last 6 months.');
        } else {
          setPosts(postsArray);
          setFilteredPosts(postsArray);
        }
      } catch (err) {
        setError('Failed to load posts. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Handle search functionality
  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const results = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowerCaseQuery) ||
        (post.content && post.content.toLowerCase().includes(lowerCaseQuery))
    );
    setFilteredPosts(results);
  };

  // Open modal for rating
  const ratePost = (postId, event) => {
    const position = { top: event.clientY + window.scrollY, left: event.clientX + window.scrollX };
    setUserModal({ open: true, action: 'rate', postId, position });
  };

  // Open modal for comment
  const addCommentPrompt = (postId, event) => {
    const position = { top: event.clientY + window.scrollY, left: event.clientX + window.scrollX };
    setUserModal({ open: true, action: 'comment', postId, position });
  };

  // Handle form submission for rating or commenting
  const handleSubmit = async () => {
    if (!userInfo.name || !userInfo.email) {
      alert('Please enter your name and email.');
      return;
    }

    if (userModal.action === 'rate') {
      try {
        const postRef = doc(firestore, 'posts', userModal.postId);
        await updateDoc(postRef, {
          ratings: arrayUnion(userInfo.rating),
        });
        alert('Thanks for your rating!');
      } catch (error) {
        console.error('Error rating post:', error);
        alert('Failed to submit rating. Try again.');
      }
    } else if (userModal.action === 'comment') {
      try {
        const commentRef = collection(firestore, 'posts', userModal.postId, 'comments');
        await addDoc(commentRef, {
          content: userInfo.comment,
          user: userInfo.name,
          email: userInfo.email,
          timestamp: new Date(),
        });
        alert('Comment posted successfully!');
        setUserInfo({ ...userInfo, comment: '' });
      } catch (error) {
        console.error('Failed to post comment:', error);
        alert('Failed to post comment. Try again.');
      }
    }

    setUserModal({ open: false, action: null, postId: null, position: { top: 0, left: 0 } });
  };

  // Handle rating change
  const handleRatingChange = (rating) => {
    setUserInfo({ ...userInfo, rating });
  };

  // Calculate average rating
  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const totalRating = ratings.reduce((acc, rating) => acc + rating, 0);
    return totalRating / ratings.length;
  };

  return (
    <div className="home">
      {loading ? (
        <div className="loading-spinner">
          <p>Loading...</p>
        </div>
      ) : (
        <>
          {/* Modal for User Info */}
          {userModal.open && (
            <div
              className="user-info-modal"
              style={{
                top: userModal.position.top + 10,
                left: userModal.position.left + 10,
                position: 'absolute',
              }}
            >
              <div className="modal-content">
                <h3>{userModal.action === 'rate' ? 'Rate this Post' : 'Comment on this Post'}</h3>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                />
                {userModal.action === 'rate' && (
                  <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={userInfo.rating >= star ? 'star filled' : 'star'}
                        onClick={() => handleRatingChange(star)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                )}
                {userModal.action === 'comment' && (
                  <textarea
                    placeholder="Write your comment"
                    value={userInfo.comment}
                    onChange={(e) => setUserInfo({ ...userInfo, comment: e.target.value })}
                  />
                )}
                <button onClick={handleSubmit}>Submit</button>
                <button onClick={() => setUserModal({ open: false, action: null, postId: null, position: { top: 0, left: 0 } })}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Featured Content */}
          <Slider className="featured-slider" autoplay dots>
            <div>
              <img src={imageBlog} alt="Blog" />
              <h3>Best Blog You Trust</h3>
            </div>
            <div>
              <img src={imagePizza} alt="Pizza" />
              <h3>Homemade Pizza</h3>
            </div>
            <div>
              <img src={imageRecipe} alt="Recipe" />
              <h3>Healthy Recipe Idea</h3>
            </div>
          </Slider>

          {/* Search */}
          <SearchBar onSearch={handleSearch} placeholder="Search for recipes, reviews, and more..." />

          {/* Posts */}
          {error && <p>{error}</p>}
          {filteredPosts.length === 0 ? (
            <p>No posts available</p>
          ) : (
            filteredPosts.map((post) => {
              const averageRating = calculateAverageRating(post.ratings);

              return (
                <div key={post.id} className="post-item">
                  <h2>{post.title}</h2>
                  <p dangerouslySetInnerHTML={{ __html: post.content }} />
                  {post.imageURL && <img src={post.imageURL} alt={post.title} />}
                  <div className="post-actions">
                    <div className="rating-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={averageRating >= star ? 'star filled' : 'star'}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <button className="cta-button" onClick={(e) => ratePost(post.id, e)}>
                      Rate this Post
                    </button>
                    <button className="cta-button" onClick={(e) => addCommentPrompt(post.id, e)}>
                      Add a Comment
                    </button>
                  </div>
                  <div className="comments-section">
                    <h3>Comments</h3>
                    <ul>
                      {post.comments && post.comments.length > 0 ? (
                        post.comments.map((comment, index) => (
                          <li key={index}>
                            <strong>{comment.user}:</strong> {comment.content}
                          </li>
                        ))
                      ) : (
                        <li>No comments yet</li>
                      )}
                    </ul>
                  </div>
                  <div className="view-count">
                    <p>Viewed {post.viewCount || 0} times</p>
                  </div>
                </div>
              );
            })
          )}
        </>
      )}
    </div>
  );
};

export default Home;
