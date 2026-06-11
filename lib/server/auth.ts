import { SignJWT, jwtVerify } from "jose";

const encoder = new TextEncoder();

export async function issueTokens(payload: { userId: string; role: string }) {
  const accessToken = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(encoder.encode(process.env.JWT_ACCESS_SECRET ?? "dev-access-secret-change-me"));

  const refreshToken = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(encoder.encode(process.env.JWT_REFRESH_SECRET ?? "dev-refresh-secret-change-me"));

  return { accessToken, refreshToken };
}

export async function verifyAccessToken(token: string) {
  return jwtVerify(token, encoder.encode(process.env.JWT_ACCESS_SECRET ?? "dev-access-secret-change-me"));
}
