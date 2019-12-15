import * as React from 'react';
import { Edit, ReactAdminComponentPropsWithId, SimpleForm, TextInput } from 'react-admin';

export const AuthorEdit = (props: ReactAdminComponentPropsWithId) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="name" />
        </SimpleForm>
    </Edit>
);
