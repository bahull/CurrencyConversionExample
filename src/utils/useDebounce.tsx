import React, {useEffect, useState} from 'react'

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() =>{
        const debounceHandler =  setTimeout(() => {
            setDebouncedValue(value)
        }, delay)
        return () => clearTimeout(debounceHandler)
    }, [value, delay])


    return debouncedValue
} 

export default useDebounce