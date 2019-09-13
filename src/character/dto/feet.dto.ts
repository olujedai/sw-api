import { ApiModelProperty } from '@nestjs/swagger';

export class FeetDto {
    @ApiModelProperty(
        {
            description: 'Feet',
            type: 'number',
        },
    )
    readonly feet: number;
    @ApiModelProperty(
        {
            description: 'Inches',
            type: 'number',
        },
    )
    readonly inches: number;
}
