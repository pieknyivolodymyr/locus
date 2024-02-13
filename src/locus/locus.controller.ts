import { Controller, Get, Query, Request } from '@nestjs/common';
import { LocusService } from './locus.service';
import { Role } from 'src/auth/enum/role.enum';
import { handleDecodeToken } from 'src/auth/jwt/jwt.token';

@Controller('locus')
export class LocusController {
  constructor(private readonly locusService: LocusService) {}

  @Get()
  async getAll(
    @Query('page') page: number = 1, 
    @Query('pageSize') pageSize: number = 1000, 
    @Query('assemblyId') assemblyId: string,
    @Query('id') id: number,
    @Query('regionId') regionId: number,
    @Request() req) {

    const token = handleDecodeToken(req)
    const userRole: Role = token.role;
    
    return this.locusService.findAll(
      page, 
      pageSize, 
      userRole,
      assemblyId,
      id,
      regionId,
    );
  }
}
