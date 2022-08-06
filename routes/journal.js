const express = require('express')
const router = express.Router()
const fetchuser = require('../middleware/fetchuser')
const Journal = require('../models/Journal')
const { body, validationResult } = require('express-validator');

// TODO: ROUTE 1: Create a journal entry:POST /api/journal/createntry Login Required
router.post('/createntry', [
    body('body').exists()
] ,fetchuser , async (req, res) => {
    var success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, error: errors.array() });
    }

    try {
        const { ticker, body, pnl } = req.body  
        const entry = await Journal.create(
            {
                user: req.user.id ,
                ticker: ticker,
                body: body,
                pnl: pnl
            }
        )
        success = true
        res.send({success, res: entry})

    } catch (error) {
        return res.status(500).send({ success, error: 'Some Error Occured'})
    }
})

// TODO: ROUTE 2: Read a Journal Entry : /api/journal/entry/:id  Login Required
router.get('/entry/:id',fetchuser,async (req, res) => {
    var success = false
    try {
        let note = await Journal.findById(req.params.id)
        if (!note) {
            return res.status(404).send({ success, error: 'Not Found'})
        }
        if (note.user.toString() != req.user.id) {
            return res.status(401).send({ success, error: 'Not Authorised'})
        }
        success= true
        return res.send({ success, res: note })

    } catch (error) {
        return res.status(500).send({ success, error: 'Internal Server Error' })
    }
})

// TODO: ROUTE 3: Update an Entry: /api/journal/update/:id  Login Required
router.put('/updatentry/:id',fetchuser, async (req, res) => {
    var success = false
    try {
        const { ticker,body, pnl } = req.body
        let newentry = {}
        if (ticker) {
            newentry.ticker = ticker
        }
        if (body) {
            newentry.body = body
        }
        if (pnl) {
            newentry.pnl = pnl
        }

        let old_entry = await Journal.findById(req.params.id);
        if (!old_entry) {
            return res.status(404).send({ success, error: 'Not Found'})
        }
        if (old_entry.user.toString() !== req.user.id) {
            return res.status(401).send({ success, error: 'Not Authorised'})
        }
        success = true
        const update_entry = await Journal.findByIdAndUpdate(req.params.id, { $set: newentry }, { new: true })
        return res.send({ success, res: update_entry})
    } catch (error) {
        return res.status(500).send({ success, error: 'Internal Server Error' })
    }
    
})

// TODO: ROUTE 4: Delete an Entry: /api/journal/delete/:id  Login Required
router.delete('/deletentry/:id', fetchuser, async (req, res) => {
    var success = false
    try {
        let note = await Journal.findById(req.params.id)
        if (!note){
            return res.status(404).send('Not Found')
        }
        if ( note.user.toString() !== req.user.id){
            return res.status(401).send('Not Authorised')
        }

        note = await Journal.findByIdAndDelete(req.params.id)
        success = true
        return res.send({success, res: note})

    } catch (error) {
        res.status(500).send({ success, error: 'Internal Server Error' })
    }
})

// TODO: ROUTE 5: Fetch all entries: GET /api/journal/fetchallentries  Login Required
router.get('/fetchallentries', fetchuser , async (req, res) => {
    var success = false
    try {
        const entries = await Journal.find({ user: req.user.id })
        success = true
        res.send({success, res: entries})    
    } catch (error) {
        console.error(error.message)
        return res.status(500).send({success, error: 'Internal Server Error'})
    }
    
})


module.exports= router

