import React from "react";

const promises = {};

const makeCancelable = (promise) => {
  const cancelError = new Error('Promise has been canceled');
  cancelError.type = 'promiseCanceled';

  let rejectFn;
  const wrappedPromise = new Promise((resolve, reject) => {
    rejectFn = reject;
    promise.then(resolve, reject);
  });

  return {
    promise: wrappedPromise,
    cancel() {
      rejectFn(cancelError);
    },
  };
};

function smartPromise(componentName, promise) {
  if (!promises[componentName]) {
    promises[componentName] = [];
  }
  const newPromise = makeCancelable(promise);
  promises[componentName].push(newPromise);
  return newPromise.promise;
}

function abortPromises(componentName) {
  if (promises[componentName]) {
    promises[componentName].forEach(p => {
      p.cancel();
    });
    promises[componentName] = undefined;
  }
}

export { smartPromise, abortPromises };
