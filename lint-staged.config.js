module.exports = {
  '**/*.{js,json}': ['prettier --write'],
  '**/*.js': ['eslint', 'jest --findRelatedTests'],
}
