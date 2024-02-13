import { Injectable } from '@nestjs/common';
import { Role } from 'src/auth/enum/role.enum';
import { PrismaService } from 'src/prisma.service';
import { LocusDto, LocusPrismaType } from './dto/locus.dto';

@Injectable()
export class LocusService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number, pageSize: number, userRole: Role, assemblyId?: string, id?: number, regionId?: number): Promise<LocusDto[]> {
    switch (userRole) {
      case Role.Admin:
        return this.getAllForAdmin(page, pageSize, assemblyId, id, regionId);
      case Role.Normal:
        return this.getAllForNormal(page, pageSize, assemblyId, id, regionId)
      default:
        return this.getAllForLimited(page, pageSize, regionId);
    }
  }

  private async getAllForLimited(page: number, pageSize: number, regionId?: number): Promise<LocusDto[]> {
    const skip = (page - 1) * pageSize;
    const take = +pageSize;

    let include = {};
    let where = {};

    const regionsId = [41419025, 41412159]

    const locusMembers = await this.prisma.rnc_locus_members.findMany({
      where: {
        region_id: {
          in: regionsId
        },
      },
      select: {
        locus_id: true,
      },
    });

    const locusIds = locusMembers.map((member) => member.locus_id);
    
    where = {
      ...where,
      id: {
        in: locusIds
      }
    }

    const data = await this.prisma.rnc_locus.findMany({
      skip,
      take,
      include: { ...include, locus_members: false },
      where,
    });
    
    return data.map(this.mapLocusToDto);
  }

  private async getAllForNormal(
    page: number, 
    pageSize: number, 
    assemblyId?: string, 
    id?: number, 
    regionId?: number
  ): Promise<LocusDto[]> {
    let include = {};
    let where = {};

    const skip = (page - 1) * pageSize;
    const take = +pageSize;

    if (id !== undefined) {
      where = { ...where, id: +id };
    }

    if (assemblyId !== undefined) {
      where = { ...where, assembly_id: assemblyId };
    }

    if (regionId !== undefined) {
      const locusMembers = await this.prisma.rnc_locus_members.findMany({
        where: {
          region_id: +regionId,
        },
        select: {
          locus_id: true,
        },
      });
    
      const locusIds = locusMembers.map((member) => member.locus_id);

      where = {
        ...where,
        id: {
          in: locusIds,
        },
      };
    }

    const data = await this.prisma.rnc_locus.findMany({
      skip,
      take,
      include: { ...include, locus_members: false },
      where,
    });

    return data.map(this.mapLocusToDto);
  }

  private async getAllForAdmin(
    page: number, 
    pageSize: number, 
    assemblyId?: string, 
    id?: number, 
    regionId?: number
  ): Promise<LocusDto[]> {
    let include = {};
    let where = {};

    const skip = (page - 1) * pageSize;
    const take = +pageSize;

    if (id !== undefined) {
      where = { ...where, id: +id };
    }

    if (assemblyId !== undefined) {
      where = { ...where, assembly_id: assemblyId };
    }

    if (regionId !== undefined) {
      const locusMembers = await this.prisma.rnc_locus_members.findMany({
        where: {
          region_id: +regionId,
        },
        select: {
          locus_id: true,
        },
      });
    
      const locusIds = locusMembers.map((member) => member.locus_id);

      where = {
        ...where,
        id: {
          in: locusIds,
        },
      };
    }

    const data = await this.prisma.rnc_locus.findMany({
      skip,
      take,
      include: { ...include, locus_members: true },
      where,
    });

    return data.map(this.mapLocusToDto);
  }

  private mapLocusToDto(locus: LocusPrismaType): LocusDto {
    return {
      id: locus.id,
      assemblyId: locus.assembly_id,
      locusName: locus.locus_name,
      publicLocusName: locus.public_locus_name,
      chromosome: locus.chromosome,
      strand: locus.strand,
      locusStart: locus.locus_start,
      locusStop: locus.locus_stop,
      memberCount: locus.member_count,
      locusMembers: locus.locus_members?.map((member) => ({
        id: member.id,
        ursTaxid: member.urs_taxid,
        regionId: member.region_id,
        membershipStatus: member.membership_status,
      })) || [],
    };
  }
}
