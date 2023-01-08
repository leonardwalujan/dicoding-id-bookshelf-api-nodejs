// Import nanoid untuk membuat ID unik
const { nanoid } = require('nanoid');
const books = require('./books');

// Bagian menambahkan buku
const tambahkanBuku = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  // Jika tidak ada nama yang diinput maka data gagal diinput
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    // Sebaliknya jika, Halaman yang dibaca lebih besar dari Jumlah Halaman maka data gagal diinput
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // Bagian ini akan dieksekusi jika data yang diinput sudah benar semua
  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  // Jika data yang diinput semuanya benar, maka data berhasil ditambahkan
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  } else {
    // Sebaliknya, ketika data yang diinput semuanya salah, maka data gagal ditambahkan
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
  }
};

// Bagian menampilkan semua buku
const tampilkanSemuaBuku = (request, h) => {
  // Request query untuk bagian data yang akan difilter nanti
  const { name, reading, finished } = request.query;
  // Jika ada data, maka lakukan proses filter data
  if (books.length > 0) {
    let filteredBooks = books;
    // Filter data berdasarkan nama buku
    if (name) {
      filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    }
    // Filter data berdasarkan buku yang sedang dibaca
    if (reading) {
      filteredBooks = filteredBooks.filter((book) => book.reading == Number(reading));
    }
    // Filter data berdasarkan buku yang sudah selesai dibaca
    if (finished) {
      filteredBooks = filteredBooks.filter((book) => book.finished == Number(finished));
    }
    // Menampilkan keseluruhan data
    const response = h.response({
      status: 'success',
      data: {
        books: filteredBooks.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  } else {
    // Sebaliknya, Jika data belum tersedia, maka tampilkan data kosong
    const response = h.response({
      status: 'success',
      data: {
        books: [],
      },
    });
    response.code(200);
    return response;
  }
};

// Bagian pencarian buku berdasarkan ID yang dipilih
const cariBukuOlehID = (request, h) => {
  // Request parameter adalah ID buku, yang dimana kita akan mencari buku berdasarkan ID buku
  const { bookId } = request.params;
  const book = books.filter((book) => book.id === bookId)[0];

  // Jika buku yang dicari tidak ada maka muncul pesan gagal
  if (!book) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  } else {
    // Sebaliknya, ketika buku yang dicari ada maka muncul data buku tersebut berdasarkan ID buku yang dicari
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
};

// Bagian penyuntingan informasi buku
const editBukuOlehID = (request, h) => {
  // Request parameter adalah ID buku, yang dimana kita akan menyunting informasi buku berdasarkan ID buku
  const { bookId } = request.params;
  // Request payload ini yang dimana bagian" ini akan diedit isi datanya
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  const updatedAt = new Date().toISOString();

  // Bagian ini akan mencari ID buku yang berada di indeks ke berapa
  const index = books.findIndex((book) => book.id === bookId);

  // Jika ID tersebut yang dicari di setiap index array tidak ada, maka gagal memperbarui buku tersebut
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  } else {
    if (name === undefined) {
      // Jika saat mengubah nama lalu input nama tersebut kosong, maka data buku gagal diperbarui
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    } else if (readPage > pageCount) {
      // Sebaliknya jika saat mengubah halaman buku yang dibaca lebih dari jumlah halaman, maka data buku gagal diperbarui
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    } else {
      // Sebaliknya, ketika mengubah data buku sesuai kriteria, maka data buku berhasil diperbarui
      const finished = pageCount === readPage;
      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        updatedAt,
      };
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      });
      response.code(200);
      return response;
    }
  }
};

// Bagian menghapus buku berdasarkan ID
const hapusBukuOlehID = (request, h) => {
  // Request parameter adalah ID buku, yang dimana kita akan menghapus buku berdasarkan ID buku
  const { bookId } = request.params;

  // Bagian ini akan mencari ID buku yang berada di indeks ke berapa
  const index = books.findIndex((book) => book.id === bookId);

  // Jika ID tersebut yang dicari di setiap index array tidak ada, maka buku gagal dihapus
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  } else {
    // Sebaliknya, ketika ID buku tersebut ada, maka data buku berhasil dihapus
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
};

module.exports = { tambahkanBuku, tampilkanSemuaBuku, cariBukuOlehID, editBukuOlehID, hapusBukuOlehID };
