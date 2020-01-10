import { appConfig } from '../common/app.config';
import { env } from '../environment/env';

export const authEndHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Authentication finished</title>
</head>
<script>
  opener.postMessage('${appConfig.authEndMessage}', '${env.publicOrigin}')
</script>
<body>
</body>
</html>`;
