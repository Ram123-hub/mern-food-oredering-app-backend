import { Request, Response, NextFunction } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import jwt from "jsonwebtoken";
import User from "../models/user";

declare global {
  namespace Express {
    interface Request {
      userId: string;
      auth0Id: string;
    }
  }
}

export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.ATUH0_ISSUER_BASE_URL,
  tokenSigningAlg: "RS256",
});

// Here we taking a user id fron database
export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  // Bearer lsdglkgnfkingergiinrgsl
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.sendStatus(401);
  }

  // Get the token from authorization string
  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    const auth0Id = decoded.sub;

    const user = await User.findOne({ auth0Id });

    if (!user) {
      return res.sendStatus(401);
    }

    req.auth0Id = auth0Id as string;
    if (user._id) {
      req.userId = user._id.toString();
      next();
    } else {
      return res.sendStatus(401);
    }
    next();
  } catch (error) {
    return res.sendStatus(401);
  }
};
