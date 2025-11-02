import React, { useState, useEffect } from 'react';
import { API } from '../services/api';
import { QuestionCreateForm } from '../ui-components';
import { useAuth } from '../contexts/AuthContext';


const QuestionsPage = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filter, setFilter] = useState('all'); // all, answered, unanswered
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
      <div className="questions-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="questions-page">
      <div className="questions-header">
        <h1>Family Questions</h1>
        <p>Spark meaningful conversations and capture precious memories</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="questions-controls">
        <div className="search-and-filter">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({questions.length})
            </button>
            <button
              className={`filter-tab ${filter === 'unanswered' ? 'active' : ''}`}
              onClick={() => setFilter('unanswered')}
            >
              Unanswered ({questions.filter(q => !q.isAnswered).length})
            </button>
            <button
              className={`filter-tab ${filter === 'answered' ? 'active' : ''}`}
              onClick={() => setFilter('answered')}
            >
              Answered ({questions.filter(q => q.isAnswered).length})
            </button>
          </div>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="create-question-btn"
        >
          + Create Question
        </button>
      </div>

      <div className="categories-section">
        <h3>Browse by Category</h3>
        <div className="categories-grid">
          {questionCategories.map(category => {
            const categoryQuestions = questions.filter(q => q.category === category.id);
            return (
              <div
                key={category.id}
                className="category-card"
                style={{ borderColor: category.color }}
                onClick={() => setSearchQuery(category.name)}
              >
                <div className="category-icon" style={{ color: category.color }}>
                  {category.icon}
                </div>
                <div className="category-name">{category.name}</div>
                <div className="category-count">
                  {categoryQuestions.length} question{categoryQuestions.length !== 1 ? 's' : ''}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create New Question</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <QuestionCreateForm
              onSubmit={handleCreateQuestion}
              onCancel={() => setShowCreateForm(false)}
              categories={questionCategories}
            />
          </div>
        </div>
      )}

      <div className="questions-list">
        {filteredQuestions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">❓</div>
            <h3>
              {searchQuery || filter !== 'all' 
                ? 'No questions found' 
                : 'No questions yet'
              }
            </h3>
            <p>
              {searchQuery || filter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first question to start meaningful conversations!'
              }
            </p>
            {!searchQuery && filter === 'all' && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="create-first-question-btn"
              >
                Create Your First Question
              </button>
            )}
          </div>
        ) : (
          filteredQuestions.map(question => {
            const categoryInfo = getCategoryInfo(question.category);
            
            return (
              <div key={question.id} className="question-card">
                <div className="question-header">
                  <div className="question-category">
                    <span 
                      className="category-badge"
                      style={{ backgroundColor: categoryInfo.color }}
                    >
                      {categoryInfo.icon} {categoryInfo.name}
                    </span>
                  </div>
                  <div className="question-status">
                    {question.isAnswered ? (
                      <span className="status-answered">✅ Answered</span>
                    ) : (
                      <span className="status-unanswered">⏳ Waiting</span>
                    )}
                  </div>
                </div>
                
                <div className="question-content">
                  <h3>{question.questionText}</h3>
                  {question.description && (
                    <p className="question-description">{question.description}</p>
                  )}
                </div>
                
                <div className="question-meta">
                  <span className="question-date">
                    Created {new Date(question.timestamp || question.createdAt).toLocaleDateString()}
                  </span>
                  <span className="answer-count">
                    {question.answerCount || 0} answer{(question.answerCount || 0) !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="question-actions">
                  <button className="answer-btn">
                    {question.isAnswered ? 'View Answers' : 'Answer Question'}
                  </button>
                  <button className="share-btn">
                    Share
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="questions-stats">
        <div className="stat-item">
          <span className="stat-number">{questions.length}</span>
          <span className="stat-label">Total Questions</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {questions.filter(q => q.isAnswered).length}
          </span>
          <span className="stat-label">Answered</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {questions.reduce((acc, q) => acc + (q.answerCount || 0), 0)}
          </span>
          <span className="stat-label">Total Answers</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage;