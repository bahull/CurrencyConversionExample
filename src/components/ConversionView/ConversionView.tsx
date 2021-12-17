import React, {useEffect, useState} from 'react';
import sdk from '../../utils/upholdClient'
import useDebounce from '../../utils/useDebounce'

interface CurrencyConversion {
    ask: string;
    bid: string;
    currency: string;
    pair: string; 
    formatting: {
        precision: number
    }
}

interface Currency {
    code: string;
}

const getCurrencyConversionData = async (currencyName: string) => {
    const storedData = window.sessionStorage.getItem(currencyName);
    if(storedData) {
        return JSON.parse(storedData)
    }
    return sdk.getTicker(currencyName)
    .then((data: Array<Currency>) => {
        window.sessionStorage.setItem(currencyName, JSON.stringify(data));
        return data
    })
}

// const getConvertedCurrency = (requestedAmount: string, currencyBidAmount: string, currencyInformation: CurrencyConversion) => {
//     const 
//     return parseFloat(parseFloat(requestedAmount) * parseFloat(currencyBidAmount)).toPrecision(currencyInformation.formatting.precision)
// }

const ConversionView = () => {
    const [conversionAmount, setConversionAmount] = useState<number | string>(0.00)
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [showNumberRequired, setNumberRequired] = useState(false);
    const [currencies, setCurrencies] = useState<Array<Currency> | null>(null);
    const [currencyConversion, setCurrencyConversion] = useState<Array<CurrencyConversion> | null>(null);
    const debouncedCurrencyConversion = useDebounce(selectedCurrency, 1500)
    useEffect(() => {
        sdk.api('/assets', {authenticate: false})
        .then((data: Array<Currency>, anything: any) => {
            setCurrencies(data)})
    }, [])

    useEffect(() => {
       getCurrencyConversionData(debouncedCurrencyConversion)
       .then((data) => setCurrencyConversion(data));
    }, [debouncedCurrencyConversion])

    const handleAmountChange = (event: any) => {
        setConversionAmount(event.target.value ? parseFloat(event.target.value) : '')
        if(!event.target.value) {
            setNumberRequired(true)
        } else {
            setNumberRequired(false)
        }
    }

    return <section >
        <div style={{paddingTop: '7vh', width: '80vw', display: 'flex', justifyContent: 'space-around'}}>
            <div style={{width: '100%'}}>
       <input name='conversionAmount' value={conversionAmount}  style={{width: '70%', height: '80%', fontSize: '20px', borderWidth: '2px'}} onChange={handleAmountChange} />
       <p style={{color: 'red', visibility: showNumberRequired ? 'visible' : 'hidden'}}>Please enter an amount to convert</p>
       </div>
       <div style={{width: '100%'}}>
       <select value={selectedCurrency} style={{width: '70%', height: '80%', fontSize: '15px', borderWidth: '2px'}} onChange={(event) => setSelectedCurrency(event.target.value)}>
           {currencies && currencies.length > 0 && currencies.map(curr => <option value={curr.code}>{curr.code}</option>)}
       </select>
       </div>
       </div>
       <div style={{paddingTop: '2vh', width: '80vw', display: 'flex', flexFlow: 'wrap', justifyContent: 'space-around'}}>

       {currencyConversion && conversionAmount && currencyConversion.length > 0 ? (
           
           currencyConversion.map(curr => {
               const regex = new RegExp(`(-?${debouncedCurrencyConversion}-?)`);
            return <div style={{width: '40%', display: 'flex', justifyContent: 'space-around' }} key={curr.pair} data-thing={curr.pair}>
                <p style={{overflowWrap: 'break-word', width: '50%'}}>{curr.bid}</p>
                <p style={{width: '50%'}}>{curr.pair.replace(regex, '')}</p>
                </div>       
        })
       ): null}
       </div>
        {/* <ConversionResults /> */}
    </section>
}

export default ConversionView