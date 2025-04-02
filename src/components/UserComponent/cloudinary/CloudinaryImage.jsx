import React, { useState, useEffect } from 'react';
import axiosInstance from '@/api/User/axios';

const CloudinaryImage = ({ publicId, transformations = {} }) => {
  const [signedUrl, setSignedUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSignedUrl = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.post('/users/generate-signed-url', {
          publicId,
          transformations
        });
        setSignedUrl(response.data.signedUrl);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch signed URL:', err);
        setError('Failed to load image. Please try again later.');
        setLoading(false);
      }
    };

    if (publicId) {
      fetchSignedUrl();
    }
  }, [publicId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!signedUrl) return <div>No image available</div>;

  return <img src={signedUrl} alt="Protected content" className="w-32 h-32 rounded-full object-cover border-4 border-gray-200" />;
};

export default CloudinaryImage;