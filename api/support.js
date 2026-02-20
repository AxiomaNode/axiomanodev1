return res.status(200).json({
  hasUser: !!process.env.EMAIL_USER,
  hasPass: !!process.env.EMAIL_PASS,
  hasTo: !!process.env.EMAIL_TO,
});