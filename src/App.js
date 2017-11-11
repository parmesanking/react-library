import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import Library from "./Library.js";
import Finder from "./Finder.js";
import NotFound from "./NotFound.js";
import * as BooksAPI from "./BooksAPI";
import "./App.css";
import { debounce } from "lodash";

class BooksApp extends React.Component {
  constructor(props) {
    super(props);
    this.doSearch = debounce(query => {
      BooksAPI.search(query, 10)
        .then(result => {
          //book already in the ilbrary should be decorated with shelf name
          let books = result
            ? result.map(book => {
                let b = this.state.books.find(b => b.id === book.id);
                book.shelf = b ? b.shelf : "";
                return book;
              })
            : [];
          this.setState({ orphanBooks: books });
        })
        .catch(err => {
          //TODO error handling
          console.log(err);
        });
    }, 300);
  }

  state = {
    books: [],
    orphanBooks: []
  };

  componentDidMount() {
    //Loading library
    BooksAPI.getAll().then(books => {
      this.setState({ books });
    });
  }

  onShelfChange(book, shelf, onBookPlaced) {
    BooksAPI.update(book, shelf).then(library => {
      //Replacing the book stored in state with the one just updated
      let shelfs = Object.keys(library);
      this.setState(
        {
          books: this.state.books.map(book => {
            //Every book is get out for shelfs and the reset to latest known position
            book.shelf = "";
            shelfs.forEach(shelf => {
              //we can skip next shelf if book has been already placed
              !book.shelf &&
                library[shelf].forEach(bookid => {
                  if (bookid === book.id) {
                    book.shelf = shelf;
                  }
                });
            });
            return book;
          })
        },
        () => {
          //Book has been placed and set to state, notify it if needed
          onBookPlaced && onBookPlaced();
        }
      );
    });
  }

  onSearch(e) {
    let query = e.target.value;
    //Searching on backend without http flooding
    if (query) {
      this.doSearch(query);
    } else {
      this.setState({ orphanBooks: [] });
    }
  }

  onBookPick(book, shelf) {
    //Placing the book on the shelf
    this.onShelfChange(book, shelf, () => {
      //All done, removing that book from searched list
      this.setState({
        orphanBooks: this.state.orphanBooks.filter(b => {
          return b.id !== book.id;
        })
      });
    });
  }

  render() {
    return (
      <BrowserRouter>
        <div className="app">
          <Switch>
            <Route
              path="/search"
              render={() => (
                <Finder
                  books={this.state.orphanBooks}
                  onSearch={e => this.onSearch(e)}
                  onShelfChange={(book, shelf) => this.onBookPick(book, shelf)}
                />
              )}
            />

            <Route
              path="/"
              exact
              render={() => (
                <Library
                  books={this.state.books}
                  onShelfChange={(book, shelf) =>
                    this.onShelfChange(book, shelf)
                  }
                />
              )}
            />
            <Route component={NotFound}/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default BooksApp;
