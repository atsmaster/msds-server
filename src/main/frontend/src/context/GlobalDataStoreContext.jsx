import { createContext, useState, useEffect } from "react";
import useLocalStorage from '../hooks/useLocalStorage'

const Store = {
    userInfoKey: "USER_INFO_KEY"
}

const GlobalDataStore = createContext();


const initial = {
    department: "",
    group: ""
}


export default function GlobalDataProvider({ children }) {
    
    const storage = useLocalStorage(Store.userInfoKey, initial);
    
    return (
        <GlobalDataStore.Provider value={storage}>
          {children}
        </GlobalDataStore.Provider>
    );
}

export {
    GlobalDataStore
}