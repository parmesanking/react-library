import React from "react";
import Book from "./Book.js";

class BookShelf extends React.Component {
  render() {
    let books = "";
    books =
      this.props.books &&
      this.props.books.map(book => {
        return (
          <li key={book.id}>
            <Book book={book} onShelfChange={this.props.onShelfChange} />
          </li>
        );
      });

    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">{this.props.section}</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">{books}</ol>
        </div>
      </div>
    );
  }
}

export default BookShelf;
