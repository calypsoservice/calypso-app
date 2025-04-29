import React, { createContext, FC, PropsWithChildren, useState } from "react";
import { IAppContext } from "../Types";



export const AppContext = createContext<{appContext: IAppContext, setAppContext: React.Dispatch<React.SetStateAction<IAppContext>>}>({
    appContext: {},
    setAppContext: () => {}
})

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {

    const [appContext, setAppContext] = useState<IAppContext>({})

    return (
        <AppContext.Provider value={{ appContext, setAppContext }}>
            {children}
        </AppContext.Provider>
    )
}