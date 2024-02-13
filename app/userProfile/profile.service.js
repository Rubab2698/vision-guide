const { BankDetails, Profile } = require('./profile.model');
const file_del = require('../general/imagedel')




const createProfileMentor = async (req) => {
    try {
        if (req.payload.role !== "Mentor" && req.payload.role !== "Admin") {
            throw new Error('Unauthorized')
        }
        // Extract uploaded files
        let profilePicLocation ,introVideoLocation;
        if (req.files) {
            // Extract profile picture
            const profilePic = req.files['profilepic'] ? req.files['profilepic'][0] : null;
             profilePicLocation = profilePic ? profilePic.location : null;
        
            // Extract intro video
            const introVideo = req.files['introvideo'] ? req.files['introvideo'][0] : null;
             introVideoLocation = introVideo ? introVideo.location : null;
        } else {
            // Handle case where req.files is not available
             profilePicLocation = null;
             introVideoLocation = null;
        }
        // Check if a profile with the provided email already exists
        const existingProfile = await Profile.findOne({ email: req.body.email });
        if (existingProfile) {
            throw new Error('Profile with this email already exists.');
        }

        // Check if a profile with the provided userName already exists (case-insensitive)
        const existingUserName = await Profile.findOne({ userName: { $regex: new RegExp(`^${req.body.userName}$`, 'i') } });
        if (existingUserName) {
            throw new Error('Profile with this userName already exists.');
        }

        // Create Experience objects for each experience in the array
        const experiences = (req.body.experiences || []).map(experienceData => ({
            domain: experienceData.domain,
            technology: experienceData.technology,
            years: parseInt(experienceData.years),
        }));

        // Create a Profile object
        const profile = new Profile({
            email: req.body.email,
            profilePicture: profilePicLocation,
            userName: req.body.userName,
            role: req.payload.role,
            phoneNumber: req.body.phoneNumber,
            headline: req.body.headline,
            experiences: experiences,
            domains: req.body.domains,
            city: req.body.city,
            province: req.body.province, // Adding province field
            zipcode: req.body.zipcode, // Adding zipcode field
            languages: req.body.languages,
            social_media: req.body.social_media,
            featured: req.body.featured || false,
            education: req.body.education, // Adding education field
            introVideo: introVideoLocation,
            available: req.body.available || true, // Adding available field
            userId: req.payload.sub
        });
        
        // Save the Profile object
        await profile.save();

        return profile;
    } catch (error) {
        throw error;
    }
};

const updateProfileMentor = async (profileId, role, updatedData, files) => {
    try {
        if (role !== 'Mentor' && role !== 'Admin') {
            throw new Error('Unauthorized');
        }

        let profile = await Profile.findById(profileId);
        if (!profile) {
            throw new Error('Profile not found');
        }
        if (updatedData.experience !== undefined) {
            const updatedExperiences = updatedData.experience;

            updatedExperiences.forEach(updatedExp => {
                const experienceIndex = updatedExperiences.indexOf(updatedExp);
                const newExperienceData = {
                    domain: updatedExp.domain,
                    technology: updatedExp.technology,
                    years: updatedExp.years,
                };

                if (experienceIndex !== undefined) {
                    // Update the specific index in the experiences array
                    profile.experiences[experienceIndex] = newExperienceData;
                }
            });
        }
        if (updatedData.domains !== undefined) {
            const updatedDomains = updatedData.domains;

            updatedDomains.forEach(updatedDom => {
                const domainIndex = updatedDomains.indexOf(updatedDom);
                if (domainIndex !== undefined) {
                    profile.domains[domainIndex] = updatedDom;
                }
            });
        }
        if (updatedData.languages !== undefined) {
            const updatedlanguage = updatedData.languages;

            updatedlanguage.forEach(updatedlang => {
                const langIndex = updatedlanguage.indexOf(updatedlang);
                if (langIndex !== undefined) {
                    profile.languages[langIndex] = updatedlang;
                }
            });
        }
        if (updatedData.social_media !== undefined) {
            const updatedSocialMedia = updatedData.social_media;

            if (updatedSocialMedia.linkedin !== undefined) {
                profile.social_media.linkedin = updatedSocialMedia.linkedin;
            }

            if (updatedSocialMedia.github !== undefined) {
                profile.social_media.github = updatedSocialMedia.github;
            }
        }
        if (updatedData.bankDetails !== undefined) {
            profile.bankDetails = (await BankDetails.findByIdAndUpdate(profile.bankDetails, { $set: updatedData.bankDetails }, { new: true }))._id;
        }
        if (updatedData) {
            profile.headline = updatedData.headline;
            profile.city = updatedData.city;
            profile.phoneNumber = updatedData.phoneNumber;
            profile.userName = updatedData.userName;
            profile.email = updatedData.email;
            profile.featured = updatedData.featured;
            profile.role = role;
            await profile.save();
        }
        if (files) {
            const profilePic = files['profilepic'] ? files['profilepic'][0] : null;
            const introVideo = files['introvideo'] ? files['introvideo'][0] : null;
            if (profilePic) {
                if (profile.profilePicture) {
                    file_del(profile.profilePicture);
                }
                profile.profilePicture = profilePic.location;
            }
            if (introVideo) {
                if (profile.introVideo) {
                    file_del(profile.introVideo);
                }
                profile.introVideo = introVideo.location;
            }
            await profile.save();
        }
        return profile;
    } catch (error) {
        throw error;
    }
};

