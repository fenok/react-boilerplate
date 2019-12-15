import * as React from 'react';
import { Edit, ReactAdminComponentPropsWithId, ReferenceInput, SelectInput, SimpleForm, TextInput } from 'react-admin';
import { ResourceName } from '../../../lib/dataProvider/ResourceName';

export const BookEdit = (props: ReactAdminComponentPropsWithId) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="title" />
            <ReferenceInput source="relations.author.id" reference={ResourceName.AUTHOR}>
                <SelectInput optionText="name" />
            </ReferenceInput>
        </SimpleForm>
    </Edit>
);
