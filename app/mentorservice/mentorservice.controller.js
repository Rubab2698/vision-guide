const service = require('./mentorservice.service');
const pick = require('../general/pick');

const createBasicService = async (req, res) => {
  try {
    const newService = await service.createBasicService(req);
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateBasicService = async (req, res) => {
  try {
    const updatedService = await service.updateBasicService(req.params.serviceId, req.payload.role, req.body, req.payload.sub);
    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBasicServiceById = async (req, res) => {
  try {
    const srvice = await service.getServiceById(req.params.serviceId);
    res.json(srvice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const deleteBasicService = async (req, res) => {
  try {
    const deletedService = await service.deleteBasicService(req.params.serviceId, req.payload.role, req.payload.sub);
    // console.log(deletedService)
    res.json({ message: 'Service deleted successfully', deletedService });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllBasicService = async (req, res) => {
  try {
    const filters = pick(req.query, ["mentorId", "cost", "status"]);
    const options = pick(req.query, ["sortBy", "page", "limit"]);
    const services = await service.getAllBasicService(filters, options);
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createPackage = async (req, res) => {
  try {
    const newService = await service.createPackage(req);
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBasicService,
  updateBasicService,
  deleteBasicService,
  getAllBasicService,
  getBasicServiceById,
  createPackage
};
