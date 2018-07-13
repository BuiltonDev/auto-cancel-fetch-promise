const fetchQueries = {};
const AbortController = window.AbortController;

function smartFetch(componentName, ...args) {
  const controller = new AbortController();
  if (!fetchQueries[componentName]) {
    fetchQueries[componentName] = [];
  }
  fetchQueries[componentName].push(controller);
  args[1] = args[1] ? args[1] : {};
  args[1].signal = controller.signal;
  return fetch(...args);
}

function abortFetches(componentName) {
  if (fetchQueries[componentName]) {
    fetchQueries[componentName].forEach(controller => {
      controller.abort();
    });
    fetchQueries[componentName] = undefined;
  }
}

export { smartFetch, abortFetches };
