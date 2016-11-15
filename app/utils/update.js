/* eslint-disable no-param-reassign */
const getObjValue = (field, data) => (
  field.split('.').reduce((obj, key) => {
    if (obj) return obj[key];
    return null;
  }, data)
);

const setObjValue = (field, data, value) => {
  const fieldArr = field.split('.');
  return fieldArr.reduce((obj, key, index) => {
    if (index === fieldArr.length - 1) {
      obj[key] = value;
    } else if (!obj[key]) {
      obj[key] = {};
    }
    return obj[key];
  }, data);
};

/* eslint-enable */

module.exports.updateDocument = (doc, SchemaTarget, data) => {
  Object.keys(SchemaTarget.schema.paths).forEach((field) => {
    if ((field !== '_id') && (field !== '__v')) {
      const newValue = getObjValue(field, data);
      if (newValue !== undefined) {
        setObjValue(field, doc, newValue);
      }
    }
  });
  return doc;
};
