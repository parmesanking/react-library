import React from 'react'
import { Route, BrowserRouter } from 'react-router-dom'
import BookShelf from './BookShelf.js'
import Book from './Book.js'
import * as BooksAPI from './BooksAPI'
import './App.css'
import { debounce } from 'lodash'

class BooksApp extends React.Component {
  constructor(props) {
    super(props);
    this.doSearch = debounce((query) => {
      BooksAPI.search(query, 10).then((result) => {
        this.setState({orphanBooks: (result && result.length > 0) ? result : []})
      }).catch((err) => {
        //TODO error handling
        console.log(err);
      });
    },1000);
  }

  state = {
    books : [],
    orphanBooks:[]
  }

  componentDidMount(){
    //Loading library
    BooksAPI.getAll().then((books) => {
      this.setState({books});
    })
  }
  
  onShelfChange(book, e){
    BooksAPI.update(book, e.target.value).then((library) => {
      //Replacing the book stored in state with the one just updated
      let shelfs = Object.keys(library);
      this.setState({books: this.state.books.map((book) => {
        //Every book is get out for shelfs and the reset to latest known position
        book.shelf = '';
        shelfs.forEach((shelf) => {
          //we can skip next shelf if book has been already placed
          !book.shelf && library[shelf].forEach((bookid) => {
            if (bookid === book.id){
              book.shelf = shelf;
            }
          })
        })
        return book
      })
      })
    })
  }

  onSearch(e){
    let query = e.target.value;
    //Searching on backend without http flooding
    query && this.doSearch(query);
  }

  onBookPick(bookid,e){
    const shelf = 'wantToRead';
    BooksAPI.update({id: bookid}, shelf).then((result) => {
      //All done, removing that book from searched list
      this.setState({orphanBooks: this.state.orphanBooks.filter((book) => { return (book.id !== bookid)})});
      
      /**
       * Refreshing the libraryygetting the single book in place of refreshing the full list (it can be huge!)
       * That part is not used now that Router has been added, but it should be useful in case of Pick feature is added as part of library (not a separate page)
       */
      //Verifying if the new book has been added into the shelf
      if (result[shelf].find((id) => { return id === bookid})){
        //new book is there... pick and push 
        BooksAPI.get(bookid).then((book) => {
          let library = this.state.books.concat([book]);
          this.setState({ books: library});
        })
      }
    })
  }

  render() {
    return (
      <BrowserRouter>
      <div className="app">
      <Route path="/pick" render={() => (
        <div className="search-books">
        <div className="search-books-bar">
          <a className="close-search" href="/">Close</a>
          <div className="search-books-input-wrapper">
            <input type="text" placeholder="Search by title or author" onChange={this.onSearch.bind(this)}/>
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
          { this.state.orphanBooks.map((book) => {
              return( <li key={book.id}>
                        <Book book={book} onBookPick={this.onBookPick.bind(this)} />
                      </li>)
            })
          }
          </ol>
        </div>
      </div>
      )} />

      <Route path="/" exact render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <BookShelf  
                  section="Currently Reading" 
                  books={this.state.books.filter((book) => { return book.shelf === 'currentlyReading'})} 
                  onShelfChange={this.onShelfChange.bind(this)}/>
                <BookShelf 
                  section="Want to Read" 
                  books={this.state.books.filter((book) => { return book.shelf === 'wantToRead'})} 
                  onShelfChange={this.onShelfChange.bind(this)} />
                <BookShelf 
                  section="Read" 
                  books={this.state.books.filter((book) => { return book.shelf === 'read'})} 
                  onShelfChange={this.onShelfChange.bind(this)} />
              </div>
            </div>
            <div className="open-search">
              <a href="/pick" >Add a book</a>
            </div>
          </div>
    )} />
      
      </div>
      </BrowserRouter>
    )
  }
}

export default BooksApp
