import React, { useState, useEffect } from 'react';
import { trainModel } from '../services/api';
import toast from 'react-hot-toast';
import { FaRobot, FaCog, FaDownload, FaCheckCircle, FaChartBar } from 'react-icons/fa';
import Plot from 'react-plotly.js';
import './MachineLearning.css'; 

function MachineLearning({ sessionId, summary }) {
  const [taskType, setTaskType] = useState('classification');
  const [modelType, setModelType] = useState('RandomForestClassifier');
  const [targetColumn, setTargetColumn] = useState('');
  const [testSize, setTestSize] = useState(0.2);
  const [tuneParams, setTuneParams] = useState(false);
  const [training, setTraining] = useState(false);
  const [report, setReport] = useState(null);
  const [modelFilename, setModelFilename] = useState(null);
  const [confusionMatrix, setConfusionMatrix] = useState(null);
  
  // Get suitable columns based on task type
  const getSuitableColumns = () => {
    if (!summary || !summary.column_info) return [];
    
    if (taskType === 'classification') {
      // For classification: categorical columns or numerical with few unique values
      return summary.column_info.filter(col => {
        const isNumericWithFewUnique = 
          (col.dtype === 'int64' || col.dtype === 'float64') && col.unique <= 20;
        const isCategorical = col.dtype === 'object' || col.dtype === 'category';
        return isNumericWithFewUnique || isCategorical;
      });
    } else {
      // For regression: numerical columns only
      return summary.column_info.filter(col => 
        col.dtype === 'int64' || col.dtype === 'float64'
      );
    }
  };

  const suitableColumns = getSuitableColumns();

  // Reset target column when task type changes
  useEffect(() => {
    setTargetColumn('');
  }, [taskType]);

  const handleTrain = async () => {
    if (!targetColumn) {
      toast.error('Please select a target column');
      return;
    }

    setTraining(true);
    setReport(null);
    setConfusionMatrix(null);
    
    try {
      const response = await trainModel({
        session_id: sessionId,
        task_type: taskType,
        model_type: modelType,
        target_column: targetColumn,
        test_size: testSize,
        tune_params: tuneParams
      });
      
      setReport(response.data.report);
      setModelFilename(response.data.model_filename);
      
      if (response.data.confusion_matrix_fig) {
        setConfusionMatrix(JSON.parse(response.data.confusion_matrix_fig));
      }
      
      toast.success('Model trained successfully!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Training failed');
    } finally {
      setTraining(false);
    }
  };

  const handleDownloadModel = () => {
    if (modelFilename) {
      window.open(`http://localhost:5000/api/download/model/${sessionId}`, '_blank');
      toast.success('Model download started!');
    }
  };

  const renderClassificationMetrics = () => {
    if (!report) return null;

    const accuracy = report.accuracy || 0;
    const f1Score = report.F1_Score || report['weighted avg']?.['f1-score'] || 0;
    const precision = report['weighted avg']?.precision || 0;
    const recall = report['weighted avg']?.recall || 0;
    const cvScore = report.Cross_Validation_Score || 0;
    const rocAuc = report.ROC_AUC || null;

    return (
      <div className="metrics-grid">
        <MetricCard 
          title="Accuracy" 
          value={(accuracy * 100).toFixed(2) + '%'} 
          color="#10B981"
          icon="🎯"
        />
        <MetricCard 
          title="F1 Score" 
          value={f1Score.toFixed(4)} 
          color="#3B82F6"
          icon="⚡"
        />
        <MetricCard 
          title="Precision" 
          value={precision.toFixed(4)} 
          color="#8B5CF6"
          icon="🔍"
        />
        <MetricCard 
          title="Recall" 
          value={recall.toFixed(4)} 
          color="#EC4899"
          icon="📊"
        />
        <MetricCard 
          title="Cross-Val Score" 
          value={cvScore.toFixed(4)} 
          color="#F59E0B"
          icon="🔄"
        />
        {rocAuc && (
          <MetricCard 
            title="ROC AUC" 
            value={rocAuc.toFixed(4)} 
            color="#06B6D4"
            icon="📈"
          />
        )}
      </div>
    );
  };

  const renderRegressionMetrics = () => {
    if (!report) return null;

    const r2 = report['R² Score'] || 0;
    const mse = report['Mean Squared Error'] || 0;
    const mae = report['Mean Absolute Error'] || 0;
    const rmse = Math.sqrt(mse);
    const cvScore = report.Cross_Validation_Score || 0;

    return (
      <div className="metrics-grid">
        <MetricCard 
          title="R² Score" 
          value={r2.toFixed(4)} 
          color="#10B981"
          icon="🎯"
          subtitle={(r2 * 100).toFixed(1) + '% variance explained'}
        />
        <MetricCard 
          title="RMSE" 
          value={rmse.toFixed(4)} 
          color="#3B82F6"
          icon="📉"
          subtitle="Root Mean Squared Error"
        />
        <MetricCard 
          title="MAE" 
          value={mae.toFixed(4)} 
          color="#8B5CF6"
          icon="📊"
          subtitle="Mean Absolute Error"
        />
        <MetricCard 
          title="MSE" 
          value={mse.toFixed(4)} 
          color="#EC4899"
          icon="⚠️"
          subtitle="Mean Squared Error"
        />
        <MetricCard 
          title="Cross-Val Score" 
          value={cvScore.toFixed(4)} 
          color="#F59E0B"
          icon="🔄"
        />
      </div>
    );
  };

  const renderFeatureImportance = () => {
    if (!report || !report.Feature_Importance) return null;

    const topFeatures = report.Feature_Importance.slice(0, 10);

    return (
      <div className="feature-importance-section">
        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '600', 
          marginBottom: '1.5rem',
          color: 'var(--text-primary)'
        }}>
          🔝 Top 10 Important Features
        </h3>
        <div className="feature-importance-list">
          {topFeatures.map((feature, idx) => (
            <div key={idx} className="feature-importance-item">
              <div className="feature-info">
                <span className="feature-rank">#{idx + 1}</span>
                <span className="feature-name">{feature.Feature}</span>
              </div>
              <div className="feature-bar-container">
                <div 
                  className="feature-bar"
                  style={{ 
                    width: `${(feature.Importance / topFeatures[0].Importance) * 100}%`,
                    background: `linear-gradient(90deg, #667eea ${idx * 10}%, #764ba2 100%)`
                  }}
                />
                <span className="feature-value">{feature.Importance.toFixed(4)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="content-card">
        <div className="card-header">
          <h2 className="card-title">
            <FaRobot />
            Machine Learning Model Training
          </h2>
          <p className="card-subtitle">
            Configure and train your machine learning model with advanced options
          </p>
        </div>

        <div className="ml-form">
          {/* Task Type Selection */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🎯</span>
                Task Type
              </label>
              <select 
                className="form-select" 
                value={taskType} 
                onChange={(e) => {
                  setTaskType(e.target.value);
                  setModelType(e.target.value === 'classification' ? 'RandomForestClassifier' : 'RandomForestRegressor');
                }}
              >
                <option value="classification">Classification</option>
                <option value="regression">Regression</option>
              </select>
              <p className="form-hint">
                {taskType === 'classification' 
                  ? 'Predict categories (e.g., spam/not spam, disease type)'
                  : 'Predict continuous values (e.g., price, temperature)'}
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🤖</span>
                Model Algorithm
              </label>
              <select 
                className="form-select" 
                value={modelType} 
                onChange={(e) => setModelType(e.target.value)}
              >
                {taskType === 'classification' ? (
                  <>
                    <option value="RandomForestClassifier">Random Forest Classifier</option>
                    <option value="LogisticRegression">Logistic Regression</option>
                    <option value="XGBClassifier">XGBoost Classifier</option>
                    <option value="DecisionTreeClassifier">Decision Tree Classifier</option>
                    <option value="SVC">Support Vector Classifier</option>
                  </>
                ) : (
                  <>
                    <option value="RandomForestRegressor">Random Forest Regressor</option>
                    <option value="LinearRegression">Linear Regression</option>
                    <option value="XGBRegressor">XGBoost Regressor</option>
                    <option value="DecisionTreeRegressor">Decision Tree Regressor</option>
                    <option value="SVR">Support Vector Regressor</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Target Column and Test Size */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🎲</span>
                Target Column
              </label>
              <select 
                className="form-select" 
                value={targetColumn} 
                onChange={(e) => setTargetColumn(e.target.value)}
              >
                <option value="">-- Select Target Column --</option>
                {suitableColumns.map((col, idx) => (
                  <option key={idx} value={col.name}>
                    {col.name} ({col.dtype}, {col.unique} unique values)
                  </option>
                ))}
              </select>
              <p className="form-hint">
                {taskType === 'classification'
                  ? 'Showing categorical columns and numeric columns with ≤20 unique values'
                  : 'Showing numerical columns suitable for regression'}
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">✂️</span>
                Test Set Size: {(testSize * 100).toFixed(0)}%
              </label>
              <input 
                type="range" 
                min="0.1" 
                max="0.4" 
                step="0.05"
                value={testSize}
                onChange={(e) => setTestSize(parseFloat(e.target.value))}
                className="form-range"
              />
              <div className="split-info">
                <span className="split-label">Train: {((1 - testSize) * 100).toFixed(0)}%</span>
                <span className="split-label">Test: {(testSize * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>

          {/* Hyperparameter Tuning Checkbox */}
          <div className="form-group">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={tuneParams}
                onChange={(e) => setTuneParams(e.target.checked)}
                className="form-checkbox"
              />
              <span className="checkbox-text">
                <FaCog style={{ marginRight: '8px' }} />
                Enable Hyperparameter Tuning (GridSearchCV)
              </span>
            </label>
            <p className="form-hint" style={{ marginLeft: '28px' }}>
              {tuneParams 
                ? '⚠️ This will take longer but may improve model performance'
                : 'Use default parameters for faster training'}
            </p>
          </div>

          {/* Train Button */}
          <button 
            onClick={handleTrain} 
            className="btn btn-primary btn-large"
            disabled={training || !targetColumn}
          >
            <FaCog className={training ? 'spin' : ''} />
            {training ? 'Training Model...' : 'Train Model'}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {report && (
        <div className="content-card slide-in">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 className="card-title">
                  <FaCheckCircle style={{ color: '#10B981' }} />
                  Model Performance Report
                </h2>
                <p className="card-subtitle">
                  {modelType} trained on {targetColumn} • Test Size: {(testSize * 100).toFixed(0)}%
                </p>
              </div>
              <button 
                onClick={handleDownloadModel}
                className="btn btn-secondary"
              >
                <FaDownload />
                Download Model
              </button>
            </div>
          </div>
          
          {/* Metrics Section */}
          <div className="metrics-section">
            <h3 className="section-title">
              <FaChartBar />
              Performance Metrics
            </h3>
            {taskType === 'classification' ? renderClassificationMetrics() : renderRegressionMetrics()}
          </div>

          {/* Confusion Matrix */}
          {confusionMatrix && (
            <div className="visualization-section">
              <h3 className="section-title">Confusion Matrix</h3>
              <Plot
                data={confusionMatrix.data}
                layout={{
                  ...confusionMatrix.layout,
                  paper_bgcolor: 'transparent',
                  plot_bgcolor: 'transparent',
                  font: { color: '#E5E7EB' }
                }}
                config={{ responsive: true }}
                style={{ width: '100%', height: '500px' }}
              />
            </div>
          )}

          {/* Feature Importance */}
          {renderFeatureImportance()}

          {/* Model Info */}
          {modelFilename && (
            <div className="alert alert-success">
              <FaCheckCircle />
              <div>
                <strong>Model Saved Successfully</strong>
                <br />
                <span style={{ fontSize: '13px', opacity: 0.8 }}>
                  Filename: {modelFilename} • You can download and use this model for predictions
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Metric Card Component
function MetricCard({ title, value, color, icon, subtitle }) {
  return (
    <div className="metric-card">
      <div className="metric-icon" style={{ backgroundColor: color + '20', color: color }}>
        {icon}
      </div>
      <div className="metric-content">
        <div className="metric-title">{title}</div>
        <div className="metric-value" style={{ color: color }}>{value}</div>
        {subtitle && <div className="metric-subtitle">{subtitle}</div>}
      </div>
    </div>
  );
}

export default MachineLearning;