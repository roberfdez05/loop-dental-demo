export interface MetricSeries {
  key: string;
  label: string;
  unit: "count" | "percent" | "eur" | "minutes";
  values: number[];
  /** Si el valor sube o baja para que se lea como una mejora. */
  goodDirection: "up" | "down";
}

/** Series ficticias de los últimos 7 días, usadas solo para los sparklines del panel. */
export const SEED_METRICS: MetricSeries[] = [
  {
    key: "conversaciones",
    label: "Conversaciones",
    unit: "count",
    values: [18, 22, 19, 25, 28, 24, 31],
    goodDirection: "up",
  },
  {
    key: "citas",
    label: "Citas",
    unit: "count",
    values: [3, 4, 3, 5, 6, 5, 7],
    goodDirection: "up",
  },
  {
    key: "conversion",
    label: "Conversión",
    unit: "percent",
    values: [22, 25, 21, 28, 30, 27, 34],
    goodDirection: "up",
  },
  {
    key: "ingresos",
    label: "Ingresos recuperados",
    unit: "eur",
    values: [1200, 1800, 1400, 2200, 2600, 2100, 3200],
    goodDirection: "up",
  },
  {
    key: "tiempoRespuesta",
    label: "Tiempo medio de respuesta",
    unit: "minutes",
    values: [6, 5, 5, 4, 4, 3, 3],
    goodDirection: "down",
  },
];

export const AVG_RESPONSE_TIME_MINUTES = 3;
