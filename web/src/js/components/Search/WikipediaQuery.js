import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash/object'
import sanitizeHtml from 'sanitize-html'
import fetchWikipediaResults from 'js/components/Search/fetchWikipediaResults'
import WikipediaPage from 'js/components/Search/WikipediaPageComponent'

class WikipediaQuery extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      queryInProgress: false,
      responseData: null,
    }
  }

  componentDidMount() {
    this.queryWikipedia()
  }

  componentDidUpdate(prevProps) {
    // Fetch Wikipedia data if a query exists and has changed.
    if (this.props.query && this.props.query !== prevProps.query) {
      this.queryWikipedia()
    }
  }

  async queryWikipedia() {
    const { query } = this.props
    if (!query) {
      return
    }
    this.setState({
      queryInProgress: true,
    })
    console.log(`Querying Wikipedia with query ${query}`)
    const results = await fetchWikipediaResults(query)
    this.setState({
      responseData: results,
      queryInProgress: false,
    })
  }

  render() {
    const { responseData, queryInProgress } = this.state
    const pageData = get(responseData, 'query.pages[0]')
    if (queryInProgress) {
      return null
    }
    if (!pageData) {
      return <div>Nothing found</div>
    }
    // console.log(pageData)
    const {
      title,
      description,
      extract,
      fullurl: pageURL,
      thumbnail: { source: thumbnailURL } = {},
    } = pageData

    // Sanitize the HTML returned by Wikipedia.
    const extractSanitized = sanitizeHtml(extract, {
      allowedTags: [
        'h3',
        'h4',
        'h5',
        'h6',
        'blockquote',
        'p',
        'ul',
        'ol',
        'nl',
        'li',
        'b',
        'i',
        'strong',
        'em',
        'strike',
        'code',
        'hr',
        'br',
        'div',
        'table',
        'thead',
        'caption',
        'small',
      ],
      allowedAttributes: false,
    })
    return (
      <WikipediaPage
        title={title}
        description={description}
        thumbnailURL={thumbnailURL}
        extract={extractSanitized}
        pageURL={pageURL}
      />
    )
  }
}

WikipediaQuery.propTypes = {
  query: PropTypes.string.isRequired,
}

WikipediaQuery.defaultProps = {}

export default WikipediaQuery
