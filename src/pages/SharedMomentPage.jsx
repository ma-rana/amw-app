import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { ArrowLeft, Home, Loader2 } from 'lucide-react';

const SharedMomentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [moment, setMoment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const m = await API.getMoment(id);
        if (!m) {
          setError('Moment not found');
        }
        // Enforce public visibility for shared links
        if (m && (m.visibility === 'PUBLIC' || m.isPublic === true)) {
          setMoment(m);
        } else {
          setMoment(null);
          setError('This moment is not publicly viewable.');
        }
      } catch (e) {
        console.error('Error loading moment', e);
        setError('Failed to load moment');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8 max-w-md w-full text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading moment...</p>
        </div>
      </div>
    );
  }

  if (error || !moment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Moment Not Available</h2>
          <p className="text-gray-600 mb-6">{error || 'This moment is not publicly viewable.'}</p>
          <Link to="/">
            <button className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg">
              Go Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = moment?.media?.imageUrl || moment?.imageUrl;
  const videoUrl = moment?.media?.videoUrl || moment?.videoUrl;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>

        {/* Moment Card */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
          <div className="p-6 md:p-8 space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {moment.title || 'Untitled Moment'}
              </h1>
              {moment.description && (
                <p className="text-gray-600 text-base leading-relaxed">
                  {moment.description}
                </p>
              )}
            </div>

            {/* Media */}
            {imageUrl && (
              <div className="rounded-xl overflow-hidden border-2 border-gray-200">
                <img 
                  src={imageUrl} 
                  alt={moment.title} 
                  className="w-full h-auto object-contain"
                />
              </div>
            )}
            
            {videoUrl && (
              <div className="rounded-xl overflow-hidden border-2 border-gray-200">
                <video 
                  src={videoUrl} 
                  controls 
                  className="w-full h-auto"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            {/* Metadata */}
            {moment.createdAt && (
              <div className="pt-4 border-t-2 border-gray-200">
                <p className="text-sm text-gray-500">
                  Shared on {new Date(moment.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-6 text-center">
          <Link to="/">
            <button className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg">
              <Home className="w-5 h-5" />
              <span>Visit A Moment With</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SharedMomentPage;
