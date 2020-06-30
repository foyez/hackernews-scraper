import axios from 'axios'
import cheerio from 'cheerio'
import validUrl from 'valid-url'

// interfaces
export interface Post {
  title: string
  uri: string
  author: string
  rank: number
  points: number
  numberOfComments: number
}

export class HackerNewsScrapper {
  URL: string

  constructor(URL: string) {
    this.URL = URL
  }

  /**
   * retrieve top n number of posts from hackernews
   * @param {number} numberOfPosts number posts want to retrieve
   * @return {Post[]}
   */
  async getTopPosts(numberOfPosts: number = 10): Promise<Post[]> {
    const numberOfPages = Math.ceil(numberOfPosts / 30)
    let page = 1
    let topPosts: Post[] = []

    if (!this._isValidProp(numberOfPosts)) {
      throw 'Number of posts should be a positive integer and less than or equal to 100'
    }

    while (page <= numberOfPages) {
      try {
        const { data } = await axios.get(`${this.URL}/news?p=${page}`)
        const posts = this._parseHtml(data, numberOfPosts)
        // topPosts = [...topPosts, ...posts]
        topPosts = topPosts.concat(posts)
      } catch (err) {
        const error = `${err} while hitting URL: ${this.URL}/news?p=${page}`
        throw error
      }

      page++
    }

    return topPosts
  }

  /**
   * validate that number should be positive and less than or equal to 100
   * @param {number} numberOfPosts
   * @return {boolean}
   */
  _isValidProp(numberOfPosts: number): boolean {
    return this._isPositiveInteger(numberOfPosts) && numberOfPosts <= 100
  }

  /**
   * Check the value is positive or not
   * @param {number} value
   * @return {boolean}
   */
  _isPositiveInteger(value: number): boolean {
    return Number.isInteger(value) && value > 0
  }

  /**
   * validate the string
   * @param {string} value
   * @return {boolean}
   */
  _isValidString(value: string): boolean {
    return value?.length <= 256
  }

  /**
   * validate the post
   * @param {Post} post post properties
   * @return {boolean}
   */
  _isValidPost({
    title,
    author,
    uri,
    rank,
    points,
    numberOfComments,
  }: Post): boolean {
    return (
      this._isValidString(title) &&
      this._isValidString(author) &&
      !!validUrl.isUri(uri) &&
      this._isPositiveInteger(rank) &&
      this._isPositiveInteger(points) &&
      this._isPositiveInteger(numberOfComments)
    )
  }

  /**
   * parse html from string
   * @param {string or Buffer} html
   * @param {number} numberOfPosts
   * @return {Post[]}
   */
  _parseHtml(html: string | Buffer, numberOfPosts: number): Post[] {
    const $ = cheerio.load(html)
    const rows = $('.athing')
    const parsedPosts = []

    if (!rows.length) {
      throw 'Not enough valid posts'
    }

    for (
      let i = 0;
      i < rows.length && parsedPosts.length < numberOfPosts;
      i++
    ) {
      const firstRow = rows[i] // firsRow contains title, uri and rank
      const secondRow = $(firstRow).next() // secondRow contains points, author and numberOfComments

      const post: Post = {
        title: $(firstRow).find('.storylink').text(),
        uri: $(firstRow).find('.storylink').attr('href') || '',
        author: $(secondRow).find('.hnuser').text(),
        rank: Number($(firstRow).find('.rank').text().split('.')[0]),
        points: Number($(secondRow).find('.score').text().split(' ')[0]),
        numberOfComments: Number(
          $(secondRow).find('.subtext').children().last().text().slice(0, -9),
        ),
      }

      if (this._isValidPost(post)) {
        parsedPosts.push(post)
      }
    }

    return parsedPosts
  }
}
