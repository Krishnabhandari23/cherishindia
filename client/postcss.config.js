let plugins = {};

// Try to load Tailwind CSS, use fallback if not available
try {
  require.resolve('tailwindcss');
  plugins.tailwindcss = {};
} catch (e) {
  console.warn('Tailwind CSS not found, skipping...');
}

// Try to load Autoprefixer
try {
  require.resolve('autoprefixer');
  plugins.autoprefixer = {};
} catch (e) {
  console.warn('Autoprefixer not found, skipping...');
}

export default {
  plugins
}
