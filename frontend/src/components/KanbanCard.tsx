"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2 } from 'lucide-react';
import { useKanbanStore } from '../store/kanbanStore';

interface Props {
  id: string;
  title: string;
  details: string;
}

export function KanbanCard({ id, title, details }: Props) {
  const deleteCard = useKanbanStore(state => state.deleteCard);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: 'Card',
      title,
      details,
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`kanban-card ${isDragging ? 'dragging' : ''}`}
    >
      <div className="kanban-card-header">
        <h4>{title}</h4>
        <button
          className="btn-icon delete-btn"
          onClick={(e) => {
            e.stopPropagation(); // prevent drag
            deleteCard(id);
          }}
          aria-label="Delete card"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <p className="kanban-card-details">{details}</p>
    </div>
  );
}
