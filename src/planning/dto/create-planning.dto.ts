import { IsDate, IsNotEmpty } from "class-validator";

// src/planning/dto/create-planning.dto.ts
export class CreatePlanningDto {

    @IsNotEmpty()
    @IsDate()
    dateFrom: Date;

    @IsDate()
    @IsNotEmpty()
    dateUntil: Date;

    @IsNotEmpty()
    orderLineIds?: number[]; // Opcional: lista de IDs de OrderLines a incluir
  }
  