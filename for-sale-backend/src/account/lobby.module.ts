import { Module } from '@nestjs/common';
import { GameService } from 'src/game/game.service';
import { LobbyController } from './lobby.controller';
import { LobbyService } from './lobby.service';

@Module({
  controllers: [LobbyController],
  providers: [LobbyService, GameService],
})
export class LobbyModule {}
