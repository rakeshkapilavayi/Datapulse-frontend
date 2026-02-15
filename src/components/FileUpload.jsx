import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaFileAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { uploadFile } from '../services/api';

function FileUpload({ onSuccess }) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const response = await uploadFile(formData);
      toast.success(`Successfully uploaded "${file.name}"!`);
      onSuccess(response.data);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [onSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div className="upload-page">
      <div className="upload-container fade-in">
        {/* Hero Section */}
        <div className="upload-hero">
          <div className="hero-badge">
            <span className="badge-icon">✨</span>
            <span>AI-Powered Analytics</span>
          </div>
          <h1 className="hero-title">
            Welcome to <span className="gradient-text">DataPulse</span>
          </h1>
          <p className="hero-description">
            Transform your raw data into powerful insights with automated analysis, 
            intelligent cleaning, and machine learning—all in one platform.
          </p>
        </div>

        {/* Upload Zone */}
        <div
          {...getRootProps()}
          className={`upload-dropzone ${isDragActive ? 'active' : ''} ${uploading ? 'uploading' : ''}`}
        >
          <input {...getInputProps()} />
          
          <div className="dropzone-content">
            {uploading ? (
              <>
                <div className="upload-spinner">
                  <div className="spinner-ring"></div>
                  <div className="spinner-ring"></div>
                  <div className="spinner-ring"></div>
                </div>
                <h3 className="dropzone-title">Processing Your File...</h3>
                <p className="dropzone-subtitle">Analyzing and preparing your dataset</p>
              </>
            ) : (
              <>
                <div className="dropzone-icon-wrapper">
                  <FaCloudUploadAlt className="dropzone-icon" />
                  <div className="icon-pulse"></div>
                </div>
                <h3 className="dropzone-title">
                  {isDragActive ? 'Drop your file here' : 'Drag & Drop Your Dataset'}
                </h3>
                <p className="dropzone-subtitle">or click to browse your files</p>
                <div className="supported-formats">
                  <FaFileAlt />
                  <span>CSV, XLS, XLSX supported</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Smart Cleaning</h3>
            <p className="feature-description">
              Automated data cleaning with intelligent handling of missing values and outliers
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3 className="feature-title">Rich Visualizations</h3>
            <p className="feature-description">
              Interactive charts, heatmaps, and statistical plots generated automatically
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3 className="feature-title">ML Ready</h3>
            <p className="feature-description">
              Train classification and regression models with just a few clicks
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3 className="feature-title">AI Insights</h3>
            <p className="feature-description">
              Get intelligent recommendations and insights powered by advanced AI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileUpload;