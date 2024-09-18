import {useCallback, useReducer} from 'react';

import type {Dispatch, Reducer, ReducerAction, ReducerState} from 'react';

type AsyncPipeline<S, A> = (state: Readonly<S>, action: A) => Promise<A>;

export function useReducerPipeline<R extends Reducer<any, any>>(
  reducer: R,
  pipeline: AsyncPipeline<ReducerState<R>, ReducerAction<R>>[],
  initialState: ReducerState<R>,
  initializer?: undefined,
): [ReducerState<R>, Dispatch<ReducerAction<R>>] {
  const [state, dispatch] = useReducer(reducer, initialState, initializer);

  const dispatchPipeline = useCallback(
    async (action: ReducerAction<R>) => {
      let nextAction = action;
      for (const pipe of pipeline) {
        nextAction = await pipe(state, nextAction);
      }
      dispatch(nextAction);
    },
    [pipeline, state],
  );

  return [state, dispatchPipeline];
}
