import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ProcessingContextType {
    isProcessing: boolean;
    setProcessing: (processing: boolean) => void;
}

const ProcessingContext = createContext<ProcessingContextType | undefined>(undefined);

export const useProcessing = (): ProcessingContextType => {
    const context = useContext(ProcessingContext);
    if (!context) {
        throw new Error('useProcessing must be used within a ProcessingProvider');
    }
    return context;
};

interface ProcessingProviderProps {
    children: ReactNode;
}

export const ProcessingProvider: React.FC<ProcessingProviderProps> = ({ children }) => {
    const [isProcessing, setProcessing] = useState(false);

    return (
        <ProcessingContext.Provider value={{ isProcessing, setProcessing }}>
            {children}
        </ProcessingContext.Provider>
    );
};
