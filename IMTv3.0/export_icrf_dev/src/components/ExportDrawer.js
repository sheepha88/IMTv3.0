import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Checkbox,
  Radio,
  RadioGroup,
  Button,
  Chip,
  OutlinedInput,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  ArrowBack, 
  Download, 
  Close,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import ExportProgress from './ExportProgress';

const ExportDrawer = ({ open, onClose }) => {
  // 상태 관리
  const [protocolNo, setProtocolNo] = useState('P0012');
  const [selectedSubjects, setSelectedSubjects] = useState('all');
  const [selectedVisits, setSelectedVisits] = useState(['BL', 'TP1', 'TP2']);
  const [includeForms, setIncludeForms] = useState({
    eligibility: true,
    report: true,
    adjudication: true
  });
  const [includeAuditTrail, setIncludeAuditTrail] = useState(true);
  const [fileFormat, setFileFormat] = useState('pdf');
  const [anonymizeOption, setAnonymizeOption] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps] = useState(5);
  const [exportError, setExportError] = useState(null);

  // 방문일 옵션
  const visitOptions = ['BL', 'TP1', 'TP2', 'TP3', 'TP4', 'TP5'];

  // 대상자 선택 옵션
  const subjectOptions = [
    { value: 'all', label: '전체 대상자' },
    { value: 'selected', label: '선택적 대상자' }
  ];

  // Form 포함 여부 토글
  const handleFormToggle = (formType) => {
    setIncludeForms(prev => ({
      ...prev,
      [formType]: !prev[formType]
    }));
  };

  // 방문일 선택 처리
  const handleVisitChange = (event) => {
    const value = event.target.value;
    setSelectedVisits(typeof value === 'string' ? value.split(',') : value);
  };

  // Export 실행
  const handleExport = async () => {
    setIsExporting(true);
    setExportStatus(null);
    setExportError(null);
    setCurrentStep(1);

    try {
      // 단계별 진행률 시뮬레이션
      for (let step = 1; step <= totalSteps; step++) {
        setCurrentStep(step);
        await new Promise(resolve => setTimeout(resolve, 1000)); // 각 단계별 1초 대기
      }
      
      setExportStatus({
        type: 'success',
        message: 'Export가 완료되었습니다. 다운로드 링크가 이메일로 전송됩니다.',
        downloadUrl: '#'
      });
    } catch (error) {
      setExportError('Export 중 오류가 발생했습니다. 다시 시도해주세요.');
      setExportStatus({
        type: 'error',
        message: 'Export 중 오류가 발생했습니다. 다시 시도해주세요.'
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 450,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* 헤더 */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={onClose}
            sx={{ mr: 2 }}
          >
            뒤로
          </Button>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Export 설정
          </Typography>
          <Button
            startIcon={<Close />}
            onClick={onClose}
            size="small"
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Export 진행률 */}
        {(isExporting || exportStatus || exportError) && (
          <ExportProgress
            isExporting={isExporting}
            status={exportStatus?.type}
            currentStep={currentStep}
            totalSteps={totalSteps}
            error={exportError}
          />
        )}

        {/* Export 상태 알림 */}
        {exportStatus && !isExporting && (
          <Alert 
            severity={exportStatus.type} 
            sx={{ mb: 3 }}
            action={
              exportStatus.type === 'success' && (
                <Button
                  color="inherit"
                  size="small"
                  startIcon={<Download />}
                  href={exportStatus.downloadUrl}
                >
                  다운로드
                </Button>
              )
            }
          >
            {exportStatus.message}
          </Alert>
        )}

        {/* Export 설정 폼 */}
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          {/* Protocol No. */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Protocol No.
            </Typography>
            <TextField
              fullWidth
              value={protocolNo}
              disabled
              size="small"
              sx={{ backgroundColor: '#f5f5f5' }}
            />
          </Box>

          {/* 대상자 선택 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              대상자 선택
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel>대상자 선택</InputLabel>
              <Select
                value={selectedSubjects}
                label="대상자 선택"
                onChange={(e) => setSelectedSubjects(e.target.value)}
              >
                {subjectOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* 방문일 선택 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              방문일 선택
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel>방문일 선택</InputLabel>
              <Select
                multiple
                value={selectedVisits}
                onChange={handleVisitChange}
                input={<OutlinedInput label="방문일 선택" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {visitOptions.map((visit) => (
                  <MenuItem key={visit} value={visit}>
                    {visit}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Form 포함 여부 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Form 포함 여부
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={includeForms.eligibility}
                    onChange={() => handleFormToggle('eligibility')}
                  />
                }
                label="Eligibility"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={includeForms.report}
                    onChange={() => handleFormToggle('report')}
                  />
                }
                label="Report"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={includeForms.adjudication}
                    onChange={() => handleFormToggle('adjudication')}
                  />
                }
                label="Adjudication"
              />
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Audit Trail 포함 여부 */}
          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={includeAuditTrail}
                  onChange={(e) => setIncludeAuditTrail(e.target.checked)}
                />
              }
              label="Audit Trail 포함"
            />
          </Box>

          {/* 익명화 옵션 */}
          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={anonymizeOption}
                  onChange={(e) => setAnonymizeOption(e.target.checked)}
                />
              }
              label="Reviewer 익명화 (관리자만 노출)"
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* 파일 형식 선택 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              파일 형식 선택
            </Typography>
            <RadioGroup
              value={fileFormat}
              onChange={(e) => setFileFormat(e.target.value)}
            >
              <FormControlLabel
                value="pdf"
                control={<Radio />}
                label="PDF"
              />
              <FormControlLabel
                value="zip"
                control={<Radio />}
                label="ZIP (PDF + iCRF JSON)"
              />
            </RadioGroup>
          </Box>
        </Box>

        {/* 액션 버튼 */}
        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={onClose}
              fullWidth
              disabled={isExporting}
            >
              취소
            </Button>
            <Button
              variant="contained"
              onClick={handleExport}
              disabled={isExporting}
              startIcon={isExporting ? <CircularProgress size={20} /> : <Download />}
              fullWidth
            >
              {isExporting ? 'Export 중...' : 'EXPORT'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ExportDrawer; 