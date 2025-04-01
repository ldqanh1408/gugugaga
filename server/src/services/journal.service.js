const Journal = require("../models/journal.model");

const findJournalByUserId = async (userId) => {
        try{
                const journal = await Journal.findOne({userId});
                if(!journal) throw new Error("Journal not found");
                return journal;
        }
        catch(error) {
                console.log(error.message);
                throw error;
        }
}

module.exports = {findJournalByUserId};