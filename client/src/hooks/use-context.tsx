import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ContextType {
    analysisResults: string;
    setAnalysisResults: (newValue: string) => void;
}

const MyContext = createContext<ContextType | undefined>(undefined);

export const MyContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [analysisResults,setAnalysisResults] = useState<string>('');

    return (
        <MyContext.Provider value={{ analysisResults,setAnalysisResults }}>
            {children}
        </MyContext.Provider>
    );
};

export const useMyContext = (): ContextType => {
    const context = useContext(MyContext);
    if (!context) {
        throw new Error('useMyContext must be used within a MyContextProvider');
    }
    return context;
};