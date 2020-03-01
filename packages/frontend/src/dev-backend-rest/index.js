const express = require('express');

const app = express();

const books = {
    1: {
        id: 1,
        title: 'Book 1',
        authorId: 2
    },
    2: {
        id: 2,
        title: 'Book 2',
        authorId: 1,
    }
};

const authors = {
    1: {
        id: 1,
        name: 'Author 1',
    },
    2: {
        id: 2,
        name: 'Author 2',
    }
};

app.use((request, response, next) => {
    response.set('Access-Control-Allow-Origin', "*");
    next();
});

app.get('/books', async(request, response) => {
    await wait(3000);

    response.set('').send({data: Object.values(books)});
});

app.get('/books/:id', async(request, response) => {
    await wait(3000);
    const book = books[request.params.id];

    if(book) {
        return response.send({data: book});
    }

    return response.status(404).send({error: 'NOT_FOUND'})
});

app.listen(3001);

function wait(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

// eslint-disable-next-line no-console
console.log(`Dev server is up at http://localhost:${3001}`);
