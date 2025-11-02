import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Copy, Share2, MessageCircle, Mail, X, QrCode, ArrowLeft } from 'lucide-react';
import sharingService from '../services/sharingService';

const ShareDropdown = ({ 
  onClose, 
  story, 
  moment,
  shareType = 'story',
  momentTitle = '',
  buttonRef
}) => {
  const [shareUrl, setShareUrl] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showQROnly, setShowQROnly] = useState(false);
  const dropdownRef = useRef(null);

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

  useEffect(() => {
    // Position dropdown next to button using fixed positioning
    const positionDropdown = () => {
      if (buttonRef?.current && dropdownRef?.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const dropdown = dropdownRef.current;
        
        // For fixed positioning, use getBoundingClientRect values directly
        let top = buttonRect.bottom + 8;
        let left = buttonRect.left;
        
        // Check if dropdown would go off screen and adjust
        const dropdownWidth = 320;
        const dropdownHeight = 250;
        
        if (left + dropdownWidth > window.innerWidth) {
          left = window.innerWidth - dropdownWidth - 10;
        }
        
        // Account for bottom navigation (70px) and top nav (56px) on mobile
        const bottomNavHeight = window.innerWidth < 1024 ? 70 : 0;
        const topNavHeight = window.innerWidth < 1024 ? 56 : 0;
        
        if (top + dropdownHeight > window.innerHeight - bottomNavHeight - 20) {
          // Position above button if it would go under bottom nav
          top = buttonRect.top - dropdownHeight - 8;
          // If that goes above screen, adjust to stay visible
          if (top < topNavHeight + 10) {
            top = Math.max(topNavHeight + 10, buttonRect.bottom + 8);
            dropdown.style.maxHeight = `${window.innerHeight - top - bottomNavHeight - 20}px`;
          }
        }
        
        // Ensure minimum distance from edges
        if (left < 10) left = 10;
        if (top < topNavHeight + 10) top = topNavHeight + 10;
        
        dropdown.style.position = 'fixed';
        dropdown.style.top = `${top}px`;
        dropdown.style.left = `${left}px`;
        dropdown.style.zIndex = '10001'; // Above bottom nav
      }
    };

    // Small delay to ensure DOM is ready
    setTimeout(positionDropdown, 0);
    
    const handleScroll = () => positionDropdown();
    const handleResize = () => positionDropdown();

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    // Close on outside click
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    // Use setTimeout to avoid immediate close on click
    setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);
    
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [buttonRef, onClose]);

  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 2000);
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      showMessage('Link copied!', 'success');
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showMessage('Link copied!', 'success');
    }
  };

  const handleShare = async (method) => {
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
    }
  };

  const handleMouseLeave = (e) => {
    // Check if we're moving to the button
    const relatedTarget = e.relatedTarget;
    
    // Don't close if moving to button
    if (
      buttonRef.current &&
      relatedTarget &&
      (buttonRef.current.contains(relatedTarget) || buttonRef.current === relatedTarget)
    ) {
      return;
    }
    
    // Small delay to allow moving cursor back into dropdown or button
    setTimeout(() => {
      const isOverDropdown = dropdownRef.current && (
        dropdownRef.current.matches(':hover') ||
        (relatedTarget && dropdownRef.current.contains(relatedTarget))
      );
      
      const isOverButton = buttonRef.current && (
        buttonRef.current.matches(':hover') ||
        (relatedTarget && buttonRef.current.contains(relatedTarget))
      );
      
      if (!isOverDropdown && !isOverButton) {
        onClose();
      }
    }, 300);
  };

  // Render dropdown in portal to avoid z-index and overflow issues
  if (typeof document === 'undefined') return null;

  const dropdownContent = (
    <div 
      ref={dropdownRef}
      className="bg-white rounded-xl border-2 border-gray-200 shadow-2xl min-w-[280px] max-w-[320px]"
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'fixed',
        zIndex: 10001, // Above bottom nav (z-50)
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b-2 border-gray-200">
        <div className="flex items-center space-x-2">
          {showQROnly && (
            <button
              className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors mr-1"
              onClick={() => setShowQROnly(false)}
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            {showQROnly ? (
              <QrCode className="w-3 h-3 text-white" />
            ) : (
              <Share2 className="w-3 h-3 text-white" />
            )}
          </div>
          <span className="text-sm font-semibold text-gray-900">
            {showQROnly ? 'QR Code' : 'Share'}
          </span>
        </div>
        <button 
          className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`mx-3 mt-2 p-2 rounded-lg text-xs font-medium ${
          messageType === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {showQROnly ? (
        /* QR Code Only View */
        <div className="p-4 space-y-4">
          {qrUrl ? (
            <>
              <div className="flex items-center justify-center p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                <img src={qrUrl} alt="Share QR Code" className="rounded-lg max-w-full" />
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-2">
                  Scan this QR code to share this {shareType === 'moment' ? 'moment' : 'story'}
                </p>
                <button
                  className="inline-flex items-center space-x-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-all"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = qrUrl;
                    link.download = `amw-${shareType}-qr.png`;
                    link.click();
                  }}
                >
                  <Copy className="w-3 h-3" />
                  <span>Download QR</span>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">Generating QR code...</p>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Share Link Section - At Top */}
          {shareUrl && (
            <div className="p-3 space-y-2 border-b-2 border-gray-200">
              <div className="flex items-start space-x-2">
                <div className="flex-1 min-w-0">
                  <input 
                    type="text" 
                    value={shareUrl} 
                    readOnly 
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-900 focus:outline-none focus:border-blue-500 transition-all text-xs break-all"
                    style={{ 
                      fontSize: '10px',
                      lineHeight: '1.4',
                      wordBreak: 'break-all',
                      overflowWrap: 'break-word'
                    }}
                  />
                </div>
                <button 
                  className="p-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all flex-shrink-0"
                  onClick={handleCopyLink}
                  title="Copy link"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Social Sharing Buttons */}
          <div className="p-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button 
                className="flex items-center justify-center space-x-1.5 p-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-all border border-green-200 hover:border-green-300"
                onClick={() => handleShare('whatsapp')}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs font-medium">WhatsApp</span>
              </button>
              
              <button 
                className="flex items-center justify-center space-x-1.5 p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-all border border-blue-200 hover:border-blue-300"
                onClick={() => handleShare('facebook')}
              >
                <Share2 className="w-4 h-4" />
                <span className="text-xs font-medium">Facebook</span>
              </button>
              
              <button 
                className="flex items-center justify-center space-x-1.5 p-2 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg transition-all border border-sky-200 hover:border-sky-300"
                onClick={() => handleShare('twitter')}
              >
                <Share2 className="w-4 h-4" />
                <span className="text-xs font-medium">Twitter</span>
              </button>
              
              <button 
                className="flex items-center justify-center space-x-1.5 p-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-all border border-purple-200 hover:border-purple-300"
                onClick={() => setShowQROnly(true)}
              >
                <QrCode className="w-4 h-4" />
                <span className="text-xs font-medium">QR Code</span>
              </button>
            </div>
            
            {/* Email button - Full width */}
            <button 
              className="w-full flex items-center justify-center space-x-1.5 p-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-all border border-gray-200 hover:border-gray-300"
              onClick={() => handleShare('email')}
            >
              <Mail className="w-4 h-4" />
              <span className="text-xs font-medium">Email</span>
            </button>
          </div>
        </>
      )}
    </div>
  );

  return createPortal(dropdownContent, document.body);
};

export default ShareDropdown;

