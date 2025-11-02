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
  MessageSquare,
  Image,
  FileText,
  Users,
  Calendar,
  MoreVertical
} from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { useNotifications } from '../contexts/NotificationContext';


const AdminContentModeration = ({ onNavigate: _onNavigate }) => {
  const { 
    hasPermission, 
    PERMISSIONS, 
    deleteContent
  } = useAdmin();
  const { addNotification } = useNotifications();

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

  if (!hasPermission(PERMISSIONS.CONTENT_MODERATION)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-8 max-w-md mx-auto text-center">
          <Shield size={64} className="text-red-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Access Denied</h3>
          <p className="text-white/80">You don't have permission to moderate content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Content Moderation</h2>
              <p className="text-white/80">
                Manage reports, moments, and stories
              </p>
            </div>
            <button
              onClick={loadData}
              disabled={isLoading}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              )}
              Refresh
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-6">
          <div className="flex space-x-1 bg-white/5 rounded-xl p-1">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === 'reports'
                  ? 'text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              style={activeTab === 'reports' ? { 
                backgroundColor: 'var(--amw-primary)', 
                border: '1px solid var(--amw-primary)' 
              } : {}}
              onClick={() => setActiveTab('reports')}
            >
              <Flag size={16} />
              Reports ({reports.filter(r => r.status === 'pending').length} pending)
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === 'moments'
                  ? 'text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              style={activeTab === 'moments' ? { 
                backgroundColor: 'var(--amw-primary)', 
                border: '1px solid var(--amw-primary)' 
              } : {}}
              onClick={() => setActiveTab('moments')}
            >
              <MessageSquare size={16} />
              Moments ({moments.filter(m => m.status === 'flagged').length} flagged)
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === 'stories'
                  ? 'text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              style={activeTab === 'stories' ? { 
                backgroundColor: 'var(--amw-primary)', 
                border: '1px solid var(--amw-primary)' 
              } : {}}
              onClick={() => setActiveTab('stories')}
            >
              <FileText size={16} />
              Stories ({stories.filter(s => s.status === 'flagged').length} flagged)
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-white/90 mb-2">Search</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
              >
                <option value="all" className="bg-slate-800">All Status</option>
                {activeTab === 'reports' ? (
                  <>
                    <option value="pending" className="bg-slate-800">Pending</option>
                    <option value="reviewing" className="bg-slate-800">Reviewing</option>
                    <option value="resolved" className="bg-slate-800">Resolved</option>
                    <option value="dismissed" className="bg-slate-800">Dismissed</option>
                  </>
                ) : (
                  <>
                    <option value="published" className="bg-slate-800">Published</option>
                    <option value="flagged" className="bg-slate-800">Flagged</option>
                    <option value="under_review" className="bg-slate-800">Under Review</option>
                    <option value="removed" className="bg-slate-800">Removed</option>
                  </>
                )}
              </select>
            </div>
            {activeTab === 'reports' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Type</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  >
                    <option value="all" className="bg-slate-800">All Types</option>
                    <option value="inappropriate_content" className="bg-slate-800">Inappropriate Content</option>
                    <option value="spam" className="bg-slate-800">Spam</option>
                    <option value="harassment" className="bg-slate-800">Harassment</option>
                    <option value="fake_information" className="bg-slate-800">Fake Information</option>
                    <option value="copyright" className="bg-slate-800">Copyright</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Priority</label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  >
                    <option value="all" className="bg-slate-800">All Priorities</option>
                    <option value="critical" className="bg-slate-800">Critical</option>
                    <option value="high" className="bg-slate-800">High</option>
                    <option value="medium" className="bg-slate-800">Medium</option>
                    <option value="low" className="bg-slate-800">Low</option>
                  </select>
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
              >
                <option value="created_at" className="bg-slate-800">Created Date</option>
                <option value="updated_at" className="bg-slate-800">Updated Date</option>
                {activeTab === 'reports' && <option value="priority" className="bg-slate-800">Priority</option>}
                {activeTab !== 'reports' && <option value="reports_count" className="bg-slate-800">Reports</option>}
              </select>
            </div>
          </div>
        </div>

        {/* Content Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-white/20">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-white">
                {filteredItems.length} {activeTab} found
              </span>
              <span className="text-sm text-white/70">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="text-white">Loading {activeTab}...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      {activeTab === 'reports' ? (
                        <>
                          <th className="text-left py-4 px-6 text-sm font-medium text-white/90">Report</th>
                          <th className="text-left py-4 px-6 text-sm font-medium text-white/90">Type</th>
                          <th className="text-left py-4 px-6 text-sm font-medium text-white/90">Priority</th>
                          <th className="text-left py-4 px-6 text-sm font-medium text-white/90">Status</th>
                          <th className="text-left py-4 px-6 text-sm font-medium text-white/90">Reporter</th>
                          <th className="text-left py-4 px-6 text-sm font-medium text-white/90">Created</th>
                          <th className="text-center py-4 px-6 text-sm font-medium text-white/90">Actions</th>
                        </>
                      ) : (
                        <>
                          <th className="text-left py-4 px-6 text-sm font-medium text-white/90">Content</th>
                          <th className="text-left py-4 px-6 text-sm font-medium text-white/90">Author</th>
                          <th className="text-left py-4 px-6 text-sm font-medium text-white/90">Status</th>
                          <th className="text-left py-4 px-6 text-sm font-medium text-white/90">Activity</th>
                          <th className="text-left py-4 px-6 text-sm font-medium text-white/90">Created</th>
                          <th className="text-center py-4 px-6 text-sm font-medium text-white/90">Actions</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                {currentItems.map((item) => (
                  <tr key={item.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    {activeTab === 'reports' ? (
                      <>
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="font-semibold text-white">{item.content_title}</div>
                            <div className="text-sm text-white/70">
                              {item.content_type} • {item.description.substring(0, 50)}...
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            {item.type.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.priority === 'critical' 
                              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                              : item.priority === 'high'
                              ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                              : item.priority === 'medium'
                              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                              : 'bg-green-500/20 text-green-300 border border-green-500/30'
                          }`}>
                            {item.priority}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.status === 'pending' 
                              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                              : item.status === 'reviewing'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : item.status === 'resolved'
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                              : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="text-sm text-white">{item.reporter_name}</div>
                            <div className="text-xs text-white/70">
                              vs {item.reported_user}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-white/70">
                            {getTimeAgo(item.created_at)}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleModerationAction('view', item)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-300 bg-blue-500/20 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors"
                            >
                              <Eye size={14} />
                            </button>
                            {item.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleModerationAction('approve', item)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-300 bg-green-500/20 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors"
                                >
                                  <CheckCircle size={14} />
                                </button>
                                <button
                                  onClick={() => handleModerationAction('reject', item)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-300 bg-red-500/20 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
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
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="font-semibold text-white">{item.title}</div>
                            <div className="text-sm text-white/70">
                              {(item.content || item.description || '').substring(0, 50)}...
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-white">{item.author}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.status === 'published' 
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                              : item.status === 'flagged'
                              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                              : item.status === 'under_review'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="text-sm text-white">
                              {activeTab === 'moments' 
                                ? `${item.likes_count} likes, ${item.comments_count} comments`
                                : `${item.chapters_count} chapters, ${item.moments_count} moments`
                              }
                            </div>
                            {item.reports_count > 0 && (
                              <div className="text-xs text-red-300">
                                {item.reports_count} reports
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-white/70">
                            {getTimeAgo(item.created_at)}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleModerationAction('view', item)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-300 bg-blue-500/20 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors"
                            >
                              <Eye size={14} />
                            </button>
                            {item.status === 'flagged' && (
                              <>
                                <button
                                  onClick={() => handleModerationAction('approve', item)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-300 bg-green-500/20 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors"
                                >
                                  <CheckCircle size={14} />
                                </button>
                                <button
                                  onClick={() => handleModerationAction('delete', item)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-300 bg-red-500/20 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </>
                            )}
                            {item.status === 'published' && (
                              <button
                                onClick={() => handleModerationAction('flag', item)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-orange-300 bg-orange-500/20 border border-orange-500/30 rounded-lg hover:bg-orange-500/30 transition-colors"
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
                <div className="p-6 border-t border-white/20">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="text-white">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedItem && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-white mb-6">
                {activeTab === 'reports' ? 'Report Details' : `${activeTab.slice(0, -1)} Details`}
              </h3>
              <div className="space-y-4">
                {activeTab === 'reports' ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-1">Content</label>
                        <div className="text-white">{selectedItem.content_title}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-1">Type</label>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {selectedItem.type.replace('_', ' ')}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-1">Priority</label>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedItem.priority === 'critical' 
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : selectedItem.priority === 'high'
                            ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                            : selectedItem.priority === 'medium'
                            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                            : 'bg-green-500/20 text-green-300 border border-green-500/30'
                        }`}>
                          {selectedItem.priority}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-1">Status</label>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedItem.status === 'pending' 
                            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                            : selectedItem.status === 'reviewing'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : selectedItem.status === 'resolved'
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                            : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                        }`}>
                          {selectedItem.status}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-1">Reporter</label>
                        <div className="text-white">{selectedItem.reporter_name}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-1">Reported User</label>
                        <div className="text-white">{selectedItem.reported_user}</div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-1">Description</label>
                      <div className="text-white bg-white/5 rounded-lg p-3">{selectedItem.description}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-1">Created</label>
                      <div className="text-white/70">{formatDate(selectedItem.created_at)}</div>
                    </div>
                    {selectedItem.moderator_notes && (
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-1">Moderator Notes</label>
                        <div className="text-white bg-white/5 rounded-lg p-3">{selectedItem.moderator_notes}</div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-1">Title</label>
                        <div className="text-white">{selectedItem.title}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-1">Author</label>
                        <div className="text-white">{selectedItem.author}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-1">Status</label>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedItem.status === 'published' 
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                            : selectedItem.status === 'flagged'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : selectedItem.status === 'under_review'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                        }`}>
                          {selectedItem.status}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-1">Privacy</label>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {selectedItem.privacy_level}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-1">Content</label>
                      <div className="text-white bg-white/5 rounded-lg p-3">{selectedItem.content || selectedItem.description}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-1">Created</label>
                      <div className="text-white/70">{formatDate(selectedItem.created_at)}</div>
                    </div>
                    {selectedItem.reports_count > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-1">Reports</label>
                        <div className="text-red-300">{selectedItem.reports_count} reports</div>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-200"
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
                      className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-xl text-green-300 hover:bg-green-500/30 transition-all duration-200"
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => {
                        handleModerationAction('reject', selectedItem);
                        setShowDetailModal(false);
                      }}
                      className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 hover:bg-red-500/30 transition-all duration-200"
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-6 max-w-md w-full">
              <h3 className="text-2xl font-bold text-white mb-4">Confirm Deletion</h3>
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={20} className="text-yellow-300" />
                  <div className="text-yellow-300 font-medium">Warning</div>
                </div>
                <div className="text-white mt-2">
                  You are about to permanently delete this {activeTab.slice(0, -1)}: 
                  <strong> {selectedItem.title || selectedItem.content_title}</strong>
                </div>
              </div>
              <div className="text-white/80 mb-6">This action cannot be undone.</div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteItem}
                  className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 hover:bg-red-500/30 transition-all duration-200"
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