const { BankDetails, Profile } = require('./profile.model');
const file_del = require('../general/imagedel')
const { getUserByID } = require('../authUser/user.service')
const mongoose = require('mongoose');


const createProfileMentor = async (req) => {
    try {
        if (req.payload.role !== "Mentor" && req.payload.role !== "Admin") {
            throw new Error('Unauthorized')
        }

        const user = req.payload.user


        if (user.role === "Mentor") {
            const alreadyCreated = await Profile.findOne({ userId: user._id });
            if (alreadyCreated) {
                throw new Error('Profile already created');
            }

        }

        // Extract uploaded files
        let profilePicLocation, introVideoLocation;
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
        const { userName } = req.body; // Destructure the userName object from req.body
        const existingUserName = await Profile.findOne({ userName: { $regex: new RegExp(`^${userName.firstName}${userName.lastName}$`, 'i') } });
        if (existingUserName) {
            throw new Error('Profile with this userName already exists.');
        }

        // Create Experience objects for each experience in the array
        const experiences = (req.body.experiences || []).map(experienceData => ({
            domain: experienceData.domain,
            technology: experienceData.technology,
            years: parseInt(experienceData.years),
            companyName: experienceData.companyName,
            joiningDate: new Date(experienceData.joiningDate),
            endDate: new Date(experienceData.endDate),
            description: experienceData.description,
            designation: experienceData.designation
        }));

        // Create Education objects for each education in the array
        const education = (req.body.education || []).map(educationData => ({
            instituite: educationData.instituite,
            degree: educationData.degree,
            domain: educationData.domain,
            startDate: new Date(educationData.startDate),
            endDate: new Date(educationData.endDate),
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
            education: education, // Adding education field
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

const updateProfileMentor = async (profileId, role, updatedData, files, user) => {
    try {
        if (role !== 'Mentor' && role !== 'Admin') {
            throw new Error('Unauthorized');
        }

        let profile = await Profile.findById(profileId);
        
        if (!profile) {
            throw new Error('Profile not found');
        }
        const usrId =new mongoose.Types.ObjectId( user._id)
        // Check if the current user is authorized to update the profile
        if (role === "Mentor" && !profile.userId.equals(usrId)) {
            throw new Error('Unauthorized to update this profile');
        }

        // Update profile fields from updatedData
        if (updatedData) {
            Object.assign(profile, updatedData);
        }

        // Update role
        profile.role = role;

        // Update social media separately if provided
        if (updatedData.social_media) {
            Object.assign(profile.social_media, updatedData.social_media);
        }

        // Save the profile
        await profile.save();

        // Handle files
        if (files) {
            if (files.profilepic && files.profilepic[0]) {
                if (profile.profilePicture) {
                    file_del(profile.profilePicture);
                }
                profile.profilePicture = files.profilepic[0].location;
            }

            if (files.introvideo && files.introvideo[0]) {
                if (profile.introVideo) {
                    file_del(profile.introVideo);
                }
                profile.introVideo = files.introvideo[0].location;
            }

            // Save the profile after file handling
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
            throw new Error('Unauthorized');
        }

        const user = await getUserByID(req.payload.sub);
        if (req.payload.role === "Mentee" && !user) {
            throw new Error('User not found');
        }

        const alreadyCreated = await Profile.findOne({ userId: user._id });
        if (alreadyCreated) {
            throw new Error('Profile already created');
        }

        const profilePic = req.files['profilepic'] ? req.files['profilepic'][0] : null;
        const profilePicLocation = profilePic ? profilePic.location : null;

        // Check if a profile with the provided email already exists
        const existingProfile = await Profile.findOne({ email: req.body.email });
        if (existingProfile) {
            throw new Error('Profile with this email already exists.');
        }

        // Check if a profile with the provided userName already exists (case-insensitive)
        const { userName } = req.body; // Destructure the userName object from req.body
        const existingUserName = await Profile.findOne({ userName: { $regex: new RegExp(`^${userName.firstName}${userName.lastName}$`, 'i') } });
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
            userId: req.payload.sub, // Changed to req.payload.sub
        });

        await profile.save();

        return profile;
    } catch (error) {
        throw error;
    }
};


const updateMenteeProfile = async (profileId, role, updatedData, files,user) => {
    try {
        if (role !== 'Mentee' && role !== 'Admin') {
            throw new Error('Unauthorized');
        }

        let profile = await Profile.findById(profileId);
        if (!profile) {
            throw new Error('Profile not found')
        }
        const usr = new mongoose.Types.ObjectId(user._id);
        if (role === "Mentee" && !profile.userId.equals(usr)) {
            throw new Error('Unauthorized to update this profile');
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

const deleteProfileByIdMentor = async (id, role, userId) => {
    try {
        if (role !== 'Mentor' && role !== 'Admin') {
            throw new Error('Unauthorized');
        }

        const profile = await Profile.findById(id);
        if (!profile) {
            throw new Error('Profile not found')
        }

        if (profile.role !== 'Mentor' && profile.role !== 'Admin') {
            throw new Error('Unauthorized');
        }

        const usr = new mongoose.Types.ObjectId(userId);

        // console.log("Profile.userId:", profile.userId);
        // console.log("usr:", usr);

        if (profile.role === "Mentor" && !profile.userId.equals(usr)) {
            throw new Error('Unauthorized to delete this profile');
        }

        const deletedProfile = await Profile.findByIdAndDelete(id);
        if (!deletedProfile) {
            throw new Error('Error deleting profile');
        }

        // Delete profile picture and intro video files
        file_del(profile.profilePicture);
        file_del(profile.introVideo);

        return deletedProfile;
    } catch (error) {
        throw error;
    }
}

const deleteProfileByIdMentee = async (id, role, userId) => {
    try {
        if (role !== 'Mentee' && role !== 'Admin') {
            throw new Error('Unauthorized');
        }

        const profile = await Profile.findById(id);
        if (!profile) {
            throw new Error('Profile not found')
        }
        if (profile.role !== 'Mentee' && profile.role !== 'Admin') {
            throw new Error('Unauthorized');
        }
        const usr = new mongoose.Types.ObjectId(userId);
        if(profile.role === "Mentee" && !profile.userId.equals(usr)) {
            throw new Error('Unauthorized to delete this profile');
        }
        const deletedProfile = await Profile.findByIdAndDelete(id);
        if (!deletedProfile) {
            throw new Error('Error deleting profile');
        }

        // Delete profile picture and intro video files
        file_del(profile.profilePicture);
        file_del(profile.introVideo);

        return deletedProfile;
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
