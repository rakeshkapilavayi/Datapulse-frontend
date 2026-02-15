import React, { useState, useEffect } from 'react';
import { getInsights } from '../services/api';
import { FaLightbulb, FaChartLine, FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

function Insights({ sessionId, summary }) {
  const [rawInsights, setRawInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load raw insights on mount
  useEffect(() => {
    const loadRawInsights = async () => {
      setLoading(true);
      try {
        const response = await getInsights(sessionId, 'raw');
        setRawInsights(response.data);
      } catch (error) {
        console.error('Error loading raw insights:', error);
        toast.error('Failed to load insights');
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      loadRawInsights();
    }
  }, [sessionId]);

  const renderRawInsights = () => {
    if (!rawInsights) return null;

    const { insights = [], recommendations = [], statistics = {} } = rawInsights;

    return (
      <div className="raw-insights-container">
        {/* Statistics Cards */}
        {statistics && Object.keys(statistics).length > 0 && (
          <div className="stats-grid">
            <StatCard 
              icon={<FaChartLine />}
              title="Dataset Size"
              value={`${(statistics.rows || 0).toLocaleString()} rows`}
              subtitle={`${statistics.columns || 0} columns`}
              color="#3B82F6"
            />
            <StatCard 
              icon={<FaExclamationTriangle />}
              title="Missing Values"
              value={statistics.missing_total || 0}
              subtitle={`${(statistics.missing_pct || 0).toFixed(1)}% of data`}
              color="#F59E0B"
            />
            <StatCard 
              icon={<FaInfoCircle />}
              title="Duplicates"
              value={statistics.duplicates || 0}
              subtitle={`${(statistics.duplicate_pct || 0).toFixed(1)}% of rows`}
              color="#EC4899"
            />
            <StatCard 
              icon={<FaCheckCircle />}
              title="Data Quality"
              value={`${(statistics.quality_score || 0).toFixed(0)}%`}
              subtitle={statistics.quality_label || 'N/A'}
              color="#10B981"
            />
          </div>
        )}

        {/* Key Findings */}
        <div className="insights-section">
          <h3 className="insights-section-title">
            <FaChartLine className="section-icon" />
            Key Findings
          </h3>
          <div className="insights-list">
            {insights.map((insight, idx) => (
              <InsightCard 
                key={idx}
                number={idx + 1}
                text={insight.text || ''}
                type={insight.type || 'general'}
                importance={insight.importance || 'medium'}
              />
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="insights-section">
          <h3 className="insights-section-title">
            <FaLightbulb className="section-icon" />
            Recommendations
          </h3>
          <div className="recommendations-list">
            {recommendations.map((rec, idx) => (
              <RecommendationCard 
                key={idx}
                number={idx + 1}
                text={rec.text || ''}
                priority={rec.priority || 'medium'}
                category={rec.category || 'general'}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="insights-page">
      {/* Header */}
      <div className="content-card">
        <div className="card-header">
          <div>
            <h2 className="card-title">
              <FaLightbulb />
              Data Insights & Analysis
            </h2>
            <p className="card-subtitle">
              Automated analysis of your dataset with key findings and recommendations
            </p>
          </div>
        </div>
      </div>

      {/* Raw Insights Section */}
      {loading ? (
        <div className="content-card">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Analyzing your dataset...</p>
          </div>
        </div>
      ) : (
        <div className="content-card slide-in">
          <div className="card-header">
            <h2 className="card-title">
              📊 Statistical Insights
            </h2>
            <p className="card-subtitle">
              Automated analysis based on statistical patterns in your data
            </p>
          </div>
          {renderRawInsights()}
        </div>
      )}
    </div>
  );
}

// StatCard Component
function StatCard({ icon, title, value, subtitle, color }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: color + '20', color: color }}>
        {icon}
      </div>
      <div className="stat-info">
        <div className="stat-title">{title}</div>
        <div className="stat-value" style={{ color: color }}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div className="stat-subtitle">{subtitle}</div>
      </div>
    </div>
  );
}

// InsightCard Component
function InsightCard({ number, text, type, importance }) {
  const getTypeIcon = () => {
    switch (type) {
      case 'correlation': return '🔗';
      case 'outlier': return '⚠️';
      case 'distribution': return '📊';
      case 'quality': return '✅';
      default: return '💡';
    }
  };

  const getImportanceColor = () => {
    switch (importance) {
      case 'critical': return '#DC2626';
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <div className="insight-card">
      <div className="insight-number" style={{ borderColor: getImportanceColor() }}>
        {number}
      </div>
      <div className="insight-content">
        <div className="insight-header">
          <span className="insight-type-icon">{getTypeIcon()}</span>
          <span className="insight-type-label">{type}</span>
          <span 
            className="insight-importance-badge" 
            style={{ backgroundColor: getImportanceColor() + '20', color: getImportanceColor() }}
          >
            {importance}
          </span>
        </div>
        <p className="insight-text">{text}</p>
      </div>
    </div>
  );
}

// RecommendationCard Component
function RecommendationCard({ number, text, priority, category }) {
  const getPriorityColor = () => {
    switch (priority) {
      case 'critical': return '#DC2626';
      case 'high': return '#EF4444';
      case 'medium': return '#3B82F6';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getCategoryIcon = () => {
    switch (category) {
      case 'cleaning': return '🧹';
      case 'modeling': return '🤖';
      case 'analysis': return '📊';
      case 'quality': return '✅';
      default: return '💡';
    }
  };

  return (
    <div className="recommendation-card">
      <div className="recommendation-header">
        <div className="recommendation-number" style={{ backgroundColor: getPriorityColor() }}>
          {number}
        </div>
        <div className="recommendation-badges">
          <span className="category-badge">
            {getCategoryIcon()} {category}
          </span>
          <span 
            className="priority-badge" 
            style={{ backgroundColor: getPriorityColor() + '20', color: getPriorityColor() }}
          >
            {priority} priority
          </span>
        </div>
      </div>
      <p className="recommendation-text">{text}</p>
    </div>
  );
}

export default Insights;