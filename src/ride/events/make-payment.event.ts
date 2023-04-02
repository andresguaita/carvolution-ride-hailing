
export class MakePaymentEvent {
  constructor(
    public readonly userId: string, 
    public readonly fare: number,
    public readonly rideId:number
    ) { }
}