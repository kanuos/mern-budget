import React, {useState, createContext} from 'react'

export const GuestContext = createContext([]);

const GuestContextProvider = (props) => {
    
    const [guestTransactions, setGuestTransactions] = useState([]);

    const addGuest = transaction => setGuestTransactions([...guestTransactions,transaction])
    
    const editGuest = transaction => {
        const filteredArray = [...guestTransactions]
        filteredArray.forEach(item => {
            if(item._id === transaction._id){
                item.narration = transaction.narration;
                item.type = transaction.type;
                item.amount = transaction.amount;
                item.transaction_date = transaction.transaction_date;
                item.story = transaction.story;
            }
        })
        setGuestTransactions([...filteredArray]);
    }

    const removeGuest = id => setGuestTransactions(guestTransactions.filter(item =>item._id !== id))



    return (
        <GuestContext.Provider value={{guestTransactions, addGuest, editGuest, removeGuest}}> 
            {props.children}
        </GuestContext.Provider>
    )
}

export default GuestContextProvider
