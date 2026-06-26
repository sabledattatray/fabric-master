import https from 'https';
import fs from 'fs';

const file = fs.createWriteStream("public/og-image.jpg");
https.get("https://avatars.githubusercontent.com/u/sabledattatray?v=4", function(response) {
  response.pipe(file);
});
