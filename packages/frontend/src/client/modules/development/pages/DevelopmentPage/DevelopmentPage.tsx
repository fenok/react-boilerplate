import * as React from 'react';
import styled from 'styled-components';
import { useQuery, PartialRequestData } from 'react-fetching-hooks'
import { Page } from '../../../common/components/Page';
import { CommonProps } from '../../../common/types/CommonProps';

/** Don't forget to extend CommonProps */
interface Props extends CommonProps {
    name?: string;
}

interface Book {
    id: number;
    title: string;
    authorId: number;
}

interface MutualData {
    books: Record<string, {data: Book}>
}

interface BookResponse {
    data: Book;
}

const bookRequest: PartialRequestData<MutualData, BookResponse, {id: string}> = {
    pathParams: {id: '1'},
    path: '/books/:id',
    toCache(mutualData: MutualData, responseData: BookResponse): MutualData {
        return {
            ...mutualData,
            books: {...(mutualData.books || {}), [responseData.data.id]: responseData}
        }
    },
    fromCache(mutualData: MutualData, requestInit): BookResponse {
        const book = mutualData.books[requestInit.pathParams.id];

        if(book) {
            return book;
        }

        throw new Error('Book not found in cache');
    },
};

const DevelopmentPage: React.FC<Props> = ({ className }) => {
    const [firstId, setFirstId] = React.useState('1');
    const [secondId, setSecondId] = React.useState('1');

    const toggleFirstId = React.useCallback(() => {
        setFirstId(id => id === '1' ? '2' : '1');
    }, [])

    const toggleSecondId = React.useCallback(() => {
        setSecondId(id => id === '1' ? '2' : '1');
    }, [])


    const state = useQuery({...bookRequest, pathParams: {id: firstId}});

    const secondState = useQuery({...bookRequest, pathParams: {id: secondId}});

    console.log('second state', secondState)

    return (
        /** It's mandatory to pass className to root element */
        <Root
            className={className}
            ogTitle="Development page"
            bodyBackground="#008080"
        >
            {JSON.stringify(state.loading)}
            <div>------</div>
            {JSON.stringify(state.data)}
            <div>------</div>
            {JSON.stringify(state.error?.message)}
            <div>------</div>
            {JSON.stringify(secondState.loading)}
            <div>------</div>
            {JSON.stringify(secondState.data)}
            <div>------</div>
            {JSON.stringify(secondState.error?.message)}
            <div>------</div>
            <button onClick={() => state.abort()}>abort 1</button>
            <button onClick={() => secondState.abort()}>abort 2</button>
            <div>------</div>
            <button onClick={() => state.abort(true)}>abort 1 multi</button>
            <button onClick={() => secondState.abort(true)}>abort 2 multi</button>
            <div>------</div>
            <button onClick={() => state.refetch()}>refetch 1</button>
            <button onClick={() => secondState.refetch()}>refetch 2</button>
            <div>------</div>
            <button onClick={toggleFirstId}>toggle first id</button>
            <button onClick={toggleSecondId}>toggle second id</button>
        </Root>
    );
};

/** Styled components */

const Root = styled(Page)``;

/** Single export is mandatory */
export { DevelopmentPage, Props };
