export class EventEntity {
    constructor(
        public id : string,
        public name: string,
        public date: Date,
        public location: string) {}
    
    isUpcoming(): boolean {
        return this.date > new Date();
    }
}