import React from 'react'
import PropTypes from 'prop-types'

import WidgetSharedSpace from 'general/WidgetSharedSpace'
import {List} from 'general/List'

import Note from './Note'
import AddNoteForm from './AddNoteForm'
import UpdateWidgetDataMutation from 'mutations/UpdateWidgetDataMutation'

class NotesWidget extends React.Component {
  constructor (props) {
    super(props)
    this.noteColors = ['#A5D6A7', '#FFF59D', '#FFF', '#FF4081', '#2196F3', '#757575', '#FF3D00']
    this.state = {
      notes: []
    }
  }

  componentDidMount () {
    const { widget } = this.props

    const data = JSON.parse(widget.data)
    const notes = data.notes || []

    this.setState({
      notes: notes
    })
  }

  updateWidget (notes) {
    const widgetData = {
      notes: notes
    }

    const data = JSON.stringify(widgetData)

    UpdateWidgetDataMutation.commit(
      this.props.relay.environment,
      this.props.user,
      this.props.widget,
      data
    )
  }

  addNewNote (text) {
    const colorIndex = Math.floor(Math.random() * this.noteColors.length)
    const newNote = {
      id: this.randomString(6),
      color: this.noteColors[colorIndex],
      content: text
    }

    this.state.notes.splice(0, 0, newNote)
    this.updateWidget(this.state.notes)

    this.setState({
      notes: this.state.notes
    })
  }

  removeStickyNote (index) {
    this.state.notes.splice(index, 1)
    this.updateWidget(this.state.notes)

    this.setState({
      notes: this.state.notes
    })
  }

  // This is a temporary solution since we are updating the
  // widget data, if we have specific mutations for the notes
  // then we should generate the id of the note on the server.
  randomString (length) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var result = ''
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
    return result
  }

  render () {
    const sharedSpaceStyle = {
      overflowX: 'visible',
      overflowY: 'visible',
      overflow: 'visible'
    }

    const notesContainer = {
      overflowY: 'scroll',
      overflowX: 'hidden',
      height: '70vh'
    }

    const mainContainer = {
      display: 'flex',
      flexDirection: 'column',
      marginTop: 27
    }

    return (<WidgetSharedSpace
      containerStyle={sharedSpaceStyle}>
      <div style={mainContainer}>
        <AddNoteForm
          addNote={this.addNewNote.bind(this)} />
        <List
          containerStyle={notesContainer}>
          {this.state.notes.map((note, index) => {
            return (
              <Note
                key={note.id}
                index={index}
                removeStickyNote={this.removeStickyNote.bind(this)}
                note={note} />
            )
          })}
        </List>
      </div>
    </WidgetSharedSpace>)
  }
}

NotesWidget.propTypes = {
  widget: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  widgetVisibilityChanged: PropTypes.func.isRequired
}

export default NotesWidget