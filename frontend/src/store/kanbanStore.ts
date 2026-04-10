import { create } from 'zustand';

export interface Card {
  id: string;
  title: string;
  details: string;
  columnId: string;
}

export interface Column {
  id: string;
  title: string;
}

interface KanbanState {
  columns: Column[];
  cards: Card[];
  moveCard: (cardId: string, toColumnId: string, newIndex: number) => void;
  addCard: (columnId: string, title: string, details: string) => void;
  deleteCard: (cardId: string) => void;
  renameColumn: (columnId: string, newTitle: string) => void;
}

const initialColumns: Column[] = [
  { id: 'col-1', title: 'To Do' },
  { id: 'col-2', title: 'In Progress' },
  { id: 'col-3', title: 'Review' },
  { id: 'col-4', title: 'Testing' },
  { id: 'col-5', title: 'Done' },
];

const initialCards: Card[] = [
  { id: 'card-1', title: 'Setup UI framework', details: 'Install React and dependencies', columnId: 'col-1' },
  { id: 'card-2', title: 'Design Database', details: 'Define schema and relations', columnId: 'col-1' },
  { id: 'card-3', title: 'Implement Auth', details: 'Write login and signup handlers using JWT', columnId: 'col-2' },
  { id: 'card-4', title: 'Code Review for PR #12', details: 'Review the payment gateway integration', columnId: 'col-3' },
  { id: 'card-5', title: 'E2E Testing', details: 'Write cypress or playwright tests', columnId: 'col-4' },
  { id: 'card-6', title: 'Deploy v1.0', details: 'Push image to registry and update manifest', columnId: 'col-5' },
];

export const useKanbanStore = create<KanbanState>((set) => ({
  columns: initialColumns,
  cards: initialCards,

  moveCard: (cardId, toColumnId, newIndex) =>
    set((state) => {
      const cardToMove = state.cards.find(c => c.id === cardId);
      if (!cardToMove) return state;

      const otherCards = state.cards.filter(c => c.id !== cardId);
      const cardsInTargetColumn = otherCards.filter(c => c.columnId === toColumnId);
      const cardsInOtherColumns = otherCards.filter(c => c.columnId !== toColumnId);

      const modifiedCard = { ...cardToMove, columnId: toColumnId };
      
      cardsInTargetColumn.splice(newIndex, 0, modifiedCard);

      return {
        cards: [...cardsInOtherColumns, ...cardsInTargetColumn]
      };
    }),

  addCard: (columnId, title, details) =>
    set((state) => ({
      cards: [
        ...state.cards,
        {
          id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title,
          details,
          columnId,
        },
      ],
    })),

  deleteCard: (cardId) =>
    set((state) => ({
      cards: state.cards.filter((c) => c.id !== cardId),
    })),

  renameColumn: (columnId, newTitle) =>
    set((state) => ({
      columns: state.columns.map((col) =>
        col.id === columnId ? { ...col, title: newTitle } : col
      ),
    })),
}));
