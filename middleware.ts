import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const privatePaths = ["/me", "/booked"];
const authPaths = ["/register", "/login"];

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const pathName = request.nextUrl.pathname;

  const isAuth = accessToken || refreshToken;

  // Check private - Chưa đăng nhâp thì không cho vào private path
  if (privatePaths.some((path) => pathName.startsWith(path)) && !isAuth) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check đăng nhập ( đăng nhập rồi thì không cho vào login/register)
  if (authPaths.some((path) => pathName.startsWith(path)) && isAuth) {
    return NextResponse.redirect(new URL("/me", request.url));
  }

  // ADMIN Login:đã đăng nhập vào trang admin không vào đc login
  if (pathName === "/admin/login" && isAuth) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  //Check đăng nhập: không cho vào trang admin khi chưa đăng nhập
  if (
    pathName.startsWith("/admin") &&
    pathName !== "/admin/login" &&
    !isAuth
  ) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/me", "/register", "/login", "/booked", "/admin/:path"],
};
