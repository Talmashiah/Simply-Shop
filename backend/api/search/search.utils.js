const ObjectId = require('mongodb').ObjectId;

const createFilters = (specKeys, specValues, selectedFilters) => {
    console.log('selectedFilters: ', selectedFilters);
    console.log('specValues: ', specValues);

    let newFilters = [];
    if (selectedFilters.length > 0) {
        specValues = _updateSpecValues(specValues, selectedFilters);
    }
    for (let specKey of specKeys) {
        let KeyValues = [];
        for (let value of specValues) {
            if (value.specKeyId.toString() === specKey._id.toString()) {
                KeyValues.push(value);
            }
        }
        newFilters.push({ key: specKey.name, values: KeyValues });
    }
    return newFilters;
};

const buildCriteria = (filterBy) => {
    const criteria = {};
    if (filterBy.categoryId) {
        criteria['categoryId'] = ObjectId(filterBy.categoryId);
    }
    if (filterBy.priceFilter.min || filterBy.priceFilter.max) {
        criteria['price'] = { $gte: filterBy.priceFilter.min || 0, $lte: filterBy.priceFilter.max || Infinity }
    }
    if (filterBy.filters && filterBy.filters.length > 0) {
        const filterIds = filterBy.filters.map(filter => ObjectId(filter._id));
        criteria['specValues'] = { $all: filterIds };
    }
    return criteria;
}

const _updateSpecValues = (values, filters) => {
    return values.map(value => {
        let updateValue = { ...value, selected: false };
        for (const filter of filters) {
            if (filter._id.toString() === value._id.toString()) {
                updateValue = { ...value, selected: true };
            }
        }
        return updateValue;
    })
}

module.exports = {
    createFilters,
    buildCriteria
}