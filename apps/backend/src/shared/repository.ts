// export abstract class Repository<T> {
//   abstract create(item: T): Promise<T>;
//   abstract read(id: string): Promise<T | null>;
//   abstract update(id: string, item: T): Promise<T>;
//   abstract delete(id: string): Promise<void>;
//   abstract list(): Promise<T[]>;
// }

export interface Repository<T> {
	create(item: T): Promise<T>;
	read(id: string): Promise<T | null>;
	update(id: string, item: T): Promise<T>;
	delete(id: string): Promise<void>;
	list(): Promise<T[]>;
}
