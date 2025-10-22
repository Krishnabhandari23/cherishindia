let plugins = {};

// Try to load Tailwind CSS
try {
  require.resolve('tailwindcss');
  plugins.tailwindcss = {};
  console.log('✅ Tailwind CSS loaded');
} catch (e) {
  console.warn('⚠️  Tailwind CSS not found, skipping...');
}

// Try to load Autoprefixer
try {
  require.resolve('autoprefixer');
  plugins.autoprefixer = {};
  console.log('✅ Autoprefixer loaded');
} catch (e) {
  console.warn('⚠️  Autoprefixer not found, skipping...');
}

export default {
  plugins
}
