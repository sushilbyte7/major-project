const Provider = require('../models/Provider');

// @desc    Get all providers
// @route   GET /api/providers
// @access  Public
const getProviders = async (req, res) => {
    try {
        const providers = await Provider.find({ isAvailable: true }).populate('service', 'name category');
        res.json(providers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single provider
// @route   GET /api/providers/:id
// @access  Public
const getProvider = async (req, res) => {
    try {
        const provider = await Provider.findById(req.params.id).populate('service', 'name category price');
        if (!provider) return res.status(404).json({ message: 'Provider not found' });
        res.json(provider);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get providers by service
// @route   GET /api/providers?service=:serviceId
// @access  Public
const getProvidersByService = async (req, res) => {
    try {
        const filter = { isAvailable: true };
        if (req.query.service) filter.service = req.query.service;
        const providers = await Provider.find(filter).populate('service', 'name category');
        res.json(providers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a provider
// @route   POST /api/providers
// @access  Admin
const createProvider = async (req, res) => {
    try {
        const provider = await Provider.create(req.body);
        res.status(201).json(provider);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a provider
// @route   PUT /api/providers/:id
// @access  Admin
const updateProvider = async (req, res) => {
    try {
        const provider = await Provider.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!provider) return res.status(404).json({ message: 'Provider not found' });
        res.json(provider);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a provider
// @route   DELETE /api/providers/:id
// @access  Admin
const deleteProvider = async (req, res) => {
    try {
        const provider = await Provider.findByIdAndDelete(req.params.id);
        if (!provider) return res.status(404).json({ message: 'Provider not found' });
        res.json({ message: 'Provider removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProviders, getProvider, getProvidersByService, createProvider, updateProvider, deleteProvider };
