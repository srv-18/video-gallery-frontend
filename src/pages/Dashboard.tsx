import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Upload, Video, LogOut, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/store/authStore';
import { useVideoStore } from '@/store/videoStore';
import ReactPlayer from 'react-player';
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { userVideos, setUserVideos, addVideo, updateVideo, deleteVideo, setLoading } = useVideoStore();
    const [activeTab, setActiveTab] = useState('videos');
    const [isEditing, setIsEditing] = useState(false);
    const [editingVideo, setEditingVideo] = useState<any>(null);
    const [userData, setUserData] = useState({
      name: user?.name || '',
      email: user?.email || ''
    });
    const [videoForm, setVideoForm] = useState({
      title: '',
      description: '',
      thumbnail: null as File | null,
      videoFile: null as File | null
    });
  
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('jwt');
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/video`,
                    {
                        headers: { 
                            Authorization: token
                        },
                        withCredentials: true,
                    }
                );
                setUserVideos(response.data);
            } catch (error) {
                alert(`Error: ${error}`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [setUserVideos, user?.id]);
  
    const handleLogout = () => {
      logout();
      navigate('/');
    };
  
    const handleVideoUpload = async (e: React.FormEvent) => {
        e.preventDefault();

        const form = new FormData();
        form.append('title', videoForm.title);
        form.append('description', videoForm.description);
        if (videoForm.thumbnail && videoForm.videoFile) {
            form.append('image', videoForm.thumbnail);
            form.append('video', videoForm.videoFile);
        }

        try {
            const token = localStorage.getItem('jwt');
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/video/upload`,
                form,
                {
                    headers: { 
                        "Content-Type": "multipart/form-data",
                        Authorization: token
                    },
                    withCredentials: true,
                }
            );            

            if (response.data && response.data.video) {
                const newVideo = {
                    id: response.data.video.id,
                    title: response.data.video.title,
                    description: response.data.video.description,
                    thumbnail: response.data.video.thumbnail,
                    videoUrl: response.data.video.videoUrl,
                    userId: response.data.video.userId
                };

                addVideo(newVideo);
                setVideoForm({ title: '', description: '', thumbnail: null, videoFile: null });
                setActiveTab('videos');
                alert('Video uploaded successfully!');
            } else {
                alert('Error while uploading');
            }
        } catch (error) {
            alert(`Error: ${error}` || 'Failed to upload video try again');
        }
    };

    const handleUpdateVideo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingVideo) return;
    
        try {
            const token = localStorage.getItem('jwt');
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/video/${editingVideo.id}`,
                {
                    title: videoForm.title,
                    description: videoForm.description,
                    thumbnail: videoForm.thumbnail || editingVideo.thumbnail
                },
                {
                    headers: { 
                        Authorization: token
                    },
                    withCredentials: true,
                }
            );

            if (response.data) {
                updateVideo(editingVideo.id, {
                    title: videoForm.title,
                    description: videoForm.description,
                    thumbnail: videoForm.thumbnail || editingVideo.thumbnail
                });
                setIsEditing(false);
                setEditingVideo(null);
                setVideoForm({ title: '', description: '', thumbnail: null, videoFile: null });
                setActiveTab('videos');
                alert('Video updated successfully!');
            }
        } catch (error) {
            alert(`Error updating video: ${error}`);
        }
    };

    const handleEditVideo = (video: any) => {
        setEditingVideo(video);
        setVideoForm({
          title: video.title,
          description: video.description,
          thumbnail: video.thumbnail,
          videoFile: null
        });
        setIsEditing(true);
        setActiveTab("upload");
    };
  
    const handleDeleteVideo = async (id: string) => {
        try {
            const token = localStorage.getItem('jwt');
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/video/${id}`,
                {
                    headers: { 
                        Authorization: token
                    },
                    withCredentials: true,
                }
            );
            deleteVideo(id);
            alert('Video deleted successfully!');
        } catch (error) {
            alert(`Error deleting video: ${error}`);
        }
    };
  
    const handleUpdateUser = async () => {
        try {
            const token = localStorage.getItem('jwt');
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/user`,
                { name: userData.name },
                {
                    headers: { 
                        Authorization: token
                    },
                    withCredentials: true,
                }
            );

            if (response.data) {
                // Update the user in the authStore
                if (user) {
                    const updatedUser = { ...user, name: userData.name };
                    useAuthStore.setState({ user: updatedUser });
                    alert('Name updated successfully!');
                }
            }
        } catch (error) {
            alert(`Error updating name: ${error}`);
        }
    };
  
    const sidebarItems = [
      { id: 'videos', label: 'Videos', icon: Video },
      { id: 'upload', label: 'Upload Videos', icon: Upload },
      { id: 'account', label: 'Account', icon: User },
    ];
  
    return (
    <div className="min-h-screen bg-gray-900 text-white flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 p-6">
            <div className="flex items-center space-x-2 mb-8">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">V</span>
                </div>
                <h1 className="text-lg font-bold">VideoStream</h1>
            </div>
    
            <div className="flex items-center space-x-3 mb-8 p-3 bg-gray-700 rounded-lg">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">{user?.name?.charAt(0)}</span>
                </div>
                <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
            </div>
    
            <nav className="space-y-2">
                {sidebarItems.map((item) => (
                <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeTab === item.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
                >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                </button>
                ))}
            </nav>
    
            <div className="absolute w-50 bottom-10">
                <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:bg-gray-700"
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                </Button>
            </div>
        </div>
  
        {/* Main Content */}
        <div className="flex-1 p-8">
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >

                {activeTab === 'videos' && (
                <div>
                    <h2 className="text-3xl font-bold mb-8">Your Videos</h2>
                    {userVideos.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {userVideos.map((video) => (
                        <div className='bg-gray-800 rounded-lg hover:shadow-xl cursor-pointer w-150'>
                            <ReactPlayer url={video.videoUrl} controls={true} width={600}/>
                            <div className="pt-2 pl-5">
                                <h2 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                                {video.title}
                                </h2>
                                <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                                {video.description}
                                </p>
                            </div>
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={() => handleEditVideo(video)}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteVideo(video.id)}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-3 rounded transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        ))}
                    </div>
                    ) : (
                    <div className="text-center py-12">
                        <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No videos uploaded yet</p>
                        <Button
                        onClick={() => setActiveTab('upload')}
                        className="mt-4 bg-purple-600 hover:bg-purple-700"
                        >
                            Upload Your First Video
                        </Button>
                    </div>
                    )}
                </div>
                )}
    
                {activeTab === 'account' && (
                <div>
                    <h2 className="text-3xl font-bold mb-8">Account Details</h2>
                    <div className="max-w-md space-y-4">
                        <div>
                            <Label htmlFor="username" className="text-white">Name</Label>
                            <div className="flex mt-1">
                                <Input
                                id="username"
                                value={userData.name}
                                onChange={(e) => setUserData({...userData, name: e.target.value})}
                                className="bg-gray-800 border-gray-600 text-white"
                                />
                                <Button 
                                    onClick={handleUpdateUser}
                                    className="ml-2 bg-purple-600 hover:bg-purple-700"
                                >
                                    <Edit className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <div>
                        <Label htmlFor="email" className="text-white">Email</Label>
                        <Input
                            id="email"
                            value={userData.email}
                            readOnly
                            className="bg-gray-700 border-gray-600 text-gray-400 mt-1"
                        />
                        </div>
                    </div>
                </div>
                )}
    
                {activeTab === 'upload' && (
                <div>
                    <h2 className="text-3xl font-bold mb-8">Upload Videos</h2>
                    <div className="max-w-md">
                    <form onSubmit={isEditing ? handleUpdateVideo : handleVideoUpload} className="space-y-4">
                        <div>
                        <Label htmlFor="title" className="text-white">Title</Label>
                        <Input
                            id="title"
                            value={videoForm.title}
                            onChange={(e) => setVideoForm({...videoForm, title: e.target.value})}
                            required
                            className="bg-gray-800 border-gray-600 text-white mt-1"
                            placeholder="Enter video title"
                        />
                        </div>
                        <div>
                        <Label htmlFor="description" className="text-white">Description</Label>
                        <Textarea
                            id="description"
                            value={videoForm.description}
                            onChange={(e) => setVideoForm({...videoForm, description: e.target.value})}
                            required
                            className="bg-gray-800 border-gray-600 text-white mt-1"
                            placeholder="Enter video description"
                            rows={3}
                        />
                        </div>
                        <div>
                        <Label htmlFor="thumbnail" className="text-white">Thumbnail</Label>
                        <Input
                            id="thumbnail"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setVideoForm({...videoForm, thumbnail: e.target.files?.[0] || null})}
                            className="bg-gray-600 border-gray-600 text-white mt-1"
                        />
                        </div>
                        <div>
                        <Label htmlFor="video" className="text-white">Video File</Label>
                        <Input
                            id="video"
                            type="file"
                            accept="video/*"
                            onChange={(e) => setVideoForm({...videoForm, videoFile: e.target.files?.[0] || null})}
                            className="bg-gray-600 border-gray-600 text-white mt-1"
                        />
                        </div>
                        <div className="flex gap-2">
                        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                            {isEditing ? 'Update Video' : 'Upload Video'}
                        </Button>
                        {isEditing && (
                            <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setIsEditing(false);
                                setEditingVideo(null);
                                setVideoForm({ title: '', description: '', thumbnail: null, videoFile: null });
                            }}
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                                Cancel
                            </Button>
                        )}
                        </div>
                    </form>
                    </div>
                </div>
                )}
            </motion.div>
        </div>
    </div>
    );
  };
  
  export default Dashboard;  