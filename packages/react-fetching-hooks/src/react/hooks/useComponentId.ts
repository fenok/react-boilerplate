import {v1 as uuid} from 'uuid';
import * as React from 'react';

export function useComponentId() {
    return React.useMemo(() => uuid(), []);
}
