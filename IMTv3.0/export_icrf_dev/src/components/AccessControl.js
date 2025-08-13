import React from 'react';
import { Alert, Box, Typography } from '@mui/material';
import { Security } from '@mui/icons-material';

const AccessControl = ({ userRole, protocolNo }) => {
  // 사용자 역할에 따른 권한 확인
  const hasExportPermission = () => {
    const allowedRoles = ['admin', 'builder', 'dm', 'reviewer'];
    return allowedRoles.includes(userRole);
  };

  const canExportAllSubjects = () => {
    const fullAccessRoles = ['admin', 'builder', 'dm'];
    return fullAccessRoles.includes(userRole);
  };

  const canAnonymize = () => {
    return userRole === 'admin';
  };

  if (!hasExportPermission()) {
    return (
      <Alert severity="error" icon={<Security />}>
        <Typography variant="body2">
          Export 기능에 대한 접근 권한이 없습니다.
          관리자에게 문의하세요.
        </Typography>
      </Alert>
    );
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Alert severity="info" icon={<Security />}>
        <Typography variant="body2">
          현재 역할: {userRole.toUpperCase()}
          {!canExportAllSubjects() && (
            <br />
            <strong>제한사항:</strong> 본인 관련 데이터만 조회 가능
          )}
        </Typography>
      </Alert>
    </Box>
  );
};

export default AccessControl; 