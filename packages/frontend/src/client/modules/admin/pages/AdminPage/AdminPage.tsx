import jsonServerProvider from 'ra-data-json-server';
import * as React from 'react';
import { Admin, ListGuesser, Resource } from 'react-admin';
import { useIsClientSide } from '../../../common/lib/react-hooks/useIsClientSide';
import { CommonProps } from '../../../common/types/CommonProps';

interface Props extends CommonProps {}

const provider = jsonServerProvider('http://jsonplaceholder.typicode.com');

const AdminPage: React.FC<Props> = () => {
    const isClientSide = useIsClientSide();

    return isClientSide ? (
        <Admin dataProvider={provider}>
            <Resource name="users" list={ListGuesser} />
        </Admin>
    ) : null;
};

export { AdminPage, Props };
