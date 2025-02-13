export enum PlanningStatus {
    DRAFT = 'draft',       // Planificación en proceso, modificable
    ACCEPTED = 'accepted', // Planificación aceptada, no se pueden agregar nuevas orderlines
    FINALIZED = 'finalized' // (Opcional) Planificación impresa/enviada a planta
  }
  