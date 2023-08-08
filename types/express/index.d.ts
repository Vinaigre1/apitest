import { JwtPayload } from "jsonwebtoken";
import { ApiResponse } from "../../src/types";

declare global {
  namespace Express {
    export interface Request {
      user?: string | JwtPayload;
    }

    export interface Response {
      sendJson(): Response;
      response: ApiResponse;
    }
  }
}
