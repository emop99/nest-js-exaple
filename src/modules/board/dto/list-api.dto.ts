import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { ListSearchKey } from '../interface/list.interface';

export class ListApiDto {
  @ApiProperty({
    description: '검색 키워드',
    required: false,
  })
  @IsString()
  searchText?: string;

  @ApiProperty({
    description: '검색 키',
    required: false,
  })
  @IsEnum(ListSearchKey)
  searchKey?: ListSearchKey;
}
