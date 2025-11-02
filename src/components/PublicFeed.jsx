import React from 'react';
import { Globe, Clock, ArrowRight } from 'lucide-react';
import MomentCard from './MomentCard';

const PublicFeed = ({ moments = [], onViewMoment, onNavigate }) => {
  const safeMoments = Array.isArray(moments) ? moments : [];
  const publicMoments = safeMoments.filter((m) => m && (m.visibility === 'PUBLIC' || m.isPublic === true));
  const topPublic = publicMoments
    .slice()
    .sort((a, b) => new Date(b?.createdAt || b?.date || 0) - new Date(a?.createdAt || a?.date || 0))
    .slice(0, 6);

  return (
    <section className="content-section py-16 bg-slate-50">
      <div className="container-fluid">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 space-y-6 lg:space-y-0">
          <div className="content-header">
            <div className="flex items-center space-x-4 mb-3">
              <div className="bg-slate-700 p-4 rounded-xl shadow-sm">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-slate-900">Public Feed</h2>
            </div>
            <p className="text-xl text-slate-600">Discover moments shared with everyone</p>
          </div>
          {publicMoments.length > 0 && (
            <button 
              className="btn btn-outline inline-flex items-center space-x-2"
              onClick={() => onNavigate('moments')}
            >
              <span>Explore All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {topPublic.length > 0 ? (
          <div className="desktop-card-grid">
            {topPublic.map((moment) => (
              <MomentCard
                key={moment.id}
                title={moment.title}
                date={moment.date || new Date(moment.createdAt).toLocaleDateString()}
                imageUrl={moment.imageUrl}
                onClick={() => onViewMoment(moment)}
                moment={moment}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="max-w-lg mx-auto space-y-8">
              <div className="flex justify-center">
                <div className="card p-10 bg-white border border-slate-200">
                  <Clock className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-900">No public moments yet</h3>
                <p className="text-lg leading-relaxed text-slate-600 max-w-md mx-auto">
                  Be the first to share a public moment or explore all moments.
                </p>
              </div>
              <div className="flex items-center justify-center gap-4">
                <button 
                  className="btn btn-primary inline-flex items-center space-x-2"
                  onClick={() => onNavigate('create-moment')}
                >
                  <span>Create Public Moment</span>
                </button>
                <button 
                  className="btn btn-outline inline-flex items-center space-x-2"
                  onClick={() => onNavigate('moments')}
                >
                  <span>Explore Moments</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PublicFeed;

