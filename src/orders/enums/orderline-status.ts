export enum OrderLineStatus {
    PENDING = 'pending',               // Creada, sin asignar a producción
    PLANNED = 'planned',               // Asignada a una planificación
    READY_FOR_PICKUP = 'ready_for_pickup' // Finalizada en planta y lista para el retiro
  }
  