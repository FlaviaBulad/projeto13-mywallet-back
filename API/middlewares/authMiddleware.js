import db from "../db.js";

export async function userSession(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer", "").trim();

  if (!token) {
    return res.status(401).send("Token not found.");
  }

  try {
    const session = await db.collection("sessions").findOne({ token });

    if (!session) {
      return res.status(401).send("Session not found.");
    }

    const user = await db.collection("users").findOne({ _id: session.userId });
    if (!user) return res.status(401).send("User not found.");

    res.locals.user = user;
    next();
  } catch (error) {
    console.log("Erro ao tentar obter usuário através da sessão");
    console.log(error);
    return res.sendStatus(500);
  }
}
