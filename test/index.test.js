import chai from 'chai';
import { stub } from 'sinon';
import observerMiddleware from '../src';

const { expect } = chai;

describe('observer middleware', () => {
  const state1 = {};
  const state2 = { foo: 'foo', bar: 'bar' };
  const state3 = { foo: 'foo', bar: 'baz' };
  const next = () => 'DUMMY RETURN VALUE';
  const action = { type: 'ACTION_TYPE' };
  let updateHandler;

  beforeEach(() => {
    updateHandler = stub();
  });

  describe('with default options', () => {
    let getState;
    let nextHandler;
    let returnValue;

    beforeEach(() => {
      getState = stub();
      nextHandler = observerMiddleware(updateHandler)({ getState });
    });

    describe('when state strictly changes', () => {

      beforeEach(() => {
        getState.onCall(0).returns(state1);
        getState.onCall(1).returns(state2);
        returnValue = nextHandler(next)(action);
      });

      it('should call update callback', () => {
        expect(updateHandler.calledWith(state2, state1)).to.be.true;
      });

      it('should pass along return value of "next" callback', () => {
        expect(returnValue).to.equal('DUMMY RETURN VALUE');
      });
    });

    describe('when state does not change', () => {

      beforeEach(() => {
        getState.returns(state1);
        returnValue = nextHandler(next)(action);
      });

      it('should not call update callback', () => {
        expect(updateHandler.called).to.be.false;
      });

      it('should pass along return value of "next" callback', () => {
        expect(returnValue).to.equal('DUMMY RETURN VALUE');
      });
    });
  });

  describe('with options.compareWith specified', () => {
    let getState;
    let nextHandler;
    let returnValue;
    let options;

    beforeEach(() => {
      getState = stub();
      options = { compareWith: (obj1, obj2) => obj1.bar === obj2.bar };
      nextHandler = observerMiddleware(updateHandler, options)({ getState });
    });

    describe('when state changes as per predicate function', () => {

      beforeEach(() => {
        getState.onCall(0).returns(state2);
        getState.onCall(1).returns(state3);
        returnValue = nextHandler(next)(action);
      });

      it('should call update callback', () => {
        expect(updateHandler.calledWith(state3, state2)).to.be.true;
      });

      it('should pass along return value of "next" callback', () => {
        expect(returnValue).to.equal('DUMMY RETURN VALUE');
      });
    });

    describe('when state does not change', () => {

      beforeEach(() => {
        getState.returns(state1);
        returnValue = nextHandler(next)(action);
      });

      it('should not call update callback', () => {
        expect(updateHandler.called).to.be.false;
      });

      it('should pass along return value of "next" callback', () => {
        expect(returnValue).to.equal('DUMMY RETURN VALUE');
      });
    });
  });
});
