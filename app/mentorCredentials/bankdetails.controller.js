const bankService = require('./bankdetails.service');
const pick = require('../general/pick')
const addBankDetails = async (req, res) => {
    try {
        const result = await bankService.addBankDetails(req.payload.role, req.body);
    
        res.status(200).json({
          message: "Successfully added Bank Details",
          result: result
        })
      } catch (error) {
        next(error);
      }
}
const updateBankDetails = async (req, res) => {
    try {
        const result = await bankService.updateBankDetails(req.params.id,req.payload.role, req.body);
    
        res.status(200).json({
          message: "Successfully updated Bank Details",
          result: result
        })
      } catch (error) {
        next(error);
      }
}
const deleteBankDetailsById = async (req, res) => {
    try {
        const result = await bankService.deleteBankDetails(req.params.id, req.payload.role);
    
        res.status(200).json({
          message: "Successfully deleted Bank Details",
          result: result
        })
      } catch (error) {
        next(error);
      }
}
const getBankDetailsById = async (req, res) => {
    try {
        const result = await bankService.getBankDetailsById(req.params.id, req.payload.role);
    
        res.status(200).json({
          message: "Successfully fetched Bank Details",
          result: result
        })
      } catch (error) {
        next(error);
      }
    
}
const getAllBankDetails = async (req, res) => {
    try {
         const options = pick(req.query, ['sortBy', 'page', 'limit'])
        const result = await bankService.getBankDetails(req.payload.role, options);
        res.status(200).json({
            message: "Successfully fetched Bank Details",
            result: result
        })
    } catch (error) {
        next(error)

    }

}


module.exports = {
    addBankDetails,
    updateBankDetails,
    deleteBankDetailsById,
    getBankDetailsById,
    getAllBankDetails
}