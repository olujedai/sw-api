import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  movieId: number;

  @Column({ length: 500 })
  comment: string;

  @Column({ length: 20 })
  commenter: string;

  @Column()
  ipAddress: string;

  @CreateDateColumn({ type: 'timestamptz' })
  dateCreated: Date;
}
