import { Module } from '@nestjs/common';
import { GameModule } from './game/game.module';
import { LobbyModule } from './account/lobby.module';

@Module({
  imports: [GameModule, LobbyModule],
})
export class AppModule {}
