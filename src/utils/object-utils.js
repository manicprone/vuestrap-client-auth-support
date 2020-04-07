import lodashObject from 'lodash/object'
import lodashLang from 'lodash/lang'
import lodashArray from 'lodash/array'
import lodashCollection from 'lodash/collection'

export default {
  get: lodashObject.get,
  has: lodashObject.has,
  mapValues: lodashObject.mapValues,
  isEmpty: lodashLang.isEmpty,
  remove: lodashArray.remove,
  includes: lodashCollection.includes,
  filter: lodashCollection.filter,
}
