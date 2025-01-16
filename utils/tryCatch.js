const tryCatch = fn => {
  return async (req, res) => {
    try {
      await fn(req, res);
    } catch (error) {
      console.log('Error --> ', error.message);

      res.status(500).send({ message: 'Failed to fetch!' });
    }
  };
};

module.exports = { tryCatch };
