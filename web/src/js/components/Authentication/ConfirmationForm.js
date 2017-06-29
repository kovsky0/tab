import React from 'react'
import PropTypes from 'prop-types'
import CodeField from 'general/CodeField'
import FlatButton from 'material-ui/FlatButton'
import Snackbar from 'material-ui/Snackbar'
import { confirmRegistration, resendConfirmation } from '../../utils/cognito-auth'

import {
  indigo500
} from 'material-ui/styles/colors'

import appTheme from 'theme/default'

class ConfirmationForm extends React.Component {
  constructor (props) {
    super(props)
    this.code = null
    this.state = {
      confirmSentNotify: false,
      confirmMsg: ''
    }
  }

  _handleKeyPress (e) {
    if (e.key === 'Enter') {
      this.handleSubmit()
    }
  }

  handleSubmit () {
    if (this.code.validate()) {
      const code = this.code.getValue()
      confirmRegistration(code, this.props.email, (res) => {
        this.props.onConfirmed(res)
      }, (err) => {
        this.showAlert(err.message)
      })
    }
  }

  resendConfirmationCode () {
    resendConfirmation(this.props.email, (res) => {
      this.setConfirmationNotification(true,
        'We just sent you a new confirmation code')
    }, (err) => {
      console.error(err)
      this.setConfirmationNotification(false,
        "We're sorry but something went wrong. Try again please.")
    })
  }

  handleRequestClose () {
    this.setConfirmationNotification(false, '')
  }

  setConfirmationNotification (value, message) {
    this.setState({
      confirmSentNotify: value,
      confirmMsg: message
    })
  }

  showAlert (msg) {
    this.setState({
      confirmSentNotify: true,
      confirmMsg: msg
    })
  }

  render () {
    const main = {
      backgroundColor: indigo500,
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }

    const floatingLabelStyle = {
      color: '#FFF'
    }

    const inputStyle = {
      color: '#FFF'
    }

    const labelStyle = {
      textTransform: 'none',
      color: '#FFF'
    }

    const underlineStyle = {
      borderColor: appTheme.palette.borderColor
    }

    const underlineFocusStyle = {
      borderColor: appTheme.palette.alternateTextColor
    }

    return (
      <div style={main}>
        <CodeField
          ref={(input) => { this.code = input }}
          onKeyPress={this._handleKeyPress.bind(this)}
          floatingLabelText='Enter your code'
          floatingLabelStyle={floatingLabelStyle}
          underlineStyle={underlineStyle}
          underlineFocusStyle={underlineFocusStyle}
          inputStyle={inputStyle} />
        <FlatButton
          onClick={this.resendConfirmationCode.bind(this)}
          labelStyle={labelStyle}
          label='Missed the email? No worries, click here to get another code.' />
        <Snackbar
          open={this.state.confirmSentNotify}
          message={this.state.confirmMsg}
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose.bind(this)} />
      </div>
    )
  }
}

ConfirmationForm.propTypes = {
  onConfirmed: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired
}

export default ConfirmationForm