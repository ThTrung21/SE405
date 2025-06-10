export interface IConversation {
	id: number | string;
	userId: number;
	staffId?: number | string;
	orderId?: number | string | null;
	type: string;
	status: string;
	expiresAt?: Date | string;
	createdAt: Date | string;
	updatedAt: Date | string;
}
