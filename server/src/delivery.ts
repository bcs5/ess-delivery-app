export class Delivery {
    idOrder: string;
    statusOrder: string;
    raceValue: number;

    nameRestaurant: string;
    addressRestaurant: string;
    addressClient: string;

    constructor(delivery: Delivery) {
        this.idOrder = delivery.idOrder;
        this.statusOrder = delivery.statusOrder;
        this.raceValue = delivery.raceValue;

        this.nameRestaurant = delivery.nameRestaurant;
        this.addressRestaurant = delivery.addressRestaurant;
        this.addressClient = delivery.addressClient;
    }
}