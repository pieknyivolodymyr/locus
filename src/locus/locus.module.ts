import { Module } from '@nestjs/common';
import { LocusService } from './locus.service';
import { LocusController } from './locus.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [LocusController],
  providers: [LocusService, PrismaService],
})
export class LocusModule {}
