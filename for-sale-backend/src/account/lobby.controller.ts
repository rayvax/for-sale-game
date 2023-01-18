import { Body, Controller, Put, Post } from '@nestjs/common';
import { CreateAccountDto, StartGameInRoomDto } from './lobby.dtos';
import { LobbyService } from './lobby.service';

@Controller('lobby')
export class LobbyController {
  constructor(private lobbyService: LobbyService) {}

  @Post('/account')
  createAccount(@Body() dto: CreateAccountDto) {
    return this.lobbyService.createAccount(dto);
  }

  @Put('/start')
  startGame(@Body() dto: StartGameInRoomDto) {
    return this.lobbyService.startGame(dto);
  }
}
