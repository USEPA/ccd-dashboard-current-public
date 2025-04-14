export default $axios => resource => ({

  index(params) {
    // console.log('base repository find url: ', `${resource}${params}`)
    try {
      const result = $axios.$get(`${resource}${params}`);
      return result;
    } catch (err) {
      const errorMsg = `${err.message} - ${err.statusText}`;
      return errorMsg;
    }
  },

  async find(id) {
    // console.log('base repository find url: ', `${resource}?id=${id}`)
    let errorMsg = '';
    try {
      return await $axios.$get(`${resource}?id=${id}`);
    } catch (err) {
      errorMsg = `${err.message} - ${err.statusText}`;
      return null;
    }
  },

  search(searchString) {
    // console.log('base repository find url: ', `${resource}${searchString}`)
    try {
      return $axios.$get(`${resource}${searchString}`);
    } catch (err) {
      const errorMsg = `${err.message} - ${err.statusText}`;
      return errorMsg;
    }
  },

  show(id) {
    return $axios.$get(`${resource}/${id}`);
  },

  create(payload) {
    return $axios.$post(`${resource}`, payload);
  },
});
