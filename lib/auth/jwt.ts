import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const VALIDATED_SECRET: string = JWT_SECRET;

export function verifyJwtToken(token: string): Promise<JwtPayload | null> {
  return new Promise((resolve) => {
    jwt.verify(token, VALIDATED_SECRET, (err, decoded) => {
      if (err) {
        return resolve(null);
      }
      resolve(decoded as JwtPayload);
    });
  });
}

export function generateToken(payload: Record<string, any>): string {
  return jwt.sign(payload, VALIDATED_SECRET, { expiresIn: "24h" });
}
