import React, { createContext, FC, PropsWithChildren, useState } from "react";
import { IAppContext, IChatContext, IStakeContext, ITokenContext, IUserContext } from "../Types";



export const AppContext = createContext<{ appContext: IAppContext, setAppContext: React.Dispatch<React.SetStateAction<IAppContext>> }>({
    appContext: {},
    setAppContext: () => { }
})

export const UsersContext = createContext<{ usersContext: IUserContext[] | undefined, setUsersContext: React.Dispatch<React.SetStateAction<IUserContext[] | undefined>> }>({
    usersContext: undefined,
    setUsersContext: () => {}
})

export const TokensContext = createContext<{ tokensContext: ITokenContext[] | undefined, setTokensContext: React.Dispatch<React.SetStateAction<ITokenContext[] | undefined>> }>({
    tokensContext: undefined,
    setTokensContext: () => {}
})

export const StakesContext = createContext<{ stakesContext: IStakeContext[] | undefined, setStakesContext: React.Dispatch<React.SetStateAction<IStakeContext[] | undefined>> }>({
    stakesContext: undefined,
    setStakesContext: () => {}
})

export const ChatContext = createContext<{ chatContext: IChatContext | undefined, setChatContext: React.Dispatch<React.SetStateAction<IChatContext | undefined>> }>({
    chatContext: undefined,
    setChatContext: () => {}
})

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {

    const [appContext, setAppContext] = useState<IAppContext>({})
    const [usersContext, setUsersContext] = useState<IUserContext[] | undefined>()
    const [tokensContext, setTokensContext] = useState<ITokenContext[] | undefined>()
    const [stakesContext, setStakesContext] = useState<IStakeContext[] | undefined>()
    const [chatContext, setChatContext] = useState<IChatContext | undefined>()

    return (
        <AppContext.Provider value={{ appContext, setAppContext }}>
            <UsersContext.Provider value={{ usersContext, setUsersContext }}>
                <TokensContext.Provider value={{ tokensContext, setTokensContext }}>
                    <StakesContext.Provider value={{ stakesContext, setStakesContext }}>
                        <ChatContext.Provider value={{ chatContext, setChatContext }}>
                            {children}
                        </ChatContext.Provider>
                    </StakesContext.Provider>
                </TokensContext.Provider>
            </UsersContext.Provider>
        </AppContext.Provider>
    )
}