const isStrictlyEqual = (obj1, obj2) => obj1 === obj2;

export default function observerMiddleware(onUpdate, options = {}) {
  const pred = options.compareWith || isStrictlyEqual;

  return ({ getState }) => next => action => {
    const prevState = getState();
    const returnValue = next(action);
    const nextState = getState();

    if (!pred(nextState, prevState)) {
      onUpdate(nextState, prevState);
    }

    return returnValue;
  };
}
