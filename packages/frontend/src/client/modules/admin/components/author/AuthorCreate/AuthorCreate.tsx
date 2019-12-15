import * as React from 'react';
import { Create, ReactAdminComponentProps, SimpleForm, TextInput } from 'react-admin';

export const AuthorCreate = (props: ReactAdminComponentProps) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="name" />
        </SimpleForm>
    </Create>
);
