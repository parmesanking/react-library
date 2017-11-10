import React from "react";
import Book from "./Book.js";

class Finder extends React.Component {
  render() {
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <a className="close-search" href="/">
            Close
          </a>
          <div className="search-books-input-wrapper">
            <input
              type="text"
              placeholder="Search by title or author"
              onChange={this.props.onSearch}
            />
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {this.props.books &&
              this.props.books.map(book => {
                return (
                  <li key={book.id}>
                    <Book
                      book={book}
                      onShelfChange={this.props.onShelfChange}
                      picker
                    />
                  </li>
                );
              })}
          </ol>
        </div>
      </div>
    );
  }
}

export default Finder;
