const fs = require('fs');

// Cloudflare Workers CI builds in /opt/buildhome/repo
if (process.env.CI || process.cwd().includes('buildhome') || process.env.CF_PAGES === '1') {
  try {
    if (fs.existsSync('.git')) {
      fs.rmSync('.git', { recursive: true, force: true });
      console.log('[CI BUILD] Successfully removed .git to prevent 25MB asset limit error');
    }
  } catch (err) {
    console.error('Cleanup warning:', err.message);
  }
}
