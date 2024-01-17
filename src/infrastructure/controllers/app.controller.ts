import { Controller, Get, HttpCode, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ThrottlerGuard } from "@nestjs/throttler";

@Controller({
  path: "health",
})
@ApiTags("App")
@UseGuards(ThrottlerGuard)
export class AppController {
  @Get()
  @HttpCode(200)
  check() {
    return "OK";
  }
}
