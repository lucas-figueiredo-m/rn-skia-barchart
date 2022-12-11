export const data = [
  {
    period: '7d',
    data: Array(7)
      .fill(0)
      .map(() => Math.random() * 100),
  },
  {
    period: '5w',
    data: Array(5)
      .fill(0)
      .map(() => Math.random() * 100),
  },
  {
    period: '12m',
    data: Array(12)
      .fill(0)
      .map(() => Math.random() * 100),
  },
];

export type DataType = {
  period: string;
  data: number[];
};
