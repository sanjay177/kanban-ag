import { useKanbanStore } from '../store/kanbanStore';

describe('Kanban Store', () => {
  beforeEach(() => {
    // Reset store before each test if necessary or capture initial state
    useKanbanStore.setState({
      columns: [
        { id: 'col-1', title: 'To Do' },
        { id: 'col-2', title: 'In Progress' }
      ],
      cards: [
        { id: 'card-1', title: 'Task 1', details: 'Setup UI', columnId: 'col-1' }
      ]
    });
  });

  it('adds a card to a specific column', () => {
    const store = useKanbanStore.getState();
    store.addCard('col-1', 'New Task', 'Some details');

    const updatedStore = useKanbanStore.getState();
    expect(updatedStore.cards.length).toBe(2);
    
    const newCard = updatedStore.cards.find(c => c.title === 'New Task');
    expect(newCard).toBeDefined();
    expect(newCard?.details).toBe('Some details');
    expect(newCard?.columnId).toBe('col-1');
  });

  it('deletes a card by id', () => {
    let store = useKanbanStore.getState();
    expect(store.cards.length).toBe(1);

    store.deleteCard('card-1');

    store = useKanbanStore.getState();
    expect(store.cards.length).toBe(0);
  });

  it('renames a column', () => {
    let store = useKanbanStore.getState();
    
    store.renameColumn('col-1', 'Renamed To Do');

    store = useKanbanStore.getState();
    const renamedCol = store.columns.find(c => c.id === 'col-1');
    expect(renamedCol?.title).toBe('Renamed To Do');
  });

  it('moves a card to a different column', () => {
    let store = useKanbanStore.getState();
    
    // Move card-1 to col-2 at index 0
    store.moveCard('card-1', 'col-2', 0);

    store = useKanbanStore.getState();
    const movedCard = store.cards.find(c => c.id === 'card-1');
    
    expect(movedCard).toBeDefined();
    expect(movedCard?.columnId).toBe('col-2');
  });
});
