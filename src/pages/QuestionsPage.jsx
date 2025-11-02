import React, { useState, useEffect } from 'react';
import { API } from '../services/api';
import { QuestionCreateForm } from '../ui-components';
import { useAuth } from '../contexts/AuthContext';
import { Search, Plus, X, Loader2, HelpCircle } from 'lucide-react';

const QuestionsPage = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const questionsData = await API.listQuestions();
      setQuestions(questionsData || []);
    } catch (err) {
      setError('Failed to load questions');
      console.error('Error loading questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async (questionData) => {
    try {
      const newQuestion = await API.createQuestion({
        ...questionData,
        userId: user?.id || '1',
        isAnswered: false,
        answerCount: 0
      });
      setQuestions(prev => [newQuestion, ...prev]);
      setShowCreateForm(false);
    } catch (err) {
      setError('Failed to create question');
      console.error('Error creating question:', err);
    }
  };

  const filteredQuestions = questions
    .filter(question => {
      if (filter === 'answered') return question.isAnswered;
      if (filter === 'unanswered') return !question.isAnswered;
      return true;
    })
    .filter(question =>
      question.questionText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const questionCategories = [
    { id: 'childhood', name: 'Childhood', icon: '🧸', color: '#ff6b6b' },
    { id: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦', color: '#4ecdc4' },
    { id: 'memories', name: 'Memories', icon: '💭', color: '#45b7d1' },
    { id: 'traditions', name: 'Traditions', icon: '🎉', color: '#96ceb4' },
    { id: 'dreams', name: 'Dreams', icon: '✨', color: '#feca57' },
    { id: 'wisdom', name: 'Wisdom', icon: '🦉', color: '#ff9ff3' },
    { id: 'adventures', name: 'Adventures', icon: '🗺️', color: '#54a0ff' },
    { id: 'love', name: 'Love', icon: '❤️', color: '#ff6b9d' }
  ];

  const getCategoryInfo = (categoryId) => {
    return questionCategories.find(cat => cat.id === categoryId) || 
           { name: categoryId, icon: '❓', color: '#95a5a6' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8 max-w-md w-full text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200 sticky lg:sticky top-14 lg:top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Family Questions</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Spark meaningful conversations and capture precious memories</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
            >
              <Plus size={18} />
              <span>Create Question</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center justify-between mb-6">
            <span className="text-red-800 font-medium text-sm">{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800 transition-colors p-1"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
              />
            </div>
            
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'all' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setFilter('all')}
              >
                All ({questions.length})
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'unanswered' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setFilter('unanswered')}
              >
                Unanswered ({questions.filter(q => !q.isAnswered).length})
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'answered' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setFilter('answered')}
              >
                Answered ({questions.filter(q => q.isAnswered).length})
              </button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Browse by Category</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {questionCategories.map(category => {
              const categoryQuestions = questions.filter(q => q.category === category.id);
              return (
                <button
                  key={category.id}
                  onClick={() => setSearchQuery(category.name)}
                  className="bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300 p-3 sm:p-4 text-center group"
                  style={{ borderColor: category.color }}
                >
                  <div className="text-2xl sm:text-3xl mb-2">{category.icon}</div>
                  <div className="text-xs sm:text-sm font-semibold text-gray-900 mb-1">{category.name}</div>
                  <div className="text-xs text-gray-600">
                    {categoryQuestions.length} {categoryQuestions.length === 1 ? 'question' : 'questions'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4 sm:space-y-6">
          {filteredQuestions.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8 sm:p-12 text-center">
              <div className="text-5xl sm:text-6xl mb-6">❓</div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                {searchQuery || filter !== 'all' 
                  ? 'No questions found' 
                  : 'No questions yet'
                }
              </h3>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                {searchQuery || filter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Create your first question to start meaningful conversations!'
                }
              </p>
              {!searchQuery && filter === 'all' && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
                >
                  <Plus size={18} />
                  <span>Create Your First Question</span>
                </button>
              )}
            </div>
          ) : (
            filteredQuestions.map(question => {
              const categoryInfo = getCategoryInfo(question.category);
              
              return (
                <div key={question.id} className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-4 sm:p-6 hover:border-blue-500 hover:shadow-xl transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-white"
                         style={{ backgroundColor: categoryInfo.color }}>
                      {categoryInfo.icon} {categoryInfo.name}
                    </div>
                    <div>
                      {question.isAnswered ? (
                        <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-medium">
                          ✅ Answered
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs sm:text-sm font-medium">
                          ⏳ Waiting
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{question.questionText}</h3>
                    {question.description && (
                      <p className="text-sm sm:text-base text-gray-600">{question.description}</p>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-600 mb-4">
                    <span>
                      Created {new Date(question.timestamp || question.createdAt).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>
                      {question.answerCount || 0} answer{(question.answerCount || 0) !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <button className="flex-1 sm:flex-initial px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-all duration-200 border-2 border-blue-200 hover:border-blue-300 font-medium text-sm">
                      {question.isAnswered ? 'View Answers' : 'Answer Question'}
                    </button>
                    <button className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-all duration-200 border-2 border-gray-200 hover:border-gray-300 font-medium text-sm">
                      Share
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{questions.length}</div>
            <div className="text-sm sm:text-base text-gray-600 font-medium mt-2">Total Questions</div>
          </div>
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">
              {questions.filter(q => q.isAnswered).length}
            </div>
            <div className="text-sm sm:text-base text-gray-600 font-medium mt-2">Answered</div>
          </div>
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">
              {questions.reduce((acc, q) => acc + (q.answerCount || 0), 0)}
            </div>
            <div className="text-sm sm:text-base text-gray-600 font-medium mt-2">Total Answers</div>
          </div>
        </div>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowCreateForm(false)}>
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 sm:p-6 border-b-2 border-gray-200 flex items-center justify-between bg-gray-50">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Create New Question</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <QuestionCreateForm
                onSubmit={handleCreateQuestion}
                onCancel={() => setShowCreateForm(false)}
                categories={questionCategories}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionsPage;
