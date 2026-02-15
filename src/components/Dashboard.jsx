import React from 'react';
import DataSummary from './DataSummary';
import ManualCleaning from './ManualCleaning';
import AutoCleaning from './AutoCleaning';
import Visualizations from './Visualizations';
import OutlierDetection from './OutlierDetection';
import MachineLearning from './MachineLearning';
import Insights from './Insights';
import DeveloperConsole from './DeveloperConsole';

function Dashboard({ sessionId, filename, summary, setSummary, activeTab, setActiveTab }) {
  const tabs = [
    { id: 'summary', label: 'Overview', icon: '📊', component: DataSummary },
    { id: 'manual', label: 'Manual Clean', icon: '🛠️', component: ManualCleaning },
    { id: 'auto', label: 'Auto Clean', icon: '⚡', component: AutoCleaning },
    { id: 'viz', label: 'Visualizations', icon: '📈', component: Visualizations },
    { id: 'outliers', label: 'Outliers', icon: '🎯', component: OutlierDetection },
    { id: 'ml', label: 'ML Models', icon: '🤖', component: MachineLearning },
    { id: 'insights', label: 'Insights', icon: '💡', component: Insights },
    { id: 'console', label: 'Console', icon: '💻', component: DeveloperConsole },
  ];

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || DataSummary;

  return (
    <div className="dashboard-wrapper">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Data Analysis Dashboard</h1>
          <p className="dashboard-subtitle">
            <span className="file-badge">{filename}</span>
          </p>
        </div>
      </div>

      {/* Modern Tab Navigation */}
      <div className="tabs-wrapper">
        <div className="tabs-container">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
              {activeTab === tab.id && <span className="tab-indicator"></span>}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content Area */}
      <div className="content-area">
        <div className="content-wrapper fade-in">
          <ActiveComponent 
            sessionId={sessionId} 
            summary={summary} 
            setSummary={setSummary}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;