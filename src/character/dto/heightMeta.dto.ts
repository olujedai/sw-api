import { ApiModelProperty } from '@nestjs/swagger';
import { FeetDto } from './feet.dto';

/**
 * Data Transfer Object for describing the height field in the character metadata
 */
export class HeightMeta {
    @ApiModelProperty(
        {
            description: 'Height in centimeters',
            type: 'number',
        },
    )
    readonly cm: string;
    @ApiModelProperty(
        {
            description: 'Height in feet',
            type: FeetDto,
        },
    )
    readonly feet: FeetDto;
}
