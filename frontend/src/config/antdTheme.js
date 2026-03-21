import { theme } from 'antd';

export const antdTheme = {
  token: {
    colorPrimary: '#3b82f6',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#0ea5e9',
    borderRadius: 8,
    fontSize: 14,
    fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    fontFamilyCode: '"Outfit", sans-serif',
    
    // Spacing
    margin: 16,
    marginXS: 8,
    marginSM: 12,
    marginLG: 24,
    marginXL: 32,
    
    padding: 16,
    paddingXS: 8,
    paddingSM: 12,
    paddingLG: 24,
    paddingXL: 32,
    
    // Colors
    colorBgBase: '#f8fafc',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#f1f5f9',
    colorBorder: '#e2e8f0',
    colorText: '#0f172a',
    colorTextSecondary: '#64748b',
    colorTextTertiary: '#94a3b8',
    colorTextDisabled: '#cbd5e1',
    
    // Shadows
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    boxShadowSecondary: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  algorithm: theme.defaultAlgorithm,
  components: {
    Button: {
      controlHeight: 40,
      fontWeight: 500,
      borderRadius: 8,
    },
    Input: {
      controlHeight: 40,
      borderRadius: 8,
      fontSize: 14,
    },
    Select: {
      controlHeight: 40,
      borderRadius: 8,
    },
    Table: {
      borderRadius: 8,
      fontSize: 13,
    },
    Card: {
      borderRadiusLG: 8,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    },
    Form: {
      labelFontSize: 14,
      labelColor: '#0f172a',
    },
    Modal: {
      borderRadiusLG: 12,
      borderRadius: 8,
    },
  },
};

export default antdTheme;
