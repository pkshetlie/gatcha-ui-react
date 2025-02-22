import React from 'react';
import AssistantCard from './AssistantCard';
import AssistantCardSkeleton from '../UI/AssistantCardSkeleton'; // Importe le squelette
import { useGame } from '../../context/GameContext';
import './AssistantList.css'; // Import du fichier CSS

function AssistantList() {
    const { assistants, isLoading } = useGame();

    return (
        <div className="assistant-list">
            {isLoading ? (
                // Affiche les squelettes pendant le chargement
                Array.from({ length: 10 }).map((_, index) => (
                    <AssistantCardSkeleton key={index} />
                ))
            ) : (
                // Affiche les cartes des assistantes une fois chargées
                assistants.map(assistant => (
                    <AssistantCard key={assistant.id} assistant={assistant} />
                ))
            )}
        </div>
    );
}

export default AssistantList;
