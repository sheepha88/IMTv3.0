import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Paper,
  Alert
} from '@mui/material';
import { 
  CheckCircle, 
  Error, 
  HourglassEmpty,
  Download
} from '@mui/icons-material';

const ExportProgress = ({ 
  isExporting, 
  progress, 
  status, 
  currentStep, 
  totalSteps,
  error 
}) => {
  const getStatusIcon = () => {
    if (error) return <Error color="error" />;
    if (status === 'completed') return <CheckCircle color="success" />;
    if (isExporting) return <HourglassEmpty color="primary" />;
    return <Download color="primary" />;
  };

  const getStatusText = () => {
    if (error) return 'Export 실패';
    if (status === 'completed') return 'Export 완료';
    if (isExporting) return 'Export 진행 중...';
    return 'Export 대기 중';
  };

  const getStepText = () => {
    const steps = [
      '데이터 검증',
      'Form 생성',
      'PDF 변환',
      '파일 압축',
      '완료'
    ];
    
    if (currentStep <= totalSteps) {
      return steps[currentStep - 1] || '처리 중';
    }
    return '완료';
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {getStatusIcon()}
        <Typography variant="h6" sx={{ ml: 1 }}>
          {getStatusText()}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {isExporting && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {getStepText()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentStep} / {totalSteps}
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={(currentStep / totalSteps) * 100} 
          />
        </Box>
      )}

      {status === 'completed' && (
        <Alert severity="success">
          Export가 성공적으로 완료되었습니다. 
          다운로드 링크가 이메일로 전송됩니다.
        </Alert>
      )}
    </Paper>
  );
};

export default ExportProgress; 