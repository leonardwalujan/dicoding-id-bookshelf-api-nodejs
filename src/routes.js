const { tambahkanBuku, tampilkanSemuaBuku, cariBukuOlehID, editBukuOlehID, hapusBukuOlehID } = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: tambahkanBuku,
  },
  {
    method: 'GET',
    path: '/books',
    handler: tampilkanSemuaBuku,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: cariBukuOlehID,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBukuOlehID,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: hapusBukuOlehID,
  },
];

module.exports = routes;
