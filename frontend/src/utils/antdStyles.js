/**
 * Ant Design CSS-in-JS utilities
 * Replace Tailwind className patterns
 */

// Common spacing values (Tailwind -> px)
export const space = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
  48: 192,
  64: 256,
};

// Display utilities
export const display = {
  flex: { display: 'flex' },
  block: { display: 'block' },
  inline: { display: 'inline' },
  inlineBlock: { display: 'inline-block' },
  grid: { display: 'grid' },
  hidden: { display: 'none' },
};

// Flexbox utilities
export const flexAlign = (align = 'center') => ({
  display: 'flex',
  alignItems: align,
});

export const flexJustify = (justify = 'center') => ({
  display: 'flex',
  justifyContent: justify,
});

export const flexBetween = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

export const flexCenter = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export const flexCol = {
  display: 'flex',
  flexDirection: 'column',
};

export const flexColCenter = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
};

// Text utilities
export const textSize = {
  xs: { fontSize: '12px' },
  sm: { fontSize: '13px' },
  base: { fontSize: '14px' },
  lg: { fontSize: '16px' },
  xl: { fontSize: '18px' },
  '2xl': { fontSize: '20px' },
  '3xl': { fontSize: '24px' },
};

export const textWeight = {
  thin: { fontWeight: 100 },
  extralight: { fontWeight: 200 },
  light: { fontWeight: 300 },
  normal: { fontWeight: 400 },
  medium: { fontWeight: 500 },
  semibold: { fontWeight: 600 },
  bold: { fontWeight: 700 },
  extrabold: { fontWeight: 800 },
  black: { fontWeight: 900 },
};

// Position utilities
export const position = {
  absolute: { position: 'absolute' },
  relative: { position: 'relative' },
  fixed: { position: 'fixed' },
  sticky: { position: 'sticky' },
};

// Border radius
export const rounded = {
  none: { borderRadius: 0 },
  sm: { borderRadius: 2 },
  base: { borderRadius: 4 },
  md: { borderRadius: 6 },
  lg: { borderRadius: 8 },
  xl: { borderRadius: 12 },
  '2xl': { borderRadius: 16 },
  full: { borderRadius: '9999px' },
};

// Shadow utilities
export const shadow = {
  sm: { boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
  base: { boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' },
  md: { boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
  lg: { boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' },
  xl: { boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
};

// Common style combinations
export const styles = {
  cardBase: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  },
  
  buttonBase: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'all 0.3s ease',
  },

  inputBase: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    fontFamily: 'inherit',
  },

  containerBase: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 16px',
  },
};

/**
 * Helper to merge styles
 */
export const mergeStyles = (...styleObjects) => {
  return Object.assign({}, ...styleObjects.filter(Boolean));
};

/**
 * Helper to create responsive styles
 */
export const createResponsiveStyle = (screens) => {
  // Returns a function that can be used with media queries
  return screens;
};
