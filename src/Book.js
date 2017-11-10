import React from 'react'
import ShelfSelector from './ShelfSelector.js'


class Book extends React.Component {
  
  onBookPicked(bookid){
      if(confirm('You picked this book for your "Wants to read" list, right?')){
              this.props.onBookPick(bookid);
      }
  }
  

  render(){
    //on certain books imageLinks or thumbnail are not set
    const thumbNail = (this.props.book.imageLinks && this.props.book.imageLinks.thumbnail) ?  
                        this.props.book.imageLinks.thumbnail ? 
                          this.props.book.imageLinks.thumbnail 
                          : ''
                        : ''
    return(
      <div>
        <div className="book">
          <div className="book-top">
            
            <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: 'url("' + thumbNail + '")' }}></div>
            <ShelfSelector book={this.props.book} onShelfChange={this.props.onShelfChange} picker={this.props.picker}/>

          </div>
          <div className="book-title">{this.props.book.title}</div>
          <div className="book-authors">{this.props.book.authors && this.props.book.authors.map((author) => {
              return (<label key={author}>{author}<br /> </label>)
          })}
          </div>
        </div>
      </div>
    )
  }
}

export default Book