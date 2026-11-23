// CI has no use for local Git hooks, and an install without devDependencies
// has no husky to run.
if (process.env.CI) {
  process.exit(0);
}

try {
  const { default: husky } = await import('husky');
  const message = husky();

  if (message) {
    process.stdout.write(`${message}\n`);
  }
} catch (error) {
  if (error.code !== 'ERR_MODULE_NOT_FOUND') {
    throw error;
  }
}
