import React from 'react';
import ClickArea from '../components/Clicker/ClickArea';
import ClickCounter from '../components/Clicker/ClickCounter';
import AssistantList from '../components/Assistant/AssistantList';
import PageWrapper from '../components/Layout/PageWrapper';
import './Home.css';

function Home() {
    return (
        <PageWrapper>
            <div className="home-container">
                <ClickCounter />
                <ClickArea />
                <AssistantList />
            </div>
        </PageWrapper>
    );
}

export default Home;
