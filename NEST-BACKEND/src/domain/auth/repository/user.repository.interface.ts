export interface IUserRepository {
	findByEmail(email: string): Promise<any | null>;
	findById(id: string): Promise<any | null>;
	create(data: any): Promise<any>;
	update(id: string, data: any): Promise<any>;
	list(): Promise<any[]>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
