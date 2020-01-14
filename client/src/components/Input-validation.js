
export const inputValdiator = (amount,narration) =>{
    if (!narration)
        return {
            message: 'Description cannot be empty',
            status: false
        }
        else{
            if(narration.trim().length < 3){
                return {
                    message :'Description must be more than 3 characters',
                    status:false
        
                }
            }
            if(typeof amount !== 'number' || amount<1 || !amount){
                return {
                    message : 'Transaction amount must be more than 1',
                    sttus:false
                }
            }
            return {
                status:true
            }
        }
}

export const timeStampToDateString =(time)=>{
    const dateRaw = new Date(time);
    const year = dateRaw.getUTCFullYear();
    const date = dateRaw.getUTCDate();
    const month = dateRaw.getUTCMonth();

    function singleDigitToDoubleDigit (number){
        if (number<10){
            return `0${number}`
        }
        return number;
    }

    return `${year}-${singleDigitToDoubleDigit(month+1)}-${singleDigitToDoubleDigit(date)}`;
}

export const dateStringToTimeStamp = (dateString) =>{
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
    function isValidDate(dateString){
        const [year, month_, day] = dateString.split('-');
        const month = parseInt(month_)

        if(month === '1'||month === '3'||month==='5'||month ==='7'||month ==='8'||month==='10'||month ==='12'){
            if (parseInt(day) >=1 && parseInt(day) <=31)
                return true
            else    
                return false
        }
        else if(month === '2'){
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
    if(dateString === undefined){
        return {
            status: false,
            message:'Date cannot be empty'
        }
    }
    if (isValidDate(dateString)){
        if(Date.parse(dateString) > Date.now()){
            return{
                status: false,
                message:'Time travelling not invented yet'
            }
        }
        return{ 
            status: true,
            date:Date.parse(dateString)
        }
    }
    return {
        status: false,
        message:'Invalid Date'
    }
}

