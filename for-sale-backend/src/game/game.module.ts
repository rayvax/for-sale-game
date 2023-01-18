import { forwardRef, Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { LobbyModule } from 'src/account/lobby.module';

@Module({
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
  imports: [LobbyModule],
})
export class GameModule {}
