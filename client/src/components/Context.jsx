import React,{ createContext,useReducer } from "react";

export const Context = createContext()

export const ContextProvider = ({children,Reducer,InitialState})=>{
    return(
        <Context.Provider value={useReducer(Reducer,InitialState)}>
           {children}
        </Context.Provider>
    )
}