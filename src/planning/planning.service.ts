// src/planning/planning.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreatePlanningDto } from './dto/create-planning.dto';
import { UpdatePlanningDto } from './dto/update-planning.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { OrderLineEntity } from 'src/orders/entities/order-line.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { PlanningEntity } from './entities/planning.entity';
import { PlanningStatus } from './enums/planning-status.enum';
import { OrderLineStatus } from 'src/orders/enums/orderline-status';

@Injectable()
export class PlanningService {
  constructor(
    @InjectRepository(PlanningEntity)
    private readonly planningRepository: Repository<PlanningEntity>,
    @InjectRepository(OrderLineEntity)
    private readonly orderLineRepository: Repository<OrderLineEntity>,
  ) {}

  async create(
    createPlanningDto: CreatePlanningDto,
    currentUser: UserEntity,
  ): Promise<PlanningEntity> {
    // Validar que la fecha de inicio sea anterior a la de finalización
    const dateFrom = new Date(createPlanningDto.dateFrom);
    const dateUntil = new Date(createPlanningDto.dateUntil);
    if (dateFrom >= dateUntil) {
      throw new BadRequestException(
        'La fecha de inicio debe ser anterior a la fecha de finalización.',
      );
    }

    // Crear la planificación en estado DRAFT
    const planning = new PlanningEntity();
    planning.createdDate = new Date();
    planning.dateFrom = dateFrom;
    planning.dateUntil = dateUntil;
    planning.status = PlanningStatus.DRAFT;
    planning.addedBy = currentUser;

    if (
      !createPlanningDto.orderLineIds ||
      createPlanningDto.orderLineIds.length === 0
    ) {
      throw new BadRequestException(
        'No se han proporcionado IDs de orderlines para incluir.',
      );
    }

    const orderLines = await this.orderLineRepository.find({
      where: { id: In(createPlanningDto.orderLineIds) },
    });


    // Validar que cada orderline esté en estado PENDING y no esté asignada a otra planificación
    for (const orderLine of orderLines) {
      if (orderLine.planning) {
        throw new BadRequestException(
          `La orderline ${orderLine.id} ya está asignada a una planificación.`,
        );
      }
      if (orderLine.productionStatus !== OrderLineStatus.PENDING) {
        throw new BadRequestException(
          `La orderline ${orderLine.id} no se encuentra en estado PENDING y no puede ser planificada.`,
        );
      }
    }

    // Reordenar las orderlines según el arreglo recibido en el DTO
    const orderedOrderLines: OrderLineEntity[] = [];
    createPlanningDto.orderLineIds.forEach((id, index) => {
      const orderLine = orderLines.find(line => line.id === id);
      // Asignar la secuencia según el orden en el DTO
      orderLine.sequence = index;
      // Actualizar el estado a PLANNED
      orderLine.productionStatus = OrderLineStatus.PLANNED;
      orderedOrderLines.push(orderLine);
    });

    // Asignar las orderlines a la planificación y actualizarla
    planning.orderLines = orderLines;
    const savedPlanning = await this.planningRepository.save(planning);

    return await this.findOne(savedPlanning.id);
  }

  findAll() {
    return `This action returns all planning`;
  }

  async findOne(id: number): Promise<PlanningEntity> {
    const planning = await this.planningRepository.findOne({
      where: { id },
      relations: { orderLines: true, addedBy: true },
      select: { addedBy: { email: true, firstName: true, lastName: true } },
      order: {
        orderLines: { sequence: 'ASC' },
      },
    });

    if (!planning) throw new NotFoundException({
      code: 'PLANNING_NOT_FOUND',
      message: 'Planning not found',
    })

    return planning;
  }
  

  async update(id: number, updatePlanningDto: UpdatePlanningDto): Promise<PlanningEntity> {
    // Recuperar la planificación con sus orderlines
    const planning = await this.findOne(id)

    // Solo se permiten modificaciones si la planificación está en estado DRAFT
    if (planning.status !== PlanningStatus.DRAFT) {
      throw new BadRequestException('No se pueden modificar planificaciones ya aceptadas o finalizadas.');
    }

    // Actualizar fechas si se proporcionan y validarlas
    if (planning.dateFrom && planning.dateUntil && planning.dateFrom >= planning.dateUntil) {
      throw new BadRequestException('La fecha de inicio debe ser anterior a la fecha de finalización.');
    }
    if (updatePlanningDto.dateFrom) {
      planning.dateFrom = new Date(updatePlanningDto.dateFrom);
    }
    if (updatePlanningDto.dateUntil) {
      planning.dateUntil = new Date(updatePlanningDto.dateUntil);
    }

    // Si se envían nuevos orderLineIds, se actualiza la lista de orderlines de la planificación
    if (updatePlanningDto.orderLineIds) {
      const newOrderLineIds: number[] = updatePlanningDto.orderLineIds;

      // Recuperar todas las orderlines correspondientes al arreglo recibido
      const newOrderLines = await this.orderLineRepository.find({
        where: { id: In(newOrderLineIds) },
        relations: { planning: true },
      });


      // Validar que se hayan encontrado todas las orderlines
      if (newOrderLines.length !== newOrderLineIds.length) {
        throw new BadRequestException('Alguna orderline no se encontró en la base de datos.');
      }

      // Para cada orderline, validar que esté en estado PENDING o ya pertenezca a esta planificación
      for (const orderLine of newOrderLines) {
        if (orderLine.planning && orderLine.planning.id !== planning.id) {
          throw new BadRequestException(`La orderline ${orderLine.id} ya está asignada a otra planificación.`);
        }
        if (orderLine.productionStatus !== OrderLineStatus.PENDING && orderLine.planning?.id !== planning.id) {
          throw new BadRequestException(`La orderline ${orderLine.id} no se encuentra en estado PENDING y no puede ser planificada.`);
        }
      }

      console.log("test");

      // Identificar las orderlines a eliminar: las que actualmente están en la planificación pero no aparecen en el nuevo arreglo
      const orderLinesToRemove = planning.orderLines.filter(ol => !newOrderLineIds.includes(ol.id));

      for (const orderLine of orderLinesToRemove) {
        // Remover la planificación y resetear su estado y secuencia
        orderLine.planning = null;
        orderLine.productionStatus = OrderLineStatus.PENDING;
        orderLine.sequence = null;
        await this.orderLineRepository.save(orderLine);
      }

      // Reordenar y asignar las orderlines según el nuevo arreglo
      const orderedOrderLines: OrderLineEntity[] = [];
      newOrderLineIds.forEach((id, index) => {
        // Puede venir de las orderlines ya asignadas o de las nuevas recuperadas
        const orderLine = newOrderLines.find(line => line.id === id) ||
                          planning.orderLines.find(line => line.id === id);
        if (!orderLine) {
          throw new BadRequestException(`La orderline con id ${id} no se encontró.`);
        }
        orderLine.sequence = index;
        orderLine.productionStatus = OrderLineStatus.PLANNED;
        orderLine.planning = planning;
        orderedOrderLines.push(orderLine);
      });

      // Asignar la nueva lista ordenada a la planificación
      planning.orderLines = orderedOrderLines;
      await this.orderLineRepository.save(orderedOrderLines);
    }

    // Guardar la planificación actualizada
    const updatedPlanning = await this.planningRepository.save(planning);
    return await this.findOne(updatedPlanning.id);
  }


  remove(id: number) {
    return `This action removes a #${id} planning`;
  }
}
