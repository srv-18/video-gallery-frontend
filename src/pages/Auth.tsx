import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/authStore';
import { Label } from '@/components/ui/label';
import axios from 'axios';

const Auth = () => {
    const navigate = useNavigate();
    const { setUser, setToken, setLoading } = useAuthStore();
    const [isSignIn, setIsSignIn] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: ''
    });
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
  
      try {
        let response;
        if(isSignIn) {
          response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/signin`, {
              "email": formData.email,
              "password": formData.password
            }, {
              withCredentials: true
            }
          );
          const token = response.data.token;
          localStorage.setItem('jwt', token);
        } else {
          response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/signup`, {
              "name": formData.name,
              "email": formData.email,
              "password": formData.password
            }, {
              withCredentials: true
            }
          );
        }
        
        const user = {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          userVideos: response.data.user.userVideos
        };
        
        setUser(user);
        setToken(response.data.token || "");
        
        navigate('/dashboard');
      } catch (error) {
        alert("Invalid Credentials")
        navigate('/auth');
      } finally {
        setLoading(false);
      }
    };
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.value
      }));
    };
  
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/')}
            className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </motion.button>
  
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-lg shadow-xl p-8"
          >
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
            </div>
  
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">
                {isSignIn ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-gray-400">
                {isSignIn ? 'Sign in to your account' : 'Start your journey with us'}
              </p>
            </div>
  
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {!isSignIn && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Label htmlFor="name" className="text-white">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      required={!isSignIn}
                      className="bg-gray-700 border-gray-600 text-white mt-1"
                      placeholder="Enter your full name"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
  
              <div>
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="bg-gray-700 border-gray-600 text-white mt-1"
                  placeholder="Enter your email"
                />
              </div>
  
              <div>
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-700 border-gray-600 text-white pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
  
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                {isSignIn ? 'Sign In' : 'Sign Up'}
              </Button>
            </form>
  
            {/* Toggle Auth Mode */}
            <div className="text-center mt-6">
              <p className="text-gray-400">
                {isSignIn ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => setIsSignIn(!isSignIn)}
                  className="text-purple-400 hover:text-purple-300 ml-1 font-medium"
                >
                  {isSignIn ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };
  
  export default Auth;