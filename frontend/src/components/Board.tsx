"use client";

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useKanbanStore } from '../store/kanbanStore';
import { Column } from './Column';
import { KanbanCard } from './KanbanCard';

export function Board() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const columns = useKanbanStore(state => state.columns);
  const cards = useKanbanStore(state => state.cards);
  const moveCard = useKanbanStore(state => state.moveCard);

  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Only handle dragging between different columns, if doing sorting wait until DragEnd
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Optional: implement visual swapping during drag over. 
    // In this MVP, we will handle the actual move logic during dragEnd for simplicity and stability.
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    
    if (!over) return;

    const activeCardId = active.id as string;
    const overId = over.id as string;

    const activeCard = cards.find(c => c.id === activeCardId);
    if (!activeCard) return;

    const isOverAColumn = columns.some(c => c.id === overId);
    
    let targetColumnId = activeCard.columnId;
    let newIndex = 0;

    if (isOverAColumn) {
      targetColumnId = overId;
      const targetColumnCards = cards.filter(c => c.columnId === targetColumnId);
      newIndex = targetColumnCards.length; // Append to end if dropped on column
    } else {
      const overCard = cards.find(c => c.id === overId);
      if (overCard) {
        targetColumnId = overCard.columnId;
        const targetColumnCards = cards.filter(c => c.columnId === targetColumnId);
        newIndex = targetColumnCards.findIndex(c => c.id === overId);
        
        // If dropping below, increment index
        const activeRect = active.rect.current.translated;
        const overRect = over.rect;
        
        if (activeRect && overRect) {
          const isBelow = activeRect.top > overRect.top + overRect.height / 2;
          if (isBelow) {
            newIndex += 1;
          }
        }
      }
    }

    if (activeCard.columnId !== targetColumnId || active.id !== overId) {
      moveCard(activeCardId, targetColumnId, newIndex);
    }
  };

  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  const activeCard = activeId ? cards.find(c => c.id === activeId) : null;

  return (
    <div className="kanban-container">
      <header className="kanban-header">
        <h1>Project Alpha Board</h1>
      </header>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="kanban-board">
          {columns.map(col => (
            <Column key={col.id} id={col.id} title={col.title} />
          ))}
        </div>

        <DragOverlay>
          {activeCard ? (
            <KanbanCard 
              id={activeCard.id} 
              title={activeCard.title} 
              details={activeCard.details} 
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
