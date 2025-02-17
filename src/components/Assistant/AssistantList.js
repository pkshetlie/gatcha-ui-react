import React from 'react';
import AssistantCard from './AssistantCard';
import { useGame } from '../../context/GameContext';
import './AssistantList.css'; // Import du fichier CSS

function AssistantList() {
    const { assistants } = useGame();

    return (
        <div className="assistant-list">
            {assistants.map(assistant => (
                <AssistantCard key={assistant.id} assistant={assistant} />
            ))}
        </div>
    );
}
export default AssistantList;