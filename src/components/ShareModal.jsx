import React, { useState, useEffect } from 'react';
import { X, Copy, Share2, MessageCircle, Mail, RefreshCw, Users, Lock, Unlock } from 'lucide-react';
import sharingService from '../services/sharingService';
import { useResponsive } from '../hooks/useResponsive';

const ShareModal = ({ 
  isOpen, 
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
    if (shareType === 'moment' && moment?.id) {
      const url = sharingService.generateMomentShareUrl(moment.id);
      setShareUrl(url);
      setQrUrl(sharingService.generateQrCodeUrl(url));
    } else if (story && story.inviteCode) {
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

  // Render modal only when invoked by parent condition
  if (!shareType && !story) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className={`relative bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden ${
          isMobile ? 'w-full max-w-sm max-h-[90vh]' : 'w-full max-w-lg max-h-[85vh]'
        } overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
        
        {/* Header */}
        <div className="relative flex items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Share {shareType === 'moment' ? 'Moment' : 'Story'}
            </h2>
          </div>
          <button 
            className="group p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all duration-200"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        {/* Story/Moment Info */}
        <div className="relative flex items-start space-x-4 p-6 border-b border-slate-700/30">
          {(story?.imageUrl) && (
            <div className="flex-shrink-0">
              <img 
                src={story.imageUrl} 
                alt={shareType === 'moment' ? momentTitle : (story?.title || 'Story')}
                className="w-20 h-20 rounded-2xl object-cover border border-slate-600/50"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white mb-2 truncate">
              {shareType === 'moment' ? (momentTitle || 'Moment') : (story?.title || 'Story')}
            </h3>
            {shareType === 'moment' && story?.title && (
              <p className="text-sm text-slate-400 italic mb-3">From story: {story.title}</p>
            )}
            {story && (
              <div className="flex items-center space-x-4 text-sm text-slate-400">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{story.userIds?.length || 0} members</span>
                </div>
                {story.locked ? (
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <Lock className="w-4 h-4" />
                    <span>Private</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-green-400">
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
          <div className={`relative mx-6 mt-4 p-3 rounded-xl border ${
            messageType === 'success' 
              ? 'bg-green-500/10 border-green-500/30 text-green-400' 
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            {message}
          </div>
        )}

        {/* Invite Code Section - only for story sharing */}
        {shareType === 'story' && story?.inviteCode && (
          <div className="relative p-6 space-y-4">
            <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Copy className="w-3 h-3 text-white" />
              </div>
              <span>Invite Code</span>
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-slate-800/50 border border-slate-600/50 rounded-xl p-3 font-mono text-blue-300 text-center text-lg tracking-wider">
                  {story.inviteCode}
                </div>
                <button 
                  className="group p-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-blue-200 border border-blue-500/30 hover:border-blue-500/50 rounded-xl transition-all duration-200"
                  onClick={copyInviteCode}
                  disabled={isLoading}
                  title="Copy invite code"
                >
                  <Copy className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                </button>
              </div>
              
              {userRole === 'owner' && (
                <button 
                  className="group w-full flex items-center justify-center space-x-2 p-3 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white border border-slate-600/50 hover:border-slate-500/50 rounded-xl transition-all duration-200"
                  onClick={handleRegenerateInviteCode}
                  disabled={isRegenerating}
                  title="Regenerate invite code"
                >
                  <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-200`} />
                  <span>{isRegenerating ? 'Regenerating...' : 'Regenerate Code'}</span>
                </button>
              )}
            </div>
            
            <p className="text-sm text-slate-400 text-center">
              Share this code with others so they can join your story
            </p>
          </div>
        )}

        {/* Share Link Section */}
        <div className="relative p-6 pt-0 space-y-4 border-b border-slate-700/30">
          <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Share2 className="w-3 h-3 text-white" />
            </div>
            <span>Share Link</span>
          </h4>
          
          <div className="flex items-center space-x-2">
            <input 
              type="text" 
              value={shareUrl} 
              readOnly 
              className="flex-1 bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-slate-300 text-sm focus:outline-none focus:border-green-500/50 transition-colors duration-200"
            />
            <button 
              className="group p-3 bg-green-600/20 hover:bg-green-600/30 text-green-300 hover:text-green-200 border border-green-500/30 hover:border-green-500/50 rounded-xl transition-all duration-200"
              onClick={() => handleShare('copy')}
              disabled={isLoading}
              title="Copy link"
            >
              <Copy className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="relative p-6 pt-4 space-y-4 border-b border-slate-700/30">
          <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg flex items-center justify-center">
              <Share2 className="w-3 h-3 text-white" />
            </div>
            <span>QR Code</span>
          </h4>
          <div className="flex items-center justify-center">
            {qrUrl && (
              <img src={qrUrl} alt="Share QR Code" className="rounded-xl border border-slate-600/50" />
            )}
          </div>
          <div className="flex items-center justify-center">
            {qrUrl && (
              <a
                className="btn btn-outline"
                href={qrUrl}
                download={`amw-${shareType}-qr.png`}
              >
                Download QR
              </a>
            )}
          </div>
        </div>

        {/* Social Sharing Buttons */}
        <div className="relative p-6 space-y-4">
          <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Share2 className="w-3 h-3 text-white" />
            </div>
            <span>Share via</span>
          </h4>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              className="group flex items-center justify-center space-x-2 p-3 bg-green-600/20 hover:bg-green-600/30 text-green-300 hover:text-green-200 border border-green-500/30 hover:border-green-500/50 rounded-xl transition-all duration-200"
              onClick={() => handleShare('whatsapp')}
              disabled={isLoading}
            >
              <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-sm font-medium">WhatsApp</span>
            </button>
            
            <button 
              className="group flex items-center justify-center space-x-2 p-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-blue-200 border border-blue-500/30 hover:border-blue-500/50 rounded-xl transition-all duration-200"
              onClick={() => handleShare('facebook')}
              disabled={isLoading}
            >
              <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-sm font-medium">Facebook</span>
            </button>
            
            <button 
              className="group flex items-center justify-center space-x-2 p-3 bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 hover:text-sky-200 border border-sky-500/30 hover:border-sky-500/50 rounded-xl transition-all duration-200"
              onClick={() => handleShare('twitter')}
              disabled={isLoading}
            >
              <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-sm font-medium">Twitter</span>
            </button>
            
            <button 
              className="group flex items-center justify-center space-x-2 p-3 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 hover:text-purple-200 border border-purple-500/30 hover:border-purple-500/50 rounded-xl transition-all duration-200"
              onClick={() => handleShare('email')}
              disabled={isLoading}
            >
              <Mail className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-sm font-medium">Email</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="relative p-6 pt-4 border-t border-slate-700/30">
          <button 
            className="w-full group flex items-center justify-center space-x-2 p-3 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white border border-slate-600/50 hover:border-slate-500/50 rounded-xl transition-all duration-200"
            onClick={onClose}
          >
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            <span className="font-medium">Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
