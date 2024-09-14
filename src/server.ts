import app from './app';

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Chef Service is running on port ${PORT}`);
});
