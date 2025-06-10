export interface IUser {
	id: number | string;
	password: string;
	fullname: string;
	phone?: string;
	orderCount?: number;
	totalPayment?: number | string;
	dob?: string | Date;
	role: string;
	address: string;
	email: string;
	createdAt: string | Date;
	updatedAt: string | Date;
	deletedAt?: any | Date;
	lastAssignedAt?: Date | string;
	avatar?: string;
	likedProducts: string[];
	OrderModels: any[];
}
