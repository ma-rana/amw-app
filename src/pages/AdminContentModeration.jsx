import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Card, 
  Heading, 
  Text, 
  TextField, 
  SelectField, 
  Badge, 
  Flex, 
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
  Alert
} from '@aws-amplify/ui-react';
import CustomModal from '../components/CustomModal';
import { 
  Search, 
  Filter, 
  Flag, 
  Eye, 
  Trash2, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Image,
  FileText,
  Users,
  Calendar,
  MoreVertical
} from 'lucide-react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { useNotifications } from '../contexts/NotificationContext';


const AdminContentModeration = ({ onNavigate: _onNavigate }) => {
  const { 
    hasAdminPermission, 
    ADMIN_PERMISSIONS
  } = useAdminAuth();
  const { addNotification } = useNotifications();

  // Local admin function since it's no longer in useAdminAuth
  const deleteContent = async (contentId, contentType) => {
    try {
      console.log(`Deleting ${contentType} content ${contentId}`);
      addNotification(`${contentType} content deleted successfully`, 'success');
    } catch (error) {
      console.error('Error deleting content:', error);
      addNotification('Failed to delete content', 'error');
    }
  };

  const [activeTab, setActiveTab] = useState('reports');
  const [reports, setReports] = useState([]);
  const [moments, setMoments] = useState([]);
  const [stories, setStories] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, _setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [_moderationAction, _setModerationAction] = useState('');
  const [_moderationNote, _setModerationNote] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAndSortItems();
  }, [reports, moments, stories, activeTab, searchQuery, statusFilter, typeFilter, priorityFilter, sortBy, sortOrder]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load reports
      let mockReports = JSON.parse(localStorage.getItem('admin_reports') || '[]');
      if (mockReports.length === 0) {
        mockReports = generateMockReports();
        localStorage.setItem('admin_reports', JSON.stringify(mockReports));
      }

      // Load moments for moderation
      let mockMoments = JSON.parse(localStorage.getItem('admin_moments') || '[]');
      if (mockMoments.length === 0) {
        mockMoments = generateMockMoments();
        localStorage.setItem('admin_moments', JSON.stringify(mockMoments));
      }

      // Load stories for moderation
      let mockStories = JSON.parse(localStorage.getItem('admin_stories') || '[]');
      if (mockStories.length === 0) {
        mockStories = generateMockStories();
        localStorage.setItem('admin_stories', JSON.stringify(mockStories));
      }

      setReports(mockReports);
      setMoments(mockMoments);
      setStories(mockStories);
    } catch (error) {
      console.error('Error loading moderation data:', error);
      addNotification('Error loading moderation data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockReports = () => {
    const reportTypes = ['inappropriate_content', 'spam', 'harassment', 'fake_information', 'copyright'];
    const statuses = ['pending', 'reviewing', 'resolved', 'dismissed'];
    const priorities = ['low', 'medium', 'high', 'critical'];
    
    return Array.from({ length: 25 }, (_, index) => ({
      id: `report_${index + 1}`,
      type: reportTypes[Math.floor(Math.random() * reportTypes.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      content_type: Math.random() > 0.5 ? 'moment' : 'story',
      content_id: `content_${Math.floor(Math.random() * 100) + 1}`,
      content_title: `Sample Content Title ${index + 1}`,
      reporter_name: `User ${Math.floor(Math.random() * 50) + 1}`,
      reported_user: `Reported User ${Math.floor(Math.random() * 30) + 1}`,
      description: `This content violates community guidelines. Report details for item ${index + 1}.`,
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      moderator_notes: Math.random() > 0.7 ? 'Under review by moderation team' : null,
      evidence_urls: []
    }));
  };

  const generateMockMoments = () => {
    const statuses = ['published', 'flagged', 'under_review', 'removed'];
    
    return Array.from({ length: 30 }, (_, index) => ({
      id: `moment_${index + 1}`,
      title: `Moment Title ${index + 1}`,
      content: `This is the content of moment ${index + 1}. It contains various types of content that might need moderation.`,
      author: `Author ${Math.floor(Math.random() * 20) + 1}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      created_at: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      likes_count: Math.floor(Math.random() * 100),
      comments_count: Math.floor(Math.random() * 50),
      reports_count: Math.floor(Math.random() * 5),
      media_count: Math.floor(Math.random() * 3),
      privacy_level: Math.random() > 0.5 ? 'public' : 'family'
    }));
  };

  const generateMockStories = () => {
    const statuses = ['published', 'flagged', 'under_review', 'removed'];
    
    return Array.from({ length: 20 }, (_, index) => ({
      id: `story_${index + 1}`,
      title: `Story Title ${index + 1}`,
      description: `This is the description of story ${index + 1}. Stories can contain multiple chapters and moments.`,
      author: `Author ${Math.floor(Math.random() * 15) + 1}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      created_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      chapters_count: Math.floor(Math.random() * 10) + 1,
      moments_count: Math.floor(Math.random() * 25) + 1,
      reports_count: Math.floor(Math.random() * 3),
      privacy_level: Math.random() > 0.3 ? 'public' : 'family'
    }));
  };

  const filterAndSortItems = () => {
    let items = [];
    
    switch (activeTab) {
      case 'reports':
        items = [...reports];
        break;
      case 'moments':
        items = [...moments];
        break;
      case 'stories':
        items = [...stories];
        break;
      default:
        items = [];
    }

    // Apply search filter
    if (searchQuery) {
      items = items.filter(item => {
        const searchFields = activeTab === 'reports' 
          ? [item.content_title, item.reporter_name, item.reported_user, item.description]
          : [item.title, item.author, item.content || item.description];
        
        return searchFields.some(field => 
          field && field.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      items = items.filter(item => item.status === statusFilter);
    }

    // Apply type filter (for reports)
    if (typeFilter !== 'all' && activeTab === 'reports') {
      items = items.filter(item => item.type === typeFilter);
    }

    // Apply priority filter (for reports)
    if (priorityFilter !== 'all' && activeTab === 'reports') {
      items = items.filter(item => item.priority === priorityFilter);
    }

    // Apply sorting
    items.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'created_at' || sortBy === 'updated_at') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredItems(items);
    setCurrentPage(1);
  };

  const handleModerationAction = async (action, item) => {
    switch (action) {
      case 'approve':
        await updateItemStatus(item.id, 'published');
        break;
      case 'reject':
        await updateItemStatus(item.id, 'removed');
        break;
      case 'flag':
        await updateItemStatus(item.id, 'flagged');
        break;
      case 'review':
        await updateItemStatus(item.id, 'under_review');
        break;
      case 'delete':
        setSelectedItem(item);
        setShowDeleteModal(true);
        break;
      case 'view':
        setSelectedItem(item);
        setShowDetailModal(true);
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const updateItemStatus = async (itemId, newStatus) => {
    try {
      // Update the item status in the appropriate array
      const updateArray = (items) => 
        items.map(item => 
          item.id === itemId 
            ? { ...item, status: newStatus, updated_at: new Date().toISOString() }
            : item
        );

      switch (activeTab) {
        case 'reports': {
          const updatedReports = updateArray(reports);
          setReports(updatedReports);
          localStorage.setItem('admin_reports', JSON.stringify(updatedReports));
          break;
        }
        case 'moments': {
          const updatedMoments = updateArray(moments);
          setMoments(updatedMoments);
          localStorage.setItem('admin_moments', JSON.stringify(updatedMoments));
          break;
        }
        case 'stories': {
          const updatedStories = updateArray(stories);
          setStories(updatedStories);
          localStorage.setItem('admin_stories', JSON.stringify(updatedStories));
          break;
        }
      }

      addNotification(`Item status updated to ${newStatus}`, 'success');
    } catch (error) {
      console.error('Error updating item status:', error);
      addNotification('Error updating item status', 'error');
    }
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;

    const success = await deleteContent(selectedItem.id, activeTab.slice(0, -1)); // Remove 's' from tab name
    if (success) {
      setShowDeleteModal(false);
      setSelectedItem(null);
      await loadData();
    }
  };





  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateString);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  if (!hasAdminPermission(ADMIN_PERMISSIONS.CONTENT_MODERATION)) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8 max-w-md text-center">
          <Shield size={64} className="text-red-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You don't have permission to moderate content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="space-y-4 md:space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Content Moderation</h2>
              <p className="text-gray-600 text-sm">
                Manage reports, moments, and stories
              </p>
            </div>
            <button
              onClick={loadData}
              disabled={isLoading}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all border-2 border-gray-200 hover:border-gray-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              )}
              <span className="text-sm">Refresh</span>
            </button>
          </div>
        </div>

        {/* Tabs - Simplified */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-4">
          <div className="flex flex-wrap gap-2">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                activeTab === 'reports'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('reports')}
            >
              <Flag size={16} />
              Reports ({reports.filter(r => r.status === 'pending').length})
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                activeTab === 'moments'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('moments')}
            >
              <MessageSquare size={16} />
              Moments ({moments.filter(m => m.status === 'flagged').length})
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                activeTab === 'stories'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('stories')}
            >
              <FileText size={16} />
              Stories ({stories.filter(s => s.status === 'flagged').length})
            </button>
          </div>
        </div>

        {/* Filters - Simplified */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
              >
                <option value="all">All Status</option>
                {activeTab === 'reports' ? (
                  <>
                    <option value="pending">Pending</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="resolved">Resolved</option>
                    <option value="dismissed">Dismissed</option>
                  </>
                ) : (
                  <>
                    <option value="published">Published</option>
                    <option value="flagged">Flagged</option>
                    <option value="under_review">Under Review</option>
                    <option value="removed">Removed</option>
                  </>
                )}
              </select>
            </div>
            {activeTab === 'reports' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                  >
                    <option value="all">All Types</option>
                    <option value="inappropriate_content">Inappropriate</option>
                    <option value="spam">Spam</option>
                    <option value="harassment">Harassment</option>
                    <option value="fake_information">Fake Info</option>
                    <option value="copyright">Copyright</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                  >
                    <option value="all">All Priorities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
              >
                <option value="created_at">Created Date</option>
                <option value="updated_at">Updated Date</option>
                {activeTab === 'reports' && <option value="priority">Priority</option>}
                {activeTab !== 'reports' && <option value="reports_count">Reports</option>}
              </select>
            </div>
          </div>
        </div>

        {/* Content Table */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
          <div className="p-4 md:p-6 border-b-2 border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-lg font-bold text-gray-900">
                {filteredItems.length} {activeTab} found
              </span>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                <span className="text-gray-600">Loading {activeTab}...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {activeTab === 'reports' ? (
                        <>
                          <th className="text-left py-3 px-4 md:px-6 text-xs md:text-sm font-bold text-gray-700">Report</th>
                          <th className="text-left py-3 px-4 md:px-6 text-xs md:text-sm font-bold text-gray-700">Type</th>
                          <th className="text-left py-3 px-4 md:px-6 text-xs md:text-sm font-bold text-gray-700">Priority</th>
                          <th className="text-left py-3 px-4 md:px-6 text-xs md:text-sm font-bold text-gray-700">Status</th>
                          <th className="text-left py-3 px-4 md:px-6 text-xs md:text-sm font-bold text-gray-700">Reporter</th>
                          <th className="text-left py-3 px-4 md:px-6 text-xs md:text-sm font-bold text-gray-700">Created</th>
                          <th className="text-center py-3 px-4 md:px-6 text-xs md:text-sm font-bold text-gray-700">Actions</th>
                        </>
                      ) : (
                        <>
                          <th className="text-left py-3 px-4 md:px-6 text-xs md:text-sm font-bold text-gray-700">Content</th>
                          <th className="text-left py-3 px-4 md:px-6 text-xs md:text-sm font-bold text-gray-700">Author</th>
                          <th className="text-left py-3 px-4 md:px-6 text-xs md:text-sm font-bold text-gray-700">Status</th>
                          <th className="text-left py-3 px-4 md:px-6 text-xs md:text-sm font-bold text-gray-700">Activity</th>
                          <th className="text-left py-3 px-4 md:px-6 text-xs md:text-sm font-bold text-gray-700">Created</th>
                          <th className="text-center py-3 px-4 md:px-6 text-xs md:text-sm font-bold text-gray-700">Actions</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                {currentItems.map((item) => (
                  <tr key={item.id} className="border-b-2 border-gray-100 hover:bg-gray-50 transition-colors">
                    {activeTab === 'reports' ? (
                      <>
                        <td className="py-3 px-4 md:px-6">
                          <div className="space-y-1">
                            <div className="font-semibold text-gray-900 text-sm md:text-base">{item.content_title}</div>
                            <div className="text-xs md:text-sm text-gray-600">
                              {item.content_type} • {item.description.substring(0, 50)}...
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 md:px-6">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border-2 border-blue-200">
                            {item.type.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 md:px-6">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border-2 ${
                            item.priority === 'critical' 
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : item.priority === 'high'
                              ? 'bg-orange-50 text-orange-700 border-orange-200'
                              : item.priority === 'medium'
                              ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                              : 'bg-green-50 text-green-700 border-green-200'
                          }`}>
                            {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 md:px-6">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border-2 ${
                            item.status === 'pending' 
                              ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                              : item.status === 'reviewing'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : item.status === 'resolved'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-gray-50 text-gray-700 border-gray-200'
                          }`}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 md:px-6">
                          <div className="space-y-1">
                            <div className="text-sm text-gray-900 font-medium">{item.reporter_name}</div>
                            <div className="text-xs text-gray-600">
                              vs {item.reported_user}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 md:px-6">
                          <div className="text-xs md:text-sm text-gray-600">
                            {getTimeAgo(item.created_at)}
                          </div>
                        </td>
                        <td className="py-3 px-4 md:px-6">
                          <div className="flex items-center justify-center gap-1 md:gap-2">
                            <button
                              onClick={() => handleModerationAction('view', item)}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all border-2 border-transparent hover:border-blue-200"
                              title="View"
                            >
                              <Eye size={14} />
                            </button>
                            {item.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleModerationAction('approve', item)}
                                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all border-2 border-transparent hover:border-green-200"
                                  title="Approve"
                                >
                                  <CheckCircle size={14} />
                                </button>
                                <button
                                  onClick={() => handleModerationAction('reject', item)}
                                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border-2 border-transparent hover:border-red-200"
                                  title="Reject"
                                >
                                  <XCircle size={14} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-4 md:px-6">
                          <div className="space-y-1">
                            <div className="font-semibold text-gray-900 text-sm md:text-base">{item.title}</div>
                            <div className="text-xs md:text-sm text-gray-600">
                              {(item.content || item.description || '').substring(0, 50)}...
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 md:px-6">
                          <div className="text-sm text-gray-900 font-medium">{item.author}</div>
                        </td>
                        <td className="py-3 px-4 md:px-6">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border-2 ${
                            item.status === 'published' 
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : item.status === 'flagged'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : item.status === 'under_review'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-gray-50 text-gray-700 border-gray-200'
                          }`}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 md:px-6">
                          <div className="space-y-1">
                            <div className="text-xs md:text-sm text-gray-900 font-medium">
                              {activeTab === 'moments' 
                                ? `${item.likes_count} likes, ${item.comments_count} comments`
                                : `${item.chapters_count} chapters, ${item.moments_count} moments`
                              }
                            </div>
                            {item.reports_count > 0 && (
                              <div className="text-xs text-red-600 font-medium">
                                {item.reports_count} reports
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 md:px-6">
                          <div className="text-xs md:text-sm text-gray-600">
                            {getTimeAgo(item.created_at)}
                          </div>
                        </td>
                        <td className="py-3 px-4 md:px-6">
                          <div className="flex items-center justify-center gap-1 md:gap-2">
                            <button
                              onClick={() => handleModerationAction('view', item)}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all border-2 border-transparent hover:border-blue-200"
                              title="View"
                            >
                              <Eye size={14} />
                            </button>
                            {item.status === 'flagged' && (
                              <>
                                <button
                                  onClick={() => handleModerationAction('approve', item)}
                                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all border-2 border-transparent hover:border-green-200"
                                  title="Approve"
                                >
                                  <CheckCircle size={14} />
                                </button>
                                <button
                                  onClick={() => handleModerationAction('delete', item)}
                                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border-2 border-transparent hover:border-red-200"
                                  title="Delete"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </>
                            )}
                            {item.status === 'published' && (
                              <button
                                onClick={() => handleModerationAction('flag', item)}
                                className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all border-2 border-transparent hover:border-amber-200"
                                title="Flag"
                              >
                                <Flag size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="p-4 md:p-6 border-t-2 border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between gap-4">
                    {/* Previous Link - Left */}
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-gray-700 group"
                    >
                      <ChevronLeft size={18} className="transition-transform duration-200 group-hover:-translate-x-1 group-focus:-translate-x-1" />
                      <span className="text-sm md:text-base font-medium">Previous</span>
                    </button>

                    {/* Pagination Text - Center */}
                    <div className="flex-1 flex items-center justify-center">
                      <span className="text-sm md:text-base text-gray-700 font-semibold">
                        Page <span className="text-blue-600 font-bold">{currentPage}</span> of <span className="text-gray-900 font-bold">{totalPages}</span>
                      </span>
                    </div>

                    {/* Next Link - Right */}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-gray-700 group"
                    >
                      <span className="text-sm md:text-base font-medium">Next</span>
                      <ChevronRight size={18} className="transition-transform duration-200 group-hover:translate-x-1 group-focus:translate-x-1" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedItem && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {activeTab === 'reports' ? 'Report Details' : `${activeTab.slice(0, -1)} Details`}
              </h3>
              <div className="space-y-4">
                {activeTab === 'reports' ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Content</label>
                        <div className="text-gray-900">{selectedItem.content_title}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border-2 border-blue-200">
                          {selectedItem.type.replace('_', ' ')}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border-2 ${
                          selectedItem.priority === 'critical' 
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : selectedItem.priority === 'high'
                            ? 'bg-orange-50 text-orange-700 border-orange-200'
                            : selectedItem.priority === 'medium'
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            : 'bg-green-50 text-green-700 border-green-200'
                        }`}>
                          {selectedItem.priority.charAt(0).toUpperCase() + selectedItem.priority.slice(1)}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border-2 ${
                          selectedItem.status === 'pending' 
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            : selectedItem.status === 'reviewing'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : selectedItem.status === 'resolved'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}>
                          {selectedItem.status.charAt(0).toUpperCase() + selectedItem.status.slice(1)}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Reporter</label>
                        <div className="text-gray-900">{selectedItem.reporter_name}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Reported User</label>
                        <div className="text-gray-900">{selectedItem.reported_user}</div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                      <div className="text-gray-900 bg-gray-50 rounded-lg p-3 border-2 border-gray-200">{selectedItem.description}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Created</label>
                      <div className="text-gray-600">{formatDate(selectedItem.created_at)}</div>
                    </div>
                    {selectedItem.moderator_notes && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Moderator Notes</label>
                        <div className="text-gray-900 bg-gray-50 rounded-lg p-3 border-2 border-gray-200">{selectedItem.moderator_notes}</div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                        <div className="text-gray-900">{selectedItem.title}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Author</label>
                        <div className="text-gray-900">{selectedItem.author}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border-2 ${
                          selectedItem.status === 'published' 
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : selectedItem.status === 'flagged'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : selectedItem.status === 'under_review'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}>
                          {selectedItem.status.charAt(0).toUpperCase() + selectedItem.status.slice(1).replace('_', ' ')}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Privacy</label>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 border-2 border-purple-200">
                          {selectedItem.privacy_level}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Content</label>
                      <div className="text-gray-900 bg-gray-50 rounded-lg p-3 border-2 border-gray-200">{selectedItem.content || selectedItem.description}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Created</label>
                      <div className="text-gray-600">{formatDate(selectedItem.created_at)}</div>
                    </div>
                    {selectedItem.reports_count > 0 && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Reports</label>
                        <div className="text-red-700 font-medium">{selectedItem.reports_count} reports</div>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all border-2 border-gray-200 hover:border-gray-300 font-medium"
                >
                  Close
                </button>
                {activeTab === 'reports' && selectedItem.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleModerationAction('approve', selectedItem);
                        setShowDetailModal(false);
                      }}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg font-medium"
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => {
                        handleModerationAction('reject', selectedItem);
                        setShowDetailModal(false);
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg font-medium"
                    >
                      Dismiss
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedItem && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-2xl p-6 max-w-md w-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Confirm Deletion</h3>
              <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={20} className="text-amber-600" />
                  <div className="text-amber-800 font-semibold">Warning</div>
                </div>
                <div className="text-gray-900">
                  You are about to permanently delete this {activeTab.slice(0, -1)}: 
                  <strong> {selectedItem.title || selectedItem.content_title}</strong>
                </div>
              </div>
              <div className="text-gray-600 mb-6">This action cannot be undone.</div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all border-2 border-gray-200 hover:border-gray-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteItem}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContentModeration;