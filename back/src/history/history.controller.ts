import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HistoryService } from './history.service';
import { CreateSearchDto } from './dto/create-search.dto';

@Controller('history')
@UseGuards(JwtAuthGuard)
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get('searches')
  list(@CurrentUser() user: { sub: string; email: string }) {
    return this.historyService.listForUser(user.sub);
  }

  @Post('searches')
  record(@CurrentUser() user: { sub: string; email: string }, @Body() dto: CreateSearchDto) {
    return this.historyService.recordSearch(user.sub, dto);
  }
}
