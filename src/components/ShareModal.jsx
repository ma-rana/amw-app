import React, { useState, useEffect } from 'react';
import { X, Copy, Share2, MessageCircle, Mail, RefreshCw, Users, Lock, Unlock, Download } from 'lucide-react';
import sharingService from '../services/sharingService';
import { useResponsive } from '../hooks/useResponsive';

const ShareModal = ({ 
  onClose, 
  story, 
  moment,
  onInviteCodeRegenerated,
  userRole = 'member',
  shareType = 'story',
  momentTitle = ''
}) => {
  const [shareUrl, setShareUrl] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [isRegenerating, setIsRegenerating] = useState(false);
  const { isMobile } = useResponsive();

  useEffect(() => {
    // Generate share URL for moments
    if (shareType === 'moment' && moment?.id) {
      const url = sharingService.generateMomentShareUrl(moment.id);
      setShareUrl(url);
      setQrUrl(sharingService.generateQrCodeUrl(url));
    } else if (moment?.id) {
      // Fallback: if we have a moment ID but shareType isn't set correctly
      const url = sharingService.generateMomentShareUrl(moment.id);
      setShareUrl(url);
      setQrUrl(sharingService.generateQrCodeUrl(url));
    } else if (story && story.inviteCode) {
      // Generate share URL for stories
      const url = sharingService.generateShareableUrl(story.inviteCode);
      setShareUrl(url);
      setQrUrl(sharingService.generateQrCodeUrl(url));
    }
  }, [story, moment, shareType]);

  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    
    setIsLoading(true);
    try {
      await navigator.clipboard.writeText(shareUrl);
      showMessage('Link copied to clipboard!', 'success');
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showMessage('Link copied to clipboard!', 'success');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async (method) => {
    setIsLoading(true);
    try {
      const result = shareType === 'moment'
        ? await sharingService.shareMoment(moment, method)
        : await sharingService.shareStory(story, method);
      if (result.success) {
        showMessage(result.message, 'success');
      } else {
        showMessage(result.message, 'error');
      }
    } catch {
      showMessage('Failed to share', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateInviteCode = async () => {
    if (!story || userRole !== 'owner') return;
    
    setIsRegenerating(true);
    try {
      const updatedStory = await sharingService.regenerateInviteCode(story.id);
      const newUrl = sharingService.generateShareableUrl(updatedStory.inviteCode);
      setShareUrl(newUrl);
      showMessage('Invite code regenerated successfully!', 'success');
      
      if (onInviteCodeRegenerated) {
        onInviteCodeRegenerated(updatedStory);
      }
    } catch {
      showMessage('Failed to regenerate invite code', 'error');
    } finally {
      setIsRegenerating(false);
    }
  };

  const copyInviteCode = async () => {
    if (!story?.inviteCode) return;
    
    try {
      await navigator.clipboard.writeText(story.inviteCode);
      showMessage('Invite code copied to clipboard!', 'success');
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = story.inviteCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showMessage('Invite code copied to clipboard!', 'success');
    }
  };

  // Render modal - parent component handles conditional rendering

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div 
        className={`relative bg-white rounded-2xl border-2 border-gray-200 shadow-2xl overflow-hidden ${
          isMobile ? 'w-full max-w-sm max-h-[90vh]' : 'w-full max-w-lg max-h-[85vh]'
        } overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b-2 border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Share {shareType === 'moment' ? 'Moment' : 'Story'}
            </h2>
          </div>
          <button 
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Story/Moment Info */}
        <div className="flex items-start space-x-4 p-4 md:p-6 border-b-2 border-gray-200 bg-white">
          {(story?.imageUrl || moment?.media?.imageUrl || moment?.imageUrl) && (
            <div className="flex-shrink-0">
              <img 
                src={story?.imageUrl || moment?.media?.imageUrl || moment?.imageUrl} 
                alt={shareType === 'moment' ? momentTitle : (story?.title || 'Story')}
                className="w-20 h-20 rounded-xl object-cover border-2 border-gray-200"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
              {shareType === 'moment' ? (momentTitle || 'Moment') : (story?.title || 'Story')}
            </h3>
            {shareType === 'moment' && story?.title && (
              <p className="text-sm text-gray-500 mb-2">From story: {story.title}</p>
            )}
            {story && (
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{story.userIds?.length || 0} members</span>
                </div>
                {story.locked ? (
                  <div className="flex items-center space-x-1 text-amber-600">
                    <Lock className="w-4 h-4" />
                    <span>Private</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-green-600">
                    <Unlock className="w-4 h-4" />
                    <span>Open</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mx-4 md:mx-6 mt-4 p-3 rounded-xl border-2 ${
            messageType === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}

        {/* Invite Code Section - only for story sharing */}
        {shareType === 'story' && story?.inviteCode && (
          <div className="p-4 md:p-6 space-y-4 border-b-2 border-gray-200 bg-white">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Copy className="w-3 h-3 text-white" />
              </div>
              <span>Invite Code</span>
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-xl p-3 font-mono text-gray-900 text-center text-lg tracking-wider font-semibold">
                  {story.inviteCode}
                </div>
                <button 
                  className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 border-2 border-blue-600 hover:border-blue-700"
                  onClick={copyInviteCode}
                  disabled={isLoading}
                  title="Copy invite code"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
              
              {userRole === 'owner' && (
                <button 
                  className="w-full flex items-center justify-center space-x-2 p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 border-2 border-gray-200 hover:border-gray-300 font-medium"
                  onClick={handleRegenerateInviteCode}
                  disabled={isRegenerating}
                  title="Regenerate invite code"
                >
                  <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                  <span>{isRegenerating ? 'Regenerating...' : 'Regenerate Code'}</span>
                </button>
              )}
            </div>
            
            <p className="text-sm text-gray-600 text-center">
              Share this code with others so they can join your story
            </p>
          </div>
        )}

        {/* Share Link Section - Always show for moments */}
        {shareType === 'moment' && (
          <div className="p-4 md:p-6 space-y-4 border-b-2 border-gray-200 bg-white">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <Share2 className="w-3 h-3 text-white" />
              </div>
              <span>Share Link</span>
            </h4>
            
            {shareUrl ? (
              <div className="flex items-center space-x-2">
                <input 
                  type="text" 
                  value={shareUrl} 
                  readOnly 
                  className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="Generating share link..."
                />
                <button 
                  className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-200 border-2 border-green-600 hover:border-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleCopyLink}
                  disabled={isLoading || !shareUrl}
                  title="Copy link"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center p-4 bg-gray-50 border-2 border-gray-200 rounded-xl">
                <p className="text-sm text-gray-500">Generating share link...</p>
              </div>
            )}
          </div>
        )}

        {/* Share Link Section - For stories (if invite code exists) */}
        {shareType === 'story' && shareUrl && (
          <div className="p-4 md:p-6 space-y-4 border-b-2 border-gray-200 bg-white">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <Share2 className="w-3 h-3 text-white" />
              </div>
              <span>Share Link</span>
            </h4>
            
            <div className="flex items-center space-x-2">
              <input 
                type="text" 
                value={shareUrl} 
                readOnly 
                className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
              <button 
                className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-200 border-2 border-green-600 hover:border-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleCopyLink}
                disabled={isLoading || !shareUrl}
                title="Copy link"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* QR Code Section */}
        {qrUrl && (
          <div className="p-4 md:p-6 space-y-4 border-b-2 border-gray-200 bg-white">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Share2 className="w-3 h-3 text-white" />
              </div>
              <span>QR Code</span>
            </h4>
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center justify-center p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                <img src={qrUrl} alt="Share QR Code" className="rounded-lg" />
              </div>
              <a
                href={qrUrl}
                download={`amw-${shareType}-qr.png`}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 border-2 border-gray-200 hover:border-gray-300 font-medium"
              >
                <Download className="w-4 h-4" />
                <span>Download QR</span>
              </a>
            </div>
          </div>
        )}

        {/* Social Sharing Buttons */}
        <div className="p-4 md:p-6 space-y-4 bg-white">
          <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Share2 className="w-3 h-3 text-white" />
            </div>
            <span>Share via</span>
          </h4>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              className="flex items-center justify-center space-x-2 p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl transition-all duration-200 border-2 border-green-200 hover:border-green-300 font-medium"
              onClick={() => handleShare('whatsapp')}
              disabled={isLoading}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">WhatsApp</span>
            </button>
            
            <button 
              className="flex items-center justify-center space-x-2 p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-all duration-200 border-2 border-blue-200 hover:border-blue-300 font-medium"
              onClick={() => handleShare('facebook')}
              disabled={isLoading}
            >
              <Share2 className="w-5 h-5" />
              <span className="text-sm">Facebook</span>
            </button>
            
            <button 
              className="flex items-center justify-center space-x-2 p-3 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-xl transition-all duration-200 border-2 border-sky-200 hover:border-sky-300 font-medium"
              onClick={() => handleShare('twitter')}
              disabled={isLoading}
            >
              <Share2 className="w-5 h-5" />
              <span className="text-sm">Twitter</span>
            </button>
            
            <button 
              className="flex items-center justify-center space-x-2 p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl transition-all duration-200 border-2 border-purple-200 hover:border-purple-300 font-medium"
              onClick={() => handleShare('email')}
              disabled={isLoading}
            >
              <Mail className="w-5 h-5" />
              <span className="text-sm">Email</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 pt-4 border-t-2 border-gray-200 bg-gray-50">
          <button 
            className="w-full flex items-center justify-center space-x-2 p-3 bg-white hover:bg-gray-50 text-gray-700 rounded-xl transition-all duration-200 border-2 border-gray-200 hover:border-gray-300 font-medium"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
