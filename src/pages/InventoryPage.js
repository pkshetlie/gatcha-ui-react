import React from 'react';
import InventoryDisplay from '../components/Inventory/InventoryDisplay';
import PageWrapper from '../components/Layout/PageWrapper';

function InventoryPage() {
    return (
        <PageWrapper>
            <h1>Inventory</h1>
            <InventoryDisplay />
        </PageWrapper>
    );
}

export default InventoryPage;