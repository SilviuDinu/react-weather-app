import { createContext, useState } from "react";

export const CurrentCityProvider = (props: any): any => {
    const [currentCity, setCurrentCity] = useState('');

    return (
        <CurrentCityContext.Provider value={[currentCity, setCurrentCity]}>
            {props.children}
        </CurrentCityContext.Provider>
    );
};

export const CurrentCityContext = createContext<any>({
    isLoading: false,
});
