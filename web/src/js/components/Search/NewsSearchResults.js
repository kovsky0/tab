import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { get } from 'lodash/object'

// Make "time from" text much shorter:
// https://github.com/moment/moment/issues/2781#issuecomment-160739129
moment.locale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s',
    s: '%dm',
    ss: '%ss',
    m: '1%dm',
    mm: '%dm',
    h: '1%dh',
    hh: '%dh',
    d: '1%dd',
    dd: '%dd',
    M: '1%dM',
    MM: '%dM',
    y: '1%dY',
    yy: '%dY',
  },
})
// TODO: use class styles

const NewsSearchItem = props => {
  const {
    item: {
      contractualRules,
      datePublished,
      description,
      image,
      name,
      provider,
      url,
    },
  } = props
  // console.log('news item', props.item)

  // If the title or description are too long, slice them
  // and add ellipses.
  const MAX_DESC_CHARS = 125
  const MAX_TITLE_CHARS = 80
  const subtitle =
    description.length > MAX_DESC_CHARS
      ? `${description.slice(0, MAX_DESC_CHARS)} ...`
      : description
  const title =
    name.length > MAX_TITLE_CHARS
      ? `${name.slice(0, MAX_TITLE_CHARS)} ...`
      : name

  // TODO: flexbox + ellipses for organization name

  const timeSincePublished =
    datePublished && moment(datePublished).isValid()
      ? moment(datePublished).fromNow()
      : null
  return (
    <Paper
      elevation={1}
      style={{
        margin: '0px 12px 0px 0px',
        minWidth: 200,
        height: 254,
        fontFamily: 'arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {image ? (
        <a href={url} style={{ textDecoration: 'none' }}>
          <div
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              overflow: 'hidden',
              minHeight: 0,
              minWidth: 0,
            }}
          >
            <img src={image.thumbnail.contentUrl} alt="" />
          </div>
        </a>
      ) : null}
      <div
        style={{
          flex: 1,
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <a href={url} style={{ textDecoration: 'none' }}>
          <h3
            style={{
              fontFamily: 'Roboto, arial, sans-serif',
              color: '#1a0dab',
              margin: 0,
              fontSize: 16,
              fontWeight: 400,
              lineHeight: 1.38,
              minHeight: 0,
              minWidth: 0,
            }}
          >
            {title}
          </h3>
        </a>
        {// Only show the description if there is no image.
        image ? null : (
          <div
            style={{
              flex: 1,
              margin: 0,
              minHeight: 0,
              minWidth: 0,
            }}
          >
            <p
              style={{
                fontSize: 13,
                color: '#505050',
                overflowWrap: 'break-word',
                overflow: 'hidden',
              }}
            >
              {subtitle}
            </p>
          </div>
        )}
        <div style={{ display: 'flex', marginTop: 'auto' }}>
          {contractualRules ? (
            contractualRules.map((contractualRule, index) => {
              return (
                <p
                  data-test-id={'search-result-news-attribution'}
                  key={index}
                  style={{
                    flexShrink: 0,
                    margin: 0,
                    fontSize: 13,
                    color: '#007526',
                    lineHeight: 1.5,
                    minHeight: 0,
                    minWidth: 0,
                  }}
                >
                  {contractualRule.text}
                </p>
              )
            })
          ) : get(provider, '[0].name') ? (
            <p
              data-test-id={'search-result-news-attribution'}
              key={'attribution-text'}
              style={{
                flexShrink: 0,
                margin: 0,
                fontSize: 13,
                color: '#007526',
                lineHeight: 1.5,
                minHeight: 0,
                minWidth: 0,
              }}
            >
              {get(provider, '[0].name')}
            </p>
          ) : null}
          {timeSincePublished ? (
            <p
              data-test-id={'search-result-news-time-since'}
              style={{
                fontSize: 13,
                lineHeight: 1.5,
                color: 'rgba(0, 0, 0, 0.66)', // same color as search menu
                margin: 0,
              }}
            >
              &nbsp;· {timeSincePublished}
            </p>
          ) : null}
        </div>
      </div>
    </Paper>
  )
}

NewsSearchItem.propTypes = {
  item: PropTypes.shape({
    category: PropTypes.string,
    clusteredArticles: PropTypes.array,
    contractualRules: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string,
      })
    ),
    datePublished: PropTypes.string, // might not exist
    description: PropTypes.string,
    headline: PropTypes.bool,
    id: PropTypes.string, // might not exist
    image: PropTypes.shape({
      thumbnail: PropTypes.shape({
        contentUrl: PropTypes.string,
        height: PropTypes.number,
        width: PropTypes.number,
      }),
    }),
    mentions: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      })
    ),
    name: PropTypes.string.isRequired,
    provider: PropTypes.arrayOf(
      PropTypes.shape({
        _type: PropTypes.string,
        name: PropTypes.string,
        image: PropTypes.shape({
          thumbnail: PropTypes.shape({
            contentUrl: PropTypes.string,
          }),
        }),
      })
    ),
    url: PropTypes.string.isRequired,
    video: PropTypes.shape({
      allowHttpsEmbed: PropTypes.bool,
      embedHtml: PropTypes.string,
      motionThumbnailUrl: PropTypes.string,
      name: PropTypes.string,
      thumbnail: PropTypes.shape({
        height: PropTypes.number,
        width: PropTypes.number,
      }),
      thumbnailUrl: PropTypes.string,
    }),
  }).isRequired,
}

NewsSearchItem.defaultProps = {}

const NewsSearchResults = props => {
  const { newsItems } = props

  // Only display 3 news items. If we want to display more,
  // we need horizontal scrolling.
  const newsItemsToShow = newsItems.slice(0, 3)
  return (
    <div
      style={{
        fontFamily: 'arial, sans-serif',
        marginBottom: 24,
      }}
    >
      <Typography variant={'h6'} style={{ marginBottom: 8 }}>
        Top stories
      </Typography>
      <div
        style={{
          display: 'flex',
        }}
      >
        {newsItemsToShow.map(newsItem => (
          <NewsSearchItem key={newsItem.url} item={newsItem} />
        ))}
      </div>
    </div>
  )
}

NewsSearchResults.propTypes = {
  newsItems: PropTypes.arrayOf(NewsSearchItem.propTypes.item),
}

NewsSearchResults.defaultProps = {}

export default NewsSearchResults
