import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {

    @ApiProperty({
        description: 'Permite establecer la cantidad de registro que se desea traer por peticion.'
    })
    @IsOptional()
    @IsPositive()
    @Type( () => Number ) // enableImplicitConversions: true
    limit?: number;
    
    @ApiProperty({
        description: 'Permite saltar la cantidad de registros para obtener los siguientes registros.'
    })
    @IsOptional()
    @Min(0)
    @Type( () => Number ) // enableImplicitConversions: true
    offset?: number;

}