import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Download,
  Visibility,
  Delete,
  Refresh,
  History
} from '@mui/icons-material';

const ExportHistory = ({ open, onClose }) => {
  const [exportHistory, setExportHistory] = useState([]);
  const [selectedExport, setSelectedExport] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Mock 데이터
  useEffect(() => {
    const mockHistory = [
      {
        id: 1,
        fileName: 'P0012_S001_BL_AnnotatedICRF_20250730.pdf',
        protocolNo: 'P0012',
        subjectId: 'S001',
        visitName: 'BL',
        fileFormat: 'PDF',
        exportDate: '2025-07-30 14:30:00',
        status: 'completed',
        fileSize: '2.5MB',
        downloadUrl: '#'
      },
      {
        id: 2,
        fileName: 'P0012_All_TP1_AnnotatedICRF_20250729.zip',
        protocolNo: 'P0012',
        subjectId: 'All',
        visitName: 'TP1',
        fileFormat: 'ZIP',
        exportDate: '2025-07-29 16:45:00',
        status: 'completed',
        fileSize: '15.2MB',
        downloadUrl: '#'
      },
      {
        id: 3,
        fileName: 'P0012_S002_TP2_AnnotatedICRF_20250728.pdf',
        protocolNo: 'P0012',
        subjectId: 'S002',
        visitName: 'TP2',
        fileFormat: 'PDF',
        exportDate: '2025-07-28 09:15:00',
        status: 'failed',
        fileSize: '-',
        downloadUrl: null
      }
    ];
    setExportHistory(mockHistory);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'processing':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return '완료';
      case 'processing':
        return '처리중';
      case 'failed':
        return '실패';
      default:
        return '알 수 없음';
    }
  };

  const handleViewDetails = (exportItem) => {
    setSelectedExport(exportItem);
    setDetailDialogOpen(true);
  };

  const handleDownload = (downloadUrl) => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
  };

  const handleDelete = (id) => {
    setExportHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <History />
          Export 이력
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            총 {exportHistory.length}개의 Export 이력
          </Typography>
          <Button
            startIcon={<Refresh />}
            size="small"
            onClick={() => window.location.reload()}
          >
            새로고침
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>파일명</TableCell>
                <TableCell>Protocol</TableCell>
                <TableCell>대상자</TableCell>
                <TableCell>방문일</TableCell>
                <TableCell>형식</TableCell>
                <TableCell>상태</TableCell>
                <TableCell>크기</TableCell>
                <TableCell>Export 일시</TableCell>
                <TableCell>액션</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exportHistory.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell sx={{ maxWidth: 200 }}>
                    <Typography variant="body2" noWrap>
                      {row.fileName}
                    </Typography>
                  </TableCell>
                  <TableCell>{row.protocolNo}</TableCell>
                  <TableCell>{row.subjectId}</TableCell>
                  <TableCell>{row.visitName}</TableCell>
                  <TableCell>
                    <Chip 
                      label={row.fileFormat} 
                      size="small" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(row.status)}
                      color={getStatusColor(row.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{row.fileSize}</TableCell>
                  <TableCell>{row.exportDate}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="상세보기">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(row)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      {row.downloadUrl && (
                        <Tooltip title="다운로드">
                          <IconButton
                            size="small"
                            onClick={() => handleDownload(row.downloadUrl)}
                          >
                            <Download />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="삭제">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(row.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>닫기</Button>
      </DialogActions>

      {/* 상세 정보 다이얼로그 */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Export 상세 정보</DialogTitle>
        <DialogContent>
          {selectedExport && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  파일명
                </Typography>
                <Typography variant="body1">{selectedExport.fileName}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Protocol No.
                  </Typography>
                  <Typography variant="body1">{selectedExport.protocolNo}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    대상자
                  </Typography>
                  <Typography variant="body1">{selectedExport.subjectId}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    방문일
                  </Typography>
                  <Typography variant="body1">{selectedExport.visitName}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    파일 형식
                  </Typography>
                  <Typography variant="body1">{selectedExport.fileFormat}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    파일 크기
                  </Typography>
                  <Typography variant="body1">{selectedExport.fileSize}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    상태
                  </Typography>
                  <Chip
                    label={getStatusText(selectedExport.status)}
                    color={getStatusColor(selectedExport.status)}
                    size="small"
                  />
                </Box>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Export 일시
                </Typography>
                <Typography variant="body1">{selectedExport.exportDate}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {selectedExport?.downloadUrl && (
            <Button
              startIcon={<Download />}
              onClick={() => handleDownload(selectedExport.downloadUrl)}
            >
              다운로드
            </Button>
          )}
          <Button onClick={() => setDetailDialogOpen(false)}>닫기</Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default ExportHistory; 