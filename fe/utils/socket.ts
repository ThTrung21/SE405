import { io, Socket } from "socket.io-client";
import { useAuthStore } from "stores/useAuthStore";

let socket: Socket | null = null;

export const initSocket = (): Socket => {
	if (socket) return socket;

	const accessToken = useAuthStore.getState().token?.accessToken;
	console.log("🔐 accessToken being sent to socket:", accessToken);
	socket = io("http://localhost:8080", {
		auth: { token: accessToken },
		transports: ["websocket"],
	});

	socket.on("connect", () => {
		console.log("✅ WebSocket connected:", socket!.id);
	});

	socket.on("connect_error", (err) => {
		console.log("❌ WebSocket connection error:", err.message);
	});

	return socket;
};