const createMenteeProfile = async (req) => {
    try {

        // Extract uploaded files
        if (req.payload.role !== "Mentee" && req.payload.role !== "Admin") {
            throw new Error('Unauthorized')
        }
        const profilePic = req.files['profilepic'] ? req.files['profilepic'][0] : null;
        const profilePicLocation = profilePic ? profilePic.location : null;

        // Check if a profile with the provided email already exists
        const existingProfile = await Profile.findOne({ email: req.body.email });
        if (existingProfile) {
            throw new Error('Profile with this email already exists.');
        }

        // Check if a profile with the provided userName already exists (case-insensitive)
        const existingUserName = await Profile.findOne({ userName: { $regex: new RegExp(`^${req.body.userName}$`, 'i') } });
        if (existingUserName) {
            throw new Error('Profile with this userName already exists.');
        }

        // Create a Profile object for mentee
        const profile = new Profile({
            email: req.body.email,
            profilePicture: profilePicLocation,
            userName: req.body.userName,
            role: req.payload.role,
            phoneNumber: req.body.phoneNumber,
            headline: req.body.headline,
            city: req.body.city,
            languages: req.body.languages,
            featured: req.body.featured || false,
        });
        await profile.save();

        const menteeProfile = profile.toObject();
        delete menteeProfile.experiences;
        delete menteeProfile.domains;

        // Save the Profile object

        return menteeProfile;
    } catch (error) {
        throw error;
    }
};

const updateMenteeProfile = async (profileId, role, updatedData, files) => {
    try {
        if (role !== 'Mentee' && role !== 'Admin') {
            throw new Error('Unauthorized');
        }
        let profile = await Profile.findById(profileId);
        if (!profile) {
            throw new Error('Profile not found')
        }
        if (updatedData) {
            Object.assign(profile, updatedData);
            profile.role = role; // Update role to 'Mentee' for mentee profiles
            await profile.save();
        }

        if (files) {
            const profilePic = files['profilepic'] ? files['profilepic'][0] : null;

            if (profilePic) {
                file_del(profile.profilePicture)
                profile.profilePicture = profilePic.location;
            }

            await profile.save();
        }
        delete profile.languages
        delete profile.domains
        delete profile.experiences
        delete profile.bankDetails
        delete profile.social_media
        return profile;
    } catch (error) {
        throw error;
    }
};

const getProfileById = async (id) => {
    try {
        const profile = await Profile.findById(id)
        // .populate('bankDetails');
        if (!profile) {
            throw new Error('Profile not found')
        }
        return profile;
    } catch (error) {
        throw error;
    }
};

const getAllProfiles = async (filters, options, searchKeyword) => {
    try {
        const { sortBy, page, limit } = options;

        const mainPipeline = [];

        // Atlas search stage
        if (searchKeyword.search && searchKeyword.search !== undefined) {
            const findKeyword = {
                index: "profiles",
                text: {
                    query: searchKeyword.search,
                    path: {
                        wildcard: "*",
                    },
                },
            };
            mainPipeline.push({ $search: findKeyword });
        }

        mainPipeline.push({ $match: filters });

        // Add additional lookup stages if needed

        const projectStage = {
            $project: {
                'bankDetails': 0, // Exclude password field from the result
            },
        };
        mainPipeline.push(projectStage);

        if (options && options.sortBy) {
            const parsedSortBy = JSON.parse(sortBy);
            mainPipeline.push({ $sort: { userName: parsedSortBy } });
        } else {
            mainPipeline.push({ $sort: { createdAt: -1 } });
        }

        // Pagination stages
        mainPipeline.push({ $skip: (page - 1) * limit });
        mainPipeline.push({ $limit: parseInt(limit) });

        // Execute the main pipeline
        const results = await Profile.aggregate(mainPipeline);

        // Pipeline for counting total documents
        const countPipeline = [
            { $count: 'totalDocuments' },
        ];

        // Execute the count pipeline
        const countResults = await Profile.aggregate(countPipeline);

        const totalDocuments = countResults.length > 0 ? countResults[0].totalDocuments : 0;
        const totalPages = Math.ceil(totalDocuments / limit);

        // Return the response
        const response = {
            results,
            pagination: {
                totalPages,
                currentPage: parseInt(page),
                totalDocuments,
                docsOnPage: results.length,
            },
        };

        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const deleteProfileByIdMentor = async (id, role) => {
    try {
        if (role !== 'Mentor' && role !== 'Admin') {
            throw new Error('Unauthorized');
        }

        const profile = await Profile.findByIdAndDelete(id);
        if (!profile) {
            throw new Error('Profile not found')
        }

        profile.profilePicture = file_del(profile.profilePicture);
        profile.introVideo = file_del(profile.introVideo);
        return profile;
    } catch (error) {
        throw error;
    }
}

const deleteProfileByIdMentee = async (id, role) => {
    try {
        if (role !== 'Mentee' && role !== 'Admin') {
            throw new Error('Unauthorized');
        }

        const profile = await Profile.findByIdAndDelete(id);
        if (!profile) {
            throw new Error('Profile not found')
        }

        profile.profilePicture = file_del(profile.profilePicture);
        profile.introVideo = file_del(profile.introVideo);
        return profile;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    createProfileMentor,
    updateProfileMentor,
    updateMenteeProfile,
    createMenteeProfile,
    getProfileById,
    getAllProfiles,
    deleteProfileByIdMentor,
    deleteProfileByIdMentee
};
