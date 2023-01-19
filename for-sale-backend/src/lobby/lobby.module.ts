import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils';
import { GameModule } from 'src/game/game.module';
import { LobbyController } from './lobby.controller';
import { LobbyService } from './lobby.service';

@Module({
  controllers: [LobbyController],
  providers: [LobbyService],
  exports: [LobbyService],
  imports: [forwardRef(() => GameModule)],
})
export class LobbyModule {}
