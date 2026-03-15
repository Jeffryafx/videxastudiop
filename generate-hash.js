import bcrypt from 'bcryptjs';

const password = 'VidexaStudio2026';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error:', err);
    process.exit(1);
  }
  console.log('Hash para VidexaStudio2026:');
  console.log(hash);
  process.exit(0);
});
