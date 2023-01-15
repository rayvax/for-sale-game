import { Body, Controller, Get, Post } from '@nestjs/common';
import { BidCoinsDto, BidPropertyDto, CreateGameDto, PlayerDto } from './game.dtos';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get()
  async getAllGames() {
    return this.gameService.getAllGames();
  }

  @Post('/create')
  async createNewGame(@Body() dto: CreateGameDto) {
    return this.gameService.createGame(dto);
  }

  @Post()
  async getGameState(@Body() dto: PlayerDto) {
    return this.gameService.getGameState(dto);
  }

  @Post('/bid-coins')
  async bidCoins(@Body() dto: BidCoinsDto) {
    return this.gameService.bidCoins(dto);
  }

  @Post('/pass')
  async pass(@Body() dto: PlayerDto) {
    return this.gameService.pass(dto);
  }

  @Post('/bid-property')
  async bidProperty(@Body() dto: BidPropertyDto) {
    return this.gameService.bidProperty(dto);
  }
}
