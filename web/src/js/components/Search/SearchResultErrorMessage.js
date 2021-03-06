import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Link from 'js/components/General/Link'

const SearchResultErrorMessage = props => {
  const { query, ...otherProps } = props
  return (
    <div {...otherProps}>
      <Typography variant={'body1'} gutterBottom>
        Unable to search at this time.
      </Typography>
      <Link
        to={
          query
            ? `https://www.google.com/search?q=${encodeURI(query)}`
            : 'https://www.google.com'
        }
        target="_top"
      >
        <Button color={'primary'} variant={'contained'} size={'small'}>
          Search Google
        </Button>
      </Link>
    </div>
  )
}

SearchResultErrorMessage.propTypes = {
  query: PropTypes.string,
}
SearchResultErrorMessage.defaultProps = {}

export default SearchResultErrorMessage
