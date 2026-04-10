"use client";

import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, Edit2, Check } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useKanbanStore } from '../store/kanbanStore';
import { KanbanCard } from './KanbanCard';

interface Props {
  id: string;
  title: string;
}

export function Column({ id, title }: Props) {
  const cards = useKanbanStore(useShallow(state => state.cards.filter(c => c.columnId === id)));
  const renameColumn = useKanbanStore(state => state.renameColumn);
  const addCard = useKanbanStore(state => state.addCard);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDetails, setNewCardDetails] = useState('');

  const { setNodeRef } = useDroppable({
    id,
    data: {
      type: 'Column',
    }
  });

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTitle.trim()) {
      renameColumn(id, editTitle.trim());
    } else {
      setEditTitle(title);
    }
    setIsEditing(false);
  };

  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCardTitle.trim()) {
      addCard(id, newCardTitle.trim(), newCardDetails.trim());
      setNewCardTitle('');
      setNewCardDetails('');
      setIsAddingCard(false);
    }
  };

  return (
    <div className="kanban-column">
      <div className="kanban-column-header">
        {isEditing ? (
          <form onSubmit={handleRenameSubmit} className="rename-form">
            <input
              autoFocus
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleRenameSubmit}
              className="rename-input"
            />
          </form>
        ) : (
          <div className="column-title" onClick={() => setIsEditing(true)}>
            <h3>{title}</h3>
            <span className="card-count">{cards.length}</span>
          </div>
        )}
      </div>

      <div className="kanban-column-content" ref={setNodeRef}>
        <SortableContext items={cards} strategy={verticalListSortingStrategy}>
          {cards.map(card => (
            <KanbanCard key={card.id} id={card.id} title={card.title} details={card.details} />
          ))}
        </SortableContext>
        
        {isAddingCard ? (
          <form onSubmit={handleAddCardSubmit} className="add-card-form kanban-card">
            <input
              autoFocus
              placeholder="Card Title"
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              className="add-card-input"
            />
            <textarea
              placeholder="Details (optional)"
              value={newCardDetails}
              onChange={(e) => setNewCardDetails(e.target.value)}
              className="add-card-textarea"
              rows={2}
            />
            <div className="add-card-actions">
              <button type="submit" className="btn-primary" disabled={!newCardTitle.trim()}>
                Add
              </button>
              <button type="button" className="btn-ghost" onClick={() => setIsAddingCard(false)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button className="add-card-btn" onClick={() => setIsAddingCard(true)}>
            <Plus size={16} /> Add a card
          </button>
        )}
      </div>
    </div>
  );
}
