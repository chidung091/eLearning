import { ApiProperty } from '@nestjs/swagger'
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsString,
  Min,
} from 'class-validator'
import { QuestionType } from '../question.enum'
import { Answer } from '../entity/question.entity'

export class CreateQuestion {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  question: string

  @ApiProperty()
  @IsEnum(QuestionType)
  @IsNotEmpty()
  questionType: QuestionType

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  answer: Answer

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Min(0)
  correctAnswer: string
}