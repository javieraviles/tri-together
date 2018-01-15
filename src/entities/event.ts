export class Event {
  id?:string;
  name: string;
  place?: string;
  description?: string;
  discipline: string;
  start: Date;
  owner: string;
  numberOfComments: number;
  numberOfParticipants: number;
  imageURL: string;
  participate?: boolean;
  createdAt: Date;
}