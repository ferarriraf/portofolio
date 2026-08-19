import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Tout sauf les fichiers statiques, les internes Next et les routes API
  matcher: "/((?!api|og|_next|_vercel|.*\\..*).*)",
};
