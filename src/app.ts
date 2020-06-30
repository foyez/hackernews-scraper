import { program } from 'commander'
import chalk from 'chalk'

import { HackerNewsScrapper } from './HackerNewScraper'

const fetchHackerNewPosts = async (): Promise<void> => {
  program
    .version('0.1.0', '-v, --version')
    .option('-p, --posts <posts>', 'Number of valid posts to extract')
    .parse(process.argv)

  // if (!program.posts) {
  //   console.log(
  //     chalk.yellow('Should run with -p flag. Example: hackernews -p 10'),
  //   )
  //   return
  // }

  try {
    const scrapper = new HackerNewsScrapper('https://news.ycombinator.com')
    const topPosts = await scrapper.getTopPosts(1)
    console.log(topPosts)
  } catch (err) {
    console.log(chalk.red(err))
  }
}

fetchHackerNewPosts()
