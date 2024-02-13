import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LocusModule } from './locus/locus.module';

@Module({
  imports: [LocusModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
