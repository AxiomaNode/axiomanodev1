export default async function handler(req, res) {
  return res.status(200).json({
    ok: true,
    marker: "SUPPORT_API_V1",
    method: req.method,
    hasUser: !!process.env.EMAIL_USER,
    hasPass: !!process.env.EMAIL_PASS,
    hasTo: !!process.env.EMAIL_TO,
  });
}