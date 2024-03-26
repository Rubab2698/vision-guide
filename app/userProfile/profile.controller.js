const service = require('./profile.service');
const pick = require('../general/pick')
const createProfilerMentor = async (req, res) => {
  try {
    const newProfile = await service.createProfileMentor(req);
    res.status(201).json(newProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};const createProfileMentee = async (req, res) => {
  try {
    const newProfile = await service.createMenteeProfile(req);
    res.status(201).json(newProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProfileMentor = async (req, res) => {
  try {
    const updatedProfile = await service.updateProfileMentor(req.params.profileId,req.payload.role, req.body,req.files,req.payload.user);
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};const updateProfileMentee = async (req, res) => {
  try {
    const updatedProfile = await service.updateMenteeProfile(req.params.profileId,req.payload.role, req.body,req.files,req.payload.user);
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProfileById = async (req, res) => {
  try {
    const profile = await service.getProfileById(req.params.profileId);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllProfiles = async (req, res) => {
  try {
    const filters = pick(req.query, ["domains", "languages", "featured", "role", "available"]);
    const options = pick(req.query, ["sortBy", "page", "limit"]);
    const searchKeyword = pick(req.query, ["search"]);
    const profiles = await service.getAllProfiles(filters,options,searchKeyword);
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProfileByIdMentor = async (req, res) => {
  try {
    const deletedProfile = await service.deleteProfileByIdMentor(req.params.profileId,req.payload.role,req.payload.sub);
    res.json(deletedProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
const deleteProfileByIdMentee = async (req, res) => {
  try {
    const deletedProfile = await service.deleteProfileByIdMentee(req.params.profileId,req.payload.role,req.payload.sub);
    res.json(deletedProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
createProfileMentee,
updateProfileMentee,
createProfilerMentor,
updateProfileMentor,
getProfileById,
getAllProfiles,
deleteProfileByIdMentor,
deleteProfileByIdMentee
};
