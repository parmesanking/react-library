import React from 'react'

class ShelfSelector extends React.Component {
    
    onShelfMove(e){
        if (e.target.value === "none"){
            if(confirm('You are going to remove that book from your libray. Are you sure?')){
                this.props.onShelfChange(this.props.book, e)
            }
        }else{
            this.props.onShelfChange(this.props.book, e)
        }
    }
    
    render(){
        return (
        <div className="book-shelf-changer">
            <select onChange={this.onShelfMove.bind(this)} value={this.props.book.shelf}> 
            <option value="none" disabled>Move to...</option>
            <option value="currentlyReading">Currently Reading</option>
            <option value="wantToRead">Want to Read</option>
            <option value="read">Read</option>
            <option value="none">None</option>
            </select>
        </div>
        )
    }
}


export default ShelfSelector