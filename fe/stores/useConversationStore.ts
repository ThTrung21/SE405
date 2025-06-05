import { create } from "zustand";
import { IConversation } from "../interfaces/IConversation";
import { immer } from "zustand/middleware/immer";

type State = {
  conversations: IConversation[];
  selectedConversation: IConversation | null;
};

type Actions = {
  setConversations: (convs: IConversation[]) => void;
  setSelectedConversation: (conv: IConversation) => void;
};

export const useConversationStore = create(
  immer<State & Actions>((set) => ({
    conversations: [],
    selectedConversation: null,
    setConversations: (convs) =>
      set((state) => {
        state.conversations = convs;
      }),
    setSelectedConversation: (conv) =>
      set((state) => {
        state.selectedConversation = conv;
      }),
  }))
);
