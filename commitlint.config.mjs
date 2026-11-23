export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-case': [2, 'always', 'lower-case'],
    // Wrapping the body is a matter of style; long URLs and stack traces in a
    // body or footer are legitimate and should not block a commit.
    'body-max-line-length': [0],
    'footer-max-line-length': [0],
  },
};
