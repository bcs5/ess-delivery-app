import { Delivery } from "./delivery";

export class Deliveryman {
  //personal information
  name: string;
  email: string;
  password: string;
  phoneNumber: number;
  cnh: number;
  birthDate: [number, number, number];
  address: string;

  //company information
  id: string;
  wallet: number;
  delivery: Delivery[];
  coordinates: [number, number];

  constructor(deliveryman: Deliveryman) {
    this.name = deliveryman.name;
    this.email = deliveryman.email;
    this.password = deliveryman.password;
    this.phoneNumber = deliveryman.phoneNumber;
    this.cnh = deliveryman.cnh;
    this.birthDate = deliveryman.birthDate;
    this.address = deliveryman.address;

    this.id = deliveryman.id;
    this.wallet = deliveryman.wallet;
    this.delivery = deliveryman.delivery;
    this.coordinates = deliveryman.coordinates;
  }

}