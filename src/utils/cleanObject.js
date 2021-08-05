// https://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript

const cleanObj = (obj) => {
    const newObj = { ...obj };
    Object.keys(newObj).forEach((key) => {
        if (
            newObj[key] === null ||
            newObj[key] === undefined ||
            newObj[key] === '' ||
            // Jika object kosong (ex: {"key": {}})
            (newObj[key] &&
                Object.keys(newObj[key]).length === 0 &&
                newObj[key].constructor === Object)
        ) {
            delete newObj[key];
        }
    });
    return newObj;
};

module.exports = cleanObj;
