import { create } from "zustand";
import { IMessage } from "../interfaces/IMessage";
import { immer } from "zustand/middleware/immer";

type State = {
  messages: IMessage[];
};

type Actions = {
  setMessages: (messages: IMessage[]) => void;
  addMessage: (message: IMessage) => void;
  resetMessages: () => void;
};

export const useChatStore = create(
  immer<State & Actions>((set) => ({
    messages: [],
    setMessages: (messages) =>
      set((state) => {
        state.messages = messages;
      }),
    addMessage: (message) =>
      set((state) => {
        state.messages.push(message);
      }),
    resetMessages: () =>
      set((state) => {
        state.messages = [];
      }),
  }))
);
