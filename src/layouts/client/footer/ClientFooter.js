import React from 'react';
import ClientFooterView from './ClientFooter.jsx';

const ClientFooter = () => {
    const currentYear = new Date().getFullYear();

    return (
        <ClientFooterView
            currentYear={currentYear}
        />
    );
};

export default ClientFooter;
