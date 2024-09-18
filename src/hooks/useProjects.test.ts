/**
 * @jest-environment jsdom
 */

import {renderHook} from '@testing-library/react';

import {useProject, useProjects} from './useProjects';

import type {ProjectSettingIndex} from './useProjects';

global.fetch = jest.fn();

describe('useProjects', () => {
  beforeEach(() => {
    jest.mock('jotai', () => ({
      useAtom: jest.fn(
        (): [ProjectSettingIndex[], () => void] =>
          [
            [
              {id: 'project-1', key: '1'},
              {id: 'project-2', key: '2'},
            ],
            jest.fn(),
          ] as const,
      ),
    }));
  });

  it('should fetch a project from kv store', () => {
    renderHook(() => useProjects());
  });
});

describe('useProject', () => {
  it('should fetch a project from kv store', () => {
    renderHook(() => useProject('0'));
  });
});
