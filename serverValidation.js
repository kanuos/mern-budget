function serverDateValidation(timeStamp){
    // 1. Check whether time stamp is valid
    const date =  new Date(timeStamp)

    if(!date || timeStamp > Date.now()){
        return false;
    }


    // 2. convert to date string 
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();

    
    // 3. check if valid date string
    if(month===0||month===2||month===4||month===6||month===7||month===9||month===10){
        if (parseInt(day) >=1 && parseInt(day) <=31)
            return true
        else    
            return false;
    }
    else if(month===1){
        if(isLeapYear(year)){
            if (parseInt(day)>=1 && parseInt(day)<=29)
                return true;
            else
                return false
        }
        if (parseInt(day)>=1 && parseInt(day)<=28)
            return true;
        else
            return false
    }
    else{
        if (parseInt(day) >=1 && parseInt(day) <=30)
            return true
        else    
            return false
    } 
}




// dependency functions

function isLeapYear(year){
    if (!year%4){
        if(!year%100){
            if(!year%400)
                return true
            else
                return false
        }
        return true;
    }
    return false;
}


module.exports = serverDateValidation;