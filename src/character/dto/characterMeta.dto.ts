import { HeightMeta } from './heightMeta.dto';
import { ApiModelProperty } from '@nestjs/swagger';

/**
 * Character meta Data Transfer Object
 */
export class Meta {
    @ApiModelProperty(
        {
            description: 'The total number of characters',
            type: 'number',
        },
    )
    readonly total: number;
    @ApiModelProperty(
        {
            description: 'Height metadata',
            type: HeightMeta,
        },
    )
    readonly totalHeight: HeightMeta;
}
