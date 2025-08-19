import { Entity, Column, ObjectIdColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('products')
export class ProductEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ unique: true })
  contentfulId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  price?: number;

  @Column({ nullable: true })
  category?: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt?: Date;

  get id(): string {
    return this._id.toHexString();
  }
}
