import { Module } from '@nestjs/common';
import { GameModule } from './game/game.module';
import { RoomModule } from './room/room.module';
import { LobbyModule } from './account/lobby.module';

@Module({
  imports: [GameModule, RoomModule, LobbyModule],
})
export class AppModule {}
