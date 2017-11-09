import React from 'react'
import BookShelf from './BookShelf.js'
import Book from './Book.js'
import * as BooksAPI from './BooksAPI'
import './App.css'
import { debounce } from 'lodash'

class BooksApp extends React.Component {
  constructor(props) {
    super(props);
    this.doSearch = debounce((query) =>{
      BooksAPI.search(query, 10).then((result) => {
        this.setState({orphanBooks: result ? result : []})
      })
    },1000);
  }

  state = {
    books : [],
    orphanBooks:[],
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: true
  }

  componentDidMount(){
    BooksAPI.getAll().then((books) => {
      this.setState({books})
    })
  }
  
  onShelfChange(book, e){
    BooksAPI.update(book, e.target.value).then((library) => {
      //Replacing the book stored in state with the one just updated
      let shelfs = Object.keys(library)
      this.setState({books: this.state.books.map((book) => {
        //Every book is get out for shelfs and the reset to latest known position
        book.shelf = ''
        shelfs.forEach((shelf) => {
          //we can skip next shelf if book has been already placed
          !book.shelf && library[shelf].forEach((bookid) => {
            if (bookid === book.id){
              book.shelf = shelf
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
    this.doSearch(query);
  }

  onBookPick(bookid){
    console.log(bookid);
  }

  render() {
    return (
      <div className="app">
        {this.state.showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <a className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</a>
              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                <input type="text" placeholder="Search by title or author" onChange={this.onSearch.bind(this)}/>

              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid">
              {
                this.state.orphanBooks.map((book) =>{
                  return( <li key={book.id}>
                            <Book book={book} onBookPick={this.onBookPick.bind(this)} />
                          </li>)
                })
              }
              </ol>
            </div>
          </div>
        ) : (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <BookShelf  section="Currently Reading" 
                            books={this.state.books.filter((book) => { return book.shelf === 'currentlyReading'})} 
                            onShelfChange={this.onShelfChange.bind(this)}
                            />
                <BookShelf section="Want to Read" books={this.state.books.filter((book) => { return book.shelf === 'wantToRead'})} onShelfChange={this.onShelfChange.bind(this)} />
                <BookShelf section="Read" books={this.state.books.filter((book) => { return book.shelf === 'read'})} onShelfChange={this.onShelfChange.bind(this)} />
              </div>
            </div>
            <div className="open-search">
              <a onClick={() => this.setState({ showSearchPage: true })}>Add a book</a>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default BooksApp
