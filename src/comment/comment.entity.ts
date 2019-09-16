import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';

/**
 * Comment database table definition
 */
@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  @ApiModelProperty(
    {
        description: 'The number of comment ID',
        type: 'number',
    },
  )
  id: number;

  @Column()
  @ApiModelProperty(
    {
        description: 'The ID of the movie',
        type: 'number',
    },
  )
  movieId: number;

  @Column({ length: 500 })
  @ApiModelProperty(
    {
        description: 'The comment of the movie',
        type: 'string',
    },
  )
  comment: string;

  // @Column({ length: 20 })
  // @ApiModelProperty(
  //   {
  //       description: 'The name of the comment writer',
  //       type: 'string',
  //   },
  // )
  // commenter: string;

  @Column()
  @ApiModelProperty(
    {
        description: 'The IP address of the comment writer',
        type: 'string',
    },
  )
  ipAddress: string;

  @CreateDateColumn({ type: 'timestamptz' })
  @ApiModelProperty(
    {
        description: 'The date this comment was stored in the database',
        type: 'string',
    },
  )
  dateCreated: Date;
}
