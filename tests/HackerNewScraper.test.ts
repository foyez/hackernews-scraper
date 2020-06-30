import { HackerNewsScrapper } from '../src/HackerNewScraper'

const scraper = new HackerNewsScrapper('https://news.ycombinator.com')

describe('HackerNewsScraper', () => {
  it('should set the url correctly during initialization', () => {
    expect(scraper.URL).toBe('https://news.ycombinator.com')
  })

  describe('getTopPosts()', () => {
    it('should throw an error when parameter is not in range from 1 to 100', () => {
      const errorMsg =
        'Number of posts should be a positive integer and less than or equal to 100'

      expect(scraper.getTopPosts(0)).toThrow(errorMsg)
    })
  })
})
