const router = require('express').Router();
const TransactionModel = require('../../models/Transactions');
const authorize = require('../../Authorization');
const validateDate = require('../../serverValidation');
const Joi =  require('@hapi/joi');

const validationSchema = Joi.object({
    amount: Joi.number().min(1).required(),
    narration: Joi.string().min(3).required(),
    type: Joi.string().required().regex(/(inc$|exp$)/),
    story: Joi.string().min(1),
    // add password validation and make email strict
})


/*
Method:     GET
Desc:       Get all transactions by user (for Report component)
Access:     Private
*/
router.get('/', authorize , async (req,res)=>{
    
    
    // Get all transactions from UserModel : REPLACE by all transactions by SPECIFIC USER
    try{
        const transactions = await TransactionModel.find({user: req.user_id});
        if (!transactions.length){
            // If no transactions found
            return res.status(404).json({error:'No transactions'})
        }
        return res.json(transactions)
        }
    
    catch(err){
        res.status(400).json({error:'DB error', err})
    }
})

//***************************************************************************************/

/*
Method:     GET
Desc:       Get transactions by ID 
Access:     Private
*/
router.get('/:tran_id',authorize , async (req,res)=>{
    try{
        const transaction = await TransactionModel.findById({_id: req.params.tran_id})
        if(transaction.user.toString() === req.user_id)
            return res.json(transaction)
        else
            return res.status(403).json({error:'Access denied.'})
    }
    catch(err){
        return res.status(400).json({
            error:'Transaction not found',err
        })
    }
})

//***************************************************************************************/

/*
Method:     POST
Desc:       Add New Transaction 
Access:     Private
*/
router.post('/', authorize ,async (req,res)=>{
    let transaction = {}
    const {error, value} = validationSchema.validate({
        narration: req.body.narration,
        amount: req.body.amount,
        type: req.body.type,
        story: req.body.story,
    })
    if(error){
        return res.status(404).json(error.details[0].message)
    }
    else{
        try{
            transaction = {...value}
            transaction.user = req.user_id;
    
            if(req.body.transaction_date){
                if(validateDate(req.body.transaction_date))
                    transaction.transaction_date = req.body.transaction_date
                else    
                    transaction.transaction_date = Date.now()
            }
            else
                transaction.transaction_date = Date.now()
    
            const savedData = await TransactionModel.create(transaction);
                return res.json({message:'Transaction saved', savedData})
        }
        catch(err){
            return res.status(404).json({error:'Transaction could not be saved', err})
        }
    }
})
    

//***************************************************************************************/

/*
Method:     PATCH
Desc:       Edit transactions Transaction 
Access:     Private
*/
router.patch('/:tran_id',authorize , (req,res)=>{
    let payload = {}

    const {error, value} = validationSchema.validate({
        narration: req.body.narration,
        amount: req.body.amount,
        type: req.body.type,
        story: req.body.story,
    })
    if(error){
        return res.status(403).json(error.details[0].message)
    }
    payload = {...value};
    if(req.body.transaction_date){
        if(validateDate(req.body.transaction_date)){
            payload.transaction_date = req.body.transaction_date
        }
        else    
            payload.transaction_date = Date.now()  
    }
    else{
        payload.transaction_date = Date.now()
    }
 

    TransactionModel.findByIdAndUpdate({_id:req.params.tran_id,'user.id':req.user_id}, {$set:payload})
        .then(data =>{
            return res.json({message:'Transaction modified'})
        })
        .catch(() => res.status(404).json({error:'Transaction not found', error}))
})


//***************************************************************************************/


/*
Method:     DELETE
Desc:       Delete transaction with ID
Access:     Private
*/
router.delete('/:tran_id',authorize ,(req,res)=>{
    TransactionModel.findByIdAndDelete({_id: req.params.tran_id, 'user.id':req.user_id})
        .then(response => res.json({message: 'Transaction deleted'}))
        .catch(()=> res.status(404).json({error:'No transaction found'}))
})

//***************************************************************************************/
module.exports = router;