module.exports = {
  '*.{json,css,scss,html}': ['prettier --write', 'git add'],
  '*.js': ['eslint --fix', 'git add'],
};
