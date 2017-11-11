import React from "react";
import BookShelf from "./BookShelf.js";

const Library = props => {
  return (
    <div className="list-books">
      <div className="list-books-title">
        <h1>MyReads</h1>
      </div>
      <div className="list-books-content">
        <div>
          <BookShelf
            section="Currently Reading"
            books={props.books.filter(book => {
              return book.shelf === "currentlyReading";
            })}
            onShelfChange={props.onShelfChange}
          />
          <BookShelf
            section="Want to Read"
            books={props.books.filter(book => {
              return book.shelf === "wantToRead";
            })}
            onShelfChange={props.onShelfChange}
          />
          <BookShelf
            section="Read"
            books={props.books.filter(book => {
              return book.shelf === "read";
            })}
            onShelfChange={props.onShelfChange}
          />
        </div>
      </div>
      <div className="open-search">
        <a href="/search">Add a book</a>
      </div>
    </div>
  );
};

export default Library;
