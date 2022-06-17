import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CourseDocument = Course & Document;

@Schema()
export class Course {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  link: string;

  @Prop({ required: true })
  imagen: string;

  @Prop({ required: false })
  price: number;

  @Prop({ required: false })
  description: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
