import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { API } from "../services/api";
import StoryCreateForm from "../components/StoryCreateForm";
import ShareModal from "../components/ShareModal";
import { useAuth } from "../contexts/AuthContext";
import {
  BookOpen,
  Plus,
  Search,
  Share2,
  Trash2,
  Users,
  Lock,
  X,
  Sparkles,
  ArrowRight,
  Eye,
  Calendar,
} from "lucide-react";

const StoriesPage = ({ onNavigate, initialShowCreateForm = false }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(
    location?.state?.action === "create" || false
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [shareModalStory, setShareModalStory] = useState(null);

  useEffect(() => {
    loadStories();
  }, []);

  // Open create modal when requested by navigation params
  useEffect(() => {
    if (initialShowCreateForm) {
      setShowCreateForm(true);
    }
  }, [initialShowCreateForm]);

  const loadStories = async () => {
    try {
      setLoading(true);
      const storiesData = await API.listStories();
      setStories(storiesData || []);
    } catch (err) {
      setError("Failed to load stories");
      console.error("Error loading stories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStory = async (storyData) => {
    try {
      const newStory = await API.createStory({
        ...storyData,
        userId: user?.id || "1",
        userIds: [user?.id || "1"],
        locked: false,
      });
      setStories((prev) => [newStory, ...prev]);
      setShowCreateForm(false);
    } catch (err) {
      setError("Failed to create story");
      console.error("Error creating story:", err);
    }
  };

  const handleDeleteStory = async (storyId) => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;

    try {
      await API.deleteStory(storyId);
      setStories((prev) => prev.filter((story) => story.id !== storyId));
    } catch (err) {
      setError("Failed to delete story");
      console.error("Error deleting story:", err);
    }
  };

  const filteredStories = stories.filter(
    (story) =>
      story.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.inviteCode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative mb-8">
              <div
                className="w-16 h-16 border-4 rounded-full animate-spin mx-auto"
                style={{
                  borderColor: "var(--amw-primary)",
                  borderTopColor: "transparent",
                }}
              ></div>
            </div>
            <p
              className="text-lg font-medium"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Loading stories...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <div className="relative z-10">
        {/* Header Section */}
        <div className="bg-white border-b-2 border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-br from-green-600 to-emerald-600 w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                Family Stories
              </h1>

              <p className="text-base md:text-xl max-w-2xl mx-auto leading-relaxed text-gray-600 px-4">
                Create and manage your family's story collections. Build lasting
                memories together.
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <X className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-red-800 font-medium">{error}</span>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-600 hover:text-red-800 transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Controls Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 w-full sm:max-w-md">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search stories by title or invite code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
              </div>

              {/* Create Button */}
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 md:px-6 md:py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 w-full sm:w-auto justify-center"
              >
                <Plus className="w-5 h-5" />
                <span>Create New Story</span>
              </button>
            </div>
          </div>
        </div>

        {/* Create Story Modal */}
        {showCreateForm && (
          <div
            className="fixed inset-0 z-[100] overflow-x-hidden overflow-y-auto"
            onClick={() => setShowCreateForm(false)}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            <div className="min-h-full flex items-start lg:items-center justify-center px-4 py-14 lg:py-4">
              <div
                className="relative w-full max-w-full lg:max-w-2xl bg-white rounded-t-2xl lg:rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden flex flex-col max-h-[calc(100vh-56px-80px)] lg:max-h-[90vh] my-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header - Fixed at top */}
                <div className="flex-shrink-0 bg-white border-b-2 border-gray-200 px-4 sm:px-5 lg:px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                      Create New Story
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 flex-shrink-0 ml-2"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-4 sm:px-6 lg:px-6 py-4 sm:py-6 lg:py-6 min-h-0">
                  <StoryCreateForm
                    onSubmit={handleCreateStory}
                    onCancel={() => setShowCreateForm(false)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stories Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          {filteredStories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 md:py-20 text-center">
              <div className="bg-gradient-to-br from-green-600 to-emerald-600 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <BookOpen className="w-10 h-10 md:w-12 md:h-12 text-white" />
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                {searchQuery ? "No stories found" : "No stories yet"}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md">
                {searchQuery
                  ? `No stories match "${searchQuery}". Try adjusting your search terms.`
                  : "Create your first family story to get started!"}
              </p>

              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center space-x-2 px-6 py-3 md:px-8 md:py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-5 h-5" />
                <span>Create Your First Story</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStories.map((story) => (
                  <div
                    key={story.id}
                    className="group bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-green-500 hover:shadow-xl transition-all duration-300"
                  >
                    {/* Story Image */}
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      {story.imageUrl ? (
                        <img
                          src={story.imageUrl}
                          alt={story.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <BookOpen className="w-16 h-16 text-gray-400" />
                        </div>
                      )}

                      {/* Locked Indicator */}
                      {story.locked && (
                        <div className="absolute top-3 right-3 w-8 h-8 bg-amber-100 border-2 border-amber-300 rounded-lg flex items-center justify-center">
                          <Lock className="w-4 h-4 text-amber-700" />
                        </div>
                      )}
                    </div>

                    {/* Story Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-200">
                        {story.title}
                      </h3>

                      <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span className="font-medium">
                            Code: {story.inviteCode}
                          </span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>
                            {story.userIds?.length || 1} member
                            {(story.userIds?.length || 1) !== 1 ? "s" : ""}
                          </span>
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            onNavigate &&
                            onNavigate("chapters", { storyId: story.id })
                          }
                          className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-600 hover:border-blue-700 rounded-lg transition-all duration-200 font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">View</span>
                        </button>

                        <button
                          onClick={() => setShareModalStory(story)}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 border-2 border-gray-200 hover:border-green-300 rounded-lg transition-all duration-200"
                          title="Share"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteStory(story.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 border-2 border-gray-200 hover:border-red-300 rounded-lg transition-all duration-200"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Statistics Section */}
              <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6 hover:border-blue-500 transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-blue-600">
                        {stories.length}
                      </div>
                      <div className="text-gray-600 text-sm font-medium">
                        Total Stories
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6 hover:border-green-500 transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shadow-md">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-600">
                        {stories.reduce(
                          (acc, story) => acc + (story.userIds?.length || 1),
                          0
                        )}
                      </div>
                      <div className="text-gray-600 text-sm font-medium">
                        Total Members
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {shareModalStory && (
          <ShareModal
            story={shareModalStory}
            onClose={() => setShareModalStory(null)}
          />
        )}
      </div>
    </div>
  );
};

export default StoriesPage;
