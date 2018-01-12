export class Event {
  id?:string;
  name: string;
  place?: string;
  description?: string;
  discipline: string;
  start: Date;
  owner: string;
  createdAt: Date;
}