import React from 'react'
import { Route, BrowserRouter } from 'react-router-dom'
import Library from './Library.js'
import Finder from './Finder.js'
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
  
  onShelfChange(book, shelf, onBookPlaced){
    BooksAPI.update(book, shelf).then((library) => {
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
      },() => {
        //Book has been placed and set to state, notify it if needed
        onBookPlaced && onBookPlaced();
        }
      )
    })
  }

  onSearch(e){
    let query = e.target.value;
    //Searching on backend without http flooding
    query && this.doSearch(query);
  }

  onBookPick(book,shelf){
    //Placing the book on the shelf
    this.onShelfChange(book, shelf, () => {
      //All done, removing that book from searched list
      this.setState({orphanBooks: this.state.orphanBooks.filter((b) => { return (b.id !== book.id)})});
    });
  }

  render() {
    return (
      <BrowserRouter>
        <div className="app">
          <Route path="/pick" render={() => 
            <Finder 
              books={this.state.orphanBooks}
              onSearch={(e) => this.onSearch(e)}
              onShelfChange={(book, shelf) => this.onBookPick(book, shelf)} />} />

          <Route path="/" exact render={() =>
            <Library
              books={this.state.books} 
              onShelfChange={(book, shelf) => this.onShelfChange(book, shelf)} />} />
          
        </div>
      </BrowserRouter>
    )
  }
}

export default BooksApp
