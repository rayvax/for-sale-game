import { Body, Controller, Put, Post, Get } from '@nestjs/common';
import { CreateAccountDto, BaseLobbyDto } from './lobby.dtos';
import { LobbyService } from './lobby.service';

@Controller('lobby')
export class LobbyController {
  constructor(private lobbyService: LobbyService) {}

  //Post - because there is an issue with body in Get request
  @Post()
  getRoomState(@Body() dto: BaseLobbyDto) {
    return this.lobbyService.getRoomState(dto.token);
  }

  @Post('/account')
  createAccount(@Body() dto: CreateAccountDto) {
    return this.lobbyService.createAccount(dto);
  }

  @Put('/start')
  startGame(@Body() dto: BaseLobbyDto) {
    return this.lobbyService.startGame(dto);
  }
}
