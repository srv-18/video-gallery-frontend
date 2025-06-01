import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, User, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useVideoStore } from '../store/videoStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ReactPlayer from 'react-player';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { videos, setVideos, setLoading } = useVideoStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/video/`
        );

        setVideos(response.data);
      } catch (error) {
        alert("Error while loading videos")
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setVideos]);

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">V</span>
              </div>
              <h1 className="text-xl font-bold">VideoStream</h1>
            </motion.div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/dashboard')}
                    className="text-white hover:bg-gray-700"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => navigate('/auth')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-6">Trending Videos</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {filteredVideos.map((video, index) => (
              <div className='bg-gray-800 rounded-lg hover:shadow-xl cursor-pointer w-150'>
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ReactPlayer url={video.videoUrl} controls={true} width={600}/>
                  <div className="pt-2 pb-2 pl-5">
                    <h2 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                      {video.title}
                    </h2>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                      {video.description}
                    </p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>

          {filteredVideos.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No videos found matching "{searchQuery}"</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Home;