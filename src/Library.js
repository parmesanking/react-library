import React from 'react'
import BookShelf from './BookShelf.js'


class Library extends React.Component {

  render(){
    return(
        <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <BookShelf  
                  section="Currently Reading" 
                  books={this.props.books.filter((book) => { return book.shelf === 'currentlyReading'})} 
                  onShelfChange={this.props.onShelfChange}/>
                <BookShelf 
                  section="Want to Read" 
                  books={this.props.books.filter((book) => { return book.shelf === 'wantToRead'})} 
                  onShelfChange={this.props.onShelfChange}/>
                <BookShelf 
                  section="Read" 
                  books={this.props.books.filter((book) => { return book.shelf === 'read'})} 
                  onShelfChange={this.props.onShelfChange}/>
              </div>
            </div>
            <div className="open-search">
              <a href="/pick" >Add a book</a>
            </div>
        </div>

    )
  }
}

export default Library