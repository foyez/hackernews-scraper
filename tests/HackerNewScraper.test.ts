import { HackerNewsScrapper } from '../src/HackerNewScraper'

const scraper = new HackerNewsScrapper('https://news.ycombinator.com')

describe('HackerNewsScraper', () => {
  it('should set the url correctly during initialization', () => {
    expect(scraper.URL).toBe('https://news.ycombinator.com')
  })

  describe('getTopPosts() - test for valid parameters', () => {
    const errorMsg =
      'Number of posts should be a positive integer and less than or equal to 100'

    // it('should throw an error when parameter is not given', async () => {
    //   await expect(scraper.getTopPosts()).rejects.toEqual(errorMsg)
    // })

    it('should throw an error when parameter is a 0', async () => {
      expect.assertions(1)
      await expect(scraper.getTopPosts(0)).rejects.toEqual(errorMsg)
    })

    it('should throw an error when parameter is a negative number', async () => {
      expect.assertions(1)
      await expect(scraper.getTopPosts(-1)).rejects.toEqual(errorMsg)
    })

    it('should throw an error when parameter is greater than 100', async () => {
      expect.assertions(1)
      await expect(scraper.getTopPosts(101)).rejects.toEqual(errorMsg)
    })

    it('should throw an error when parameter is fraction number', async () => {
      expect.assertions(1)
      await expect(scraper.getTopPosts(5.6)).rejects.toEqual(errorMsg)
    })

    it('should throw an error when parameter is a invalid number', async () => {
      expect.assertions(1)
      await expect(scraper.getTopPosts(NaN)).rejects.toEqual(errorMsg)
    })
  })
})
