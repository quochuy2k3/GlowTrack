export interface StepSchema {
  step_order: number;
  step_name: string;
}

export interface SessionSchema {
  time: string;
  status: string;
  steps: StepSchema[];
}

export interface DaySchema {
  day_of_week: string;
  sessions?: SessionSchema[];
}

export interface DayResponseSchema {
  routine_name: string;
  today: DaySchema;
}

export interface RoutineSchema {
  routine_name: string;
  push_token?: string;
  days: DaySchema[];
}

export interface RoutineUpdateSchema {
  routine_name?: string;
  push_token?: string;
  days?: DaySchema[];
}
export interface RoutineTodayResponse {
  routine_name: string;
  today: DaySchema;
}
