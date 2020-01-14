import React, {useState,createContext} from 'react'

export const TransactionContext = createContext([]); 

const TransactionContextProvider = props => {
    const LS_DATA = JSON.parse(localStorage.getItem('transactions'))
    const [transactions, setTransactions] = useState(LS_DATA || []);


    const editTransaction = transaction => {
        const filteredArray = [...transactions]
        filteredArray.forEach(item => {
            if(item._id === transaction._id){
                item.narration = transaction.narration;
                item.type = transaction.type;
                item.amount = transaction.amount;
                item.transaction_date = transaction.transaction_date;
                item.story = transaction.story;
            }
        })
        setTransactions([...filteredArray]);
    }

    return (
        <TransactionContext.Provider value={{transactions, setTransactions, editTransaction}}>
            {props.children}
        </TransactionContext.Provider>
    )
}

export default TransactionContextProvider
