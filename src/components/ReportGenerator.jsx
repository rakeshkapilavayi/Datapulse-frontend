import React, { useState } from 'react';
import { FaFileDownload, FaFilePdf, FaFileWord, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './ReportGenerator.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function ReportGenerator({ sessionId }) {
  const [downloadingDocx, setDownloadingDocx] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const downloadReport = async (format) => {
    if (format === 'docx') {
      setDownloadingDocx(true);
    } else {
      setDownloadingPdf(true);
    }
    
    try {
      const url = `${API_URL}/report/download/${format}/${sessionId}`;
      
      // Open in new window to trigger download
      window.open(url, '_blank');
      
      toast.success(`Downloading ${format.toUpperCase()} report...`);
    } catch (error) {
      toast.error(`Failed to download ${format.toUpperCase()} report`);
    } finally {
      setTimeout(() => {
        setDownloadingDocx(false);
        setDownloadingPdf(false);
      }, 1000);
    }
  };

  return (
    <div className="report-generator">
      <div className="report-header">
        <div className="report-icon">
          <FaFileDownload />
        </div>
        <div>
          <h3 className="report-title">Download Comprehensive Report</h3>
          <p className="report-subtitle">
            Get a detailed document of your entire ML workflow
          </p>
        </div>
      </div>

      <div className="report-content-preview">
        <h4>Report Includes:</h4>
        <ul className="report-features">
          <li>✓ Dataset overview and statistics</li>
          <li>✓ All data cleaning operations performed</li>
          <li>✓ Outlier detection and treatment details</li>
          <li>✓ Model training configuration</li>
          <li>✓ Performance metrics and evaluation</li>
          <li>✓ Feature importance analysis</li>
          <li>✓ Example predictions with results</li>
          <li>✓ AI-generated insights and recommendations</li>
        </ul>
      </div>

      <div className="report-actions">
        <div className="download-buttons">
          <button
            className="btn btn-download btn-word"
            onClick={() => downloadReport('docx')}
            disabled={downloadingDocx}
          >
            {downloadingDocx ? (
              <>
                <FaSpinner className="spin" />
                Downloading...
              </>
            ) : (
              <>
                <FaFileWord />
                Download Word
              </>
            )}
          </button>
          
          <button
            className="btn btn-download btn-pdf"
            onClick={() => downloadReport('pdf')}
            disabled={downloadingPdf}
          >
            {downloadingPdf ? (
              <>
                <FaSpinner className="spin" />
                Downloading...
              </>
            ) : (
              <>
                <FaFilePdf />
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      <div className="report-info">
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '1rem' }}>
          💡 Click a button above to instantly download your complete analysis report
        </p>
      </div>
    </div>
  );
}

export default ReportGenerator;