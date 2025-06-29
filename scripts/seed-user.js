// TEMP FILE: scripts/seed-user.js
const bcrypt = require('bcrypt');
const prisma = require('../models/client');

(async () => {
  const hashed = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      username: 'admin',
      password: hashed,
    },
  });
  console.log('User created');
})();
