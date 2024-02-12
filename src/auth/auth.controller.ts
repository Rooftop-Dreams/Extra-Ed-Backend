import { Controller, Get, UseGuards, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request } from "express";
import { GoogleGuard } from "./guards/google.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GoogleGuard)
  @Get("google/login")
  handlerLogin() {
    return this.authService.handlerLogin();
  }

  @UseGuards(GoogleGuard)
  @Get("google/redirect")
  handlerRedirect() {
    return this.authService.handlerRedirect();
  }

  @Get("status")
  user(@Req() req: Request) {
    if (req.user) {
      return { message: "Authenticated", user: req.user };
    } else {
      return { message: "Not Authenticated" };
    }
  }
}
